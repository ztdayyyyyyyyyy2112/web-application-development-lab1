
import type { AudioTask } from "../contracts/audio-contract";

// Shared AudioContext for decoding
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
  // 1. Reject already-cancelled tasks
  signal.throwIfAborted();

  // 2. Download the actual audio file
  console.log("Downloading:", task.trackUrl);

  const response = await fetch(task.trackUrl, {
    signal
  });

  // 3. Check HTTP status
  if (!response.ok) {
    throw new Error(
      `Audio download failed: HTTP ${response.status}`
    );
  }

  // 4. Read the complete audio file
  const arrayBuffer = await response.arrayBuffer();

  signal.throwIfAborted();

  // 5. Decode into an AudioBuffer
  const context = getAudioContext();

  console.log("Decoding:", task.trackUrl);

  const audioBuffer = await context.decodeAudioData(arrayBuffer);

  // 6. Discard the result if cancelled during decoding
  signal.throwIfAborted();

  console.log(
    "Audio ready:",
    task.trackUrl,
    "Duration:",
    audioBuffer.duration.toFixed(2),
    "seconds"
  );

  return audioBuffer;
}
