import type { AudioTask } from "../contracts/audio-contract";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext || audioContext.state === "closed") {
    audioContext = new AudioContext();
  }

  return audioContext;
}

export async function realAudioProcessor(
  task: AudioTask,
  signal: AbortSignal
): Promise<AudioBuffer> {
  signal.throwIfAborted();

  try {
    console.log("Downloading:", task.trackUrl);

    const response = await fetch(task.trackUrl, {
      signal
    });

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    const arrayBuffer = await response.arrayBuffer();

    signal.throwIfAborted();

    if (arrayBuffer.byteLength === 0) {
      throw new Error("Audio file is empty");
    }

    console.log("Decoding:", task.trackUrl);

    const context = getAudioContext();

    let audioBuffer: AudioBuffer;

    try {
      audioBuffer = await context.decodeAudioData(arrayBuffer);
    } catch {
      signal.throwIfAborted();

      throw new Error(
        `Unable to decode audio: ${task.trackUrl}`
      );
    }

    signal.throwIfAborted();

    console.log(
      "Audio decoded:",
      task.trackUrl,
      audioBuffer.duration.toFixed(2),
      "seconds"
    );

    return audioBuffer;

  } catch (error) {
    if (signal.aborted) {
      console.log("Audio task cancelled:", task.trackUrl);

      throw signal.reason ??
        new DOMException(
          "Audio download cancelled",
          "AbortError"
        );
    }

    console.error(
      "Audio processing failed:",
      task.trackUrl,
      error
    );

    throw error;
  }
}
// M4C - Release decoder AudioContext

export async function cleanupAudioDecoder(): Promise<void> {
  const context = audioContext;

  audioContext = null;

  if (context && context.state !== "closed") {
    try {
      await context.close();
    } catch (error) {
      console.warn("Decoder AudioContext cleanup failed:", error);
    }
  }
}