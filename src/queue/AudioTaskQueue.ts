
import type {
  AudioTask,
  AudioQueueState
} from "../contracts/audio-contract";

type TaskProcessor = (
  task: AudioTask,
  signal: AbortSignal
) => Promise<AudioBuffer>;

type QueueListener = (state: AudioQueueState) => void;

interface PendingTask {
  task: AudioTask;
  controller: AbortController;
  resolve: (buffer: AudioBuffer) => void;
  reject: (error: Error) => void;
}

export class AudioTaskQueue {
  private pending: PendingTask[] = [];
  private active: PendingTask | null = null;
  private processing = false;

  private listeners = new Set<QueueListener>();

  private processor: TaskProcessor;

constructor(processor: TaskProcessor) {
  this.processor = processor;
}

  subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());

    return () => {
      this.listeners.delete(listener);
    };
  }

  getState(): AudioQueueState {
    return {
      pending: this.pending.map((item) => ({ ...item.task })),
      activeTask: this.active ? { ...this.active.task } : null,
      isProcessing: this.processing
    };
  }


  enqueue(trackUrl: string): Promise<AudioBuffer> {
    return this.enqueueTracked(trackUrl).result;
  }

  enqueueTracked(
    trackUrl: string
  ): { id: string; result: Promise<AudioBuffer> } {
    const task: AudioTask = {
      id: crypto.randomUUID(),
      trackUrl,
      status: "queued",
      createdAt: Date.now()
    };

    const controller = new AbortController();

    const result = new Promise<AudioBuffer>((resolve, reject) => {
      this.pending.push({
        task,
        controller,
        resolve,
        reject
      });

      this.notify();
      void this.processNext();
    });

    return {
      id: task.id,
      result
    };
  }


  cancel(taskId: string): void {
    const pendingIndex = this.pending.findIndex(
      (item) => item.task.id === taskId
    );

    if (pendingIndex !== -1) {
      const [item] = this.pending.splice(pendingIndex, 1);

      item.task.status = "cancelled";
      item.controller.abort();
      item.reject(
        new DOMException("Task cancelled", "AbortError")
      );

      this.notify();
      return;
    }

    if (this.active?.task.id === taskId) {
      this.active.task.status = "cancelled";
      this.active.controller.abort();
      this.notify();
    }
  }

  cancelAll(): void {
    const taskIds = this.pending.map(
      (item) => item.task.id
    );

    taskIds.forEach((id) => this.cancel(id));

    if (this.active) {
      this.cancel(this.active.task.id);
    }
  }

  private async processNext(): Promise<void> {
    if (this.processing) return;

    this.processing = true;

    try {
      while (this.pending.length > 0) {
        const item = this.pending.shift();

        if (!item) continue;

        this.active = item;
        item.task.status = "downloading";
        this.notify();

        try {
          const buffer = await this.processor(
            item.task,
            item.controller.signal
          );

          if (item.controller.signal.aborted) {
            throw new DOMException(
              "Task cancelled",
              "AbortError"
            );
          }

          item.task.status = "ready";
          item.resolve(buffer);
        } catch (error) {
          if (item.controller.signal.aborted) {
            item.task.status = "cancelled";
          } else {
            item.task.status = "error";
            item.task.error =
              error instanceof Error
                ? error.message
                : String(error);
          }

          item.reject(
            error instanceof Error
              ? error
              : new Error(String(error))
          );
        } finally {
          this.active = null;
          this.notify();
        }
      }
    } finally {
      this.processing = false;
      this.notify();
    }
  }

  private notify(): void {
    const state = this.getState();

    this.listeners.forEach((listener) => {
      listener(state);
    });
  }
}
