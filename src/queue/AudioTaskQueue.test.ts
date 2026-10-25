
import { describe, it, expect, vi } from "vitest";
import { AudioTaskQueue } from "./AudioTaskQueue";

describe("AudioTaskQueue", () => {
  it("processes tasks in FIFO order", async () => {
    const order: string[] = [];

    const processor = vi.fn(async (task) => {
      order.push(task.trackUrl);
      return {} as AudioBuffer;
    });

    const queue = new AudioTaskQueue(processor);

    const results = await Promise.all([
      queue.enqueue("A.wav"),
      queue.enqueue("B.wav"),
      queue.enqueue("C.wav")
    ]);

    expect(order).toEqual(["A.wav", "B.wav", "C.wav"]);
    expect(results).toHaveLength(3);
  });
});
