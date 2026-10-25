import { describe, it, expect, vi } from "vitest";

import { AudioTaskQueue } from "../queue/AudioTaskQueue";

import type { AudioTask } from "../contracts/audio-contract";

// Fake AudioBuffer used for unit testing.
// We do not need real audio decoding in queue tests.
const fakeBuffer = {} as AudioBuffer;

// Create a Promise that can be resolved manually.
function createDeferred<T>() {
  let resolve!: (value: T) => void;
  let reject!: (reason: Error) => void;

  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });

  return {
    promise,
    resolve,
    reject
  };
}

// Create a processor that waits until its AbortSignal is aborted.
function waitUntilAborted(
  signal: AbortSignal
): Promise<AudioBuffer> {
  return new Promise((_resolve, reject) => {
    const abort = () => {
      reject(
        new DOMException("Task cancelled", "AbortError")
      );
    };

    if (signal.aborted) {
      abort();
      return;
    }

    signal.addEventListener("abort", abort, {
      once: true
    });
  });
}

describe("AudioTaskQueue - FIFO Unit Tests", () => {

  // ==========================================
  // T01 - FIFO ORDER
  // ==========================================

  it("T01 - processes tasks in FIFO order", async () => {
    const executionOrder: string[] = [];

    const processor = vi.fn(
      async (task: AudioTask): Promise<AudioBuffer> => {
        executionOrder.push(task.trackUrl);

        return fakeBuffer;
      }
    );

    const queue = new AudioTaskQueue(processor);

    const task1 = queue.enqueue("/audio/test1.mp3");
    const task2 = queue.enqueue("/audio/test2.mp3");
    const task3 = queue.enqueue("/audio/test3.mp3");

    await Promise.all([task1, task2, task3]);

    expect(executionOrder).toEqual([
      "/audio/test1.mp3",
      "/audio/test2.mp3",
      "/audio/test3.mp3"
    ]);

    expect(processor).toHaveBeenCalledTimes(3);
  });


  // ==========================================
  // T02 - CONCURRENT ENQUEUE
  // ==========================================

  it("T02 - never processes two tasks simultaneously", async () => {
    let activeCount = 0;
    let maxActiveCount = 0;

    const firstGate = createDeferred<void>();

    const processor = vi.fn(
      async (task: AudioTask): Promise<AudioBuffer> => {
        activeCount++;

        maxActiveCount = Math.max(
          maxActiveCount,
          activeCount
        );

        if (task.trackUrl === "/audio/test1.mp3") {
          await firstGate.promise;
        }

        activeCount--;

        return fakeBuffer;
      }
    );

    const queue = new AudioTaskQueue(processor);

    const task1 = queue.enqueue("/audio/test1.mp3");
    const task2 = queue.enqueue("/audio/test2.mp3");
    const task3 = queue.enqueue("/audio/test3.mp3");

    // First task is blocked, so the others must wait.
    expect(processor).toHaveBeenCalledTimes(1);
    expect(queue.getState().pending).toHaveLength(2);

    firstGate.resolve();

    await Promise.all([task1, task2, task3]);

    expect(maxActiveCount).toBe(1);
    expect(activeCount).toBe(0);
    expect(processor).toHaveBeenCalledTimes(3);
  });


  // ==========================================
  // T03 - CANCEL PENDING TASK
  // ==========================================

  it("T03 - cancels a pending task before processing", async () => {
    const firstGate = createDeferred<void>();

    const processor = vi.fn(
      async (task: AudioTask): Promise<AudioBuffer> => {
        if (task.trackUrl === "/audio/test1.mp3") {
          await firstGate.promise;
        }

        return fakeBuffer;
      }
    );

    const queue = new AudioTaskQueue(processor);

    const task1 = queue.enqueueTracked(
      "/audio/test1.mp3"
    );

    const task2 = queue.enqueueTracked(
      "/audio/test2.mp3"
    );

    // Attach rejection handler before cancellation.
    const cancelledResult = expect(
      task2.result
    ).rejects.toMatchObject({
      name: "AbortError"
    });

    expect(queue.getState().pending).toHaveLength(1);

    queue.cancel(task2.id);

    await cancelledResult;

    expect(queue.getState().pending).toHaveLength(0);

    firstGate.resolve();

    await task1.result;

    // Only the first task should reach the processor.
    expect(processor).toHaveBeenCalledTimes(1);
  });


  // ==========================================
  // T04 - CANCEL ACTIVE TASK
  // ==========================================

  it("T04 - aborts the active task", async () => {
    let receivedSignal: AbortSignal | null = null;

    const processor = vi.fn(
      async (
        _task: AudioTask,
        signal: AbortSignal
      ): Promise<AudioBuffer> => {
        receivedSignal = signal;

        return waitUntilAborted(signal);
      }
    );

    const queue = new AudioTaskQueue(processor);

    const task = queue.enqueueTracked(
      "/audio/test1.mp3"
    );

    const cancelledResult = expect(
      task.result
    ).rejects.toMatchObject({
      name: "AbortError"
    });

    expect(queue.getState().activeTask?.id).toBe(
      task.id
    );

    queue.cancel(task.id);

    expect(receivedSignal).not.toBeNull();

expect(
  (receivedSignal as AbortSignal | null)?.aborted
).toBe(true);

    await cancelledResult;

    expect(queue.getState().activeTask).toBeNull();
    expect(queue.getState().isProcessing).toBe(false);
  });


  // ==========================================
  // T05 - CANCEL ALL
  // ==========================================

  it("T05 - cancels all active and pending tasks", async () => {
    const processor = vi.fn(
      async (
        _task: AudioTask,
        signal: AbortSignal
      ): Promise<AudioBuffer> => {
        return waitUntilAborted(signal);
      }
    );

    const queue = new AudioTaskQueue(processor);

    const task1 = queue.enqueueTracked(
      "/audio/test1.mp3"
    );

    const task2 = queue.enqueueTracked(
      "/audio/test2.mp3"
    );

    const task3 = queue.enqueueTracked(
      "/audio/test3.mp3"
    );

    // Handle all rejections before triggering cancellation.
    const resultsPromise = Promise.allSettled([
      task1.result,
      task2.result,
      task3.result
    ]);

    queue.cancelAll();

    const results = await resultsPromise;

    expect(
      results.every((result) => result.status === "rejected")
    ).toBe(true);

    expect(queue.getState().pending).toHaveLength(0);
    expect(queue.getState().activeTask).toBeNull();
    expect(queue.getState().isProcessing).toBe(false);

    // Pending tasks should never reach the processor.
    expect(processor).toHaveBeenCalledTimes(1);
  });


  // ==========================================
  // T06 - ERROR RECOVERY
  // ==========================================

  it("T06 - continues processing after a task fails", async () => {
    const executionOrder: string[] = [];

    const processor = vi.fn(
      async (task: AudioTask): Promise<AudioBuffer> => {
        executionOrder.push(task.trackUrl);

        if (task.trackUrl === "/audio/invalid.mp3") {
          throw new Error("Invalid audio file");
        }

        return fakeBuffer;
      }
    );

    const queue = new AudioTaskQueue(processor);

    const task1 = queue.enqueue(
      "/audio/invalid.mp3"
    );

    const task2 = queue.enqueue(
      "/audio/test2.mp3"
    );

    const results = await Promise.allSettled([
      task1,
      task2
    ]);

    expect(results[0].status).toBe("rejected");
    expect(results[1].status).toBe("fulfilled");

    expect(executionOrder).toEqual([
      "/audio/invalid.mp3",
      "/audio/test2.mp3"
    ]);

    expect(processor).toHaveBeenCalledTimes(2);

    expect(queue.getState().pending).toHaveLength(0);
    expect(queue.getState().activeTask).toBeNull();
    expect(queue.getState().isProcessing).toBe(false);
  });

});