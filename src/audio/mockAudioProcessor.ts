
import type { AudioTask } from "../contracts/audio-contract";

export function mockAudioProcessor(
  task: AudioTask,
  signal: AbortSignal
): Promise<AudioBuffer> {
  return new Promise((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Cancelled", "AbortError"));
      return;
    }

    console.log("Processing:", task.trackUrl);

    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException("Cancelled", "AbortError"));
    };

    const timer = setTimeout(() => {
      signal.removeEventListener("abort", onAbort);

      if (signal.aborted) {
        reject(new DOMException("Cancelled", "AbortError"));
        return;
      }

      const buffer = new AudioBuffer({
        length: 44100,
        sampleRate: 44100,
        numberOfChannels: 1
      });

      resolve(buffer);
    }, 2000);

    signal.addEventListener("abort", onAbort, { once: true });
  });
}
