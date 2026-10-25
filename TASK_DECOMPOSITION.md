
# LAB 2 - HW2: Concurrent FIFO Audio Visualizer Queue Engine

## Project Objective

Build a Web Audio application with a FIFO task queue,
audio frequency analysis and real-time visualization.

## Architecture

User Interface
    ↓
Audio Task Queue (FIFO)
    ↓
Audio Engine
    ↓
AnalyserNode
    ↓
Canvas Visualizer

## M0 - Architecture & Contracts

- Define TypeScript interfaces.
- Separate queue logic from audio processing.
- Define cancellation and cleanup behavior.
- Establish performance requirements.


### M1 - Semantic Audio Queue Interface

Objective:
Build a responsive and accessible interface for the audio queue.

Contract:
- Provide an audio URL input with visible label.
- Provide Add to Queue button.
- Display queue items using semantic list elements.
- Provide Play, Stop, Cancel All controls.
- Provide a Canvas visualizer region.
- Announce queue state changes using aria-live.
- No audio processing logic in M1.
- No external UI frameworks.

Verification:
- Interface renders successfully.
- All input and buttons are keyboard accessible.
- No horizontal overflow at 375px.
- No JavaScript console errors.

## M2 - FIFO Queue Controller

- Accept multiple audio tasks.
- Process tasks in FIFO order.
- Maintain queue state.
- Prevent duplicate processing.
- Isolate the queue from UI logic.
### M2A - FIFO Queue Controller

Objective:
Implement a standalone FIFO task queue.

Contract:
- Tasks are processed in arrival order.
- Only one task is actively processed at a time.
- Enqueue returns a Promise<AudioBuffer>.
- Queue processing must be independent from the UI.
- Failed tasks must not block the queue.
- Support cancellation of pending and active tasks.
- Prevent duplicate processing.
- Preserve task status information.

Verification:
- Enqueue A, B and C.
- Verify processing order A -> B -> C.
- Verify only one active task.
- Verify cancelled tasks are skipped.
- Verify errors do not block subsequent tasks.

### M2B - FIFO Queue UI Integration

Objective:
Connect AudioTaskQueue to the user interface.

Contract:
- The UI must not maintain an independent task queue.
- Enqueue must return a usable task ID.
- UI updates are received through subscribe().
- Support individual cancellation.
- Support Cancel All.
- Show pending and active task statuses.
- Handle rejected Promises without unhandled errors.
- Preserve FIFO processing order.
- Use a simulated audio processor before M3.

Verification:
- Add three audio URLs.
- Verify tasks enter the queue in FIFO order.
- Verify one active task at a time.
- Cancel an individual pending task.
- Cancel the active task.
- Test Cancel All.
- Verify zero uncaught JavaScript errors.
## M3 - Web Audio Engine

- Create AudioContext.
- Fetch and decode audio resources.
- Use AudioBufferSourceNode.
- Connect AnalyserNode.
- Configure FFT size 256 or 512.
### M3A - Real Audio Fetch & Decode

Objective:
Replace the mock audio processor with real audio decoding.

Contract:
- Use fetch() to download audio files.
- Use AbortSignal to support cancellation.
- Validate HTTP response status.
- Decode using AudioContext.decodeAudioData().
- Return a valid AudioBuffer.
- Handle invalid files and network errors.
- Preserve FIFO processing order.
- Separate audio processing from UI.

Verification:
- Load a real MP3/WAV file.
- Verify decoded AudioBuffer duration.
- Verify FIFO order with multiple files.
- Verify failed downloads do not block the queue.
- Verify Cancel interrupts active fetch.
- Verify there are no unhandled Promise rejections.
### M3C - FFT Frequency Analyser

Objective:
Integrate Web Audio API AnalyserNode into the playback engine.

Contract:
- Use AnalyserNode for real-time audio frequency analysis.
- Configure fftSize = 512.
- Provide 256 frequency bins.
- Connect AudioBufferSourceNode to AnalyserNode.
- Connect AnalyserNode to AudioDestinationNode.
- Expose frequency data through a public method.
- Preserve existing Play and Stop functionality.
- Avoid creating multiple analyser nodes unnecessarily.
- Ensure proper audio node cleanup.

Verification:
- Audio playback still works.
- AnalyserNode returns 256 frequency bins.
- Frequency values remain within 0-255.
- Frequency data changes during playback.
- Stop terminates audio playback.
- No JavaScript console errors.

## M4 - Cancellation & Cleanup

- Use AbortController for downloads.
- Cancel pending and active tasks.
- Disconnect obsolete audio nodes.
- Avoid resource leaks.
### M4A - Playback Race Condition Prevention

Objective:
Prevent stale asynchronous playback requests from starting audio.

Contract:
- Only the latest playback request may start audio.
- Stop invalidates pending playback requests.
- Switching tracks stops the previous source.
- Repeated Play/Stop must not create overlapping sources.
- Stale callbacks must not modify current playback state.
- Preserve FFT analyser functionality.

Verification:
- Rapidly click Play and Stop.
- Switch between two tracks.
- Verify only one track plays at a time.
- Verify Stop prevents pending playback from starting.
- Verify FFT still returns 256 frequency bins.
- Verify no uncaught JavaScript errors.
### M4B - Cancellation & Async Error Handling

Objective:
Ensure safe cancellation and error recovery in the FIFO audio queue.

Contract:
- Cancel pending tasks without processing them.
- Abort active downloads using AbortController.
- Ignore decoded results from cancelled tasks.
- Continue processing subsequent tasks after failures.
- Handle HTTP errors and invalid audio files.
- Avoid unhandled Promise rejections.
- Preserve FIFO processing order.

Verification:
- Cancel a pending task.
- Cancel an active download.
- Cancel all queued tasks.
- Load a nonexistent audio file.
- Load an invalid audio file.
- Verify subsequent valid tasks still complete.
- Verify cancelled tracks never appear in Ready to Play.
## M5 - Visualizer

- Render FFT frequency data using Canvas.
- Use requestAnimationFrame.
- Target smooth rendering near 60 FPS.
- Avoid unnecessary DOM updates.

## M6 - Verification

- Test FIFO order.
- Test concurrent enqueue requests.
- Test cancellation.
- Test playback cleanup.
- Test visualizer performance.
- Verify no uncaught JavaScript errors.
```

## Bước 5 – Tạo TypeScript Contract

Trong `src`, tạo folder:

```text
src/
└── contracts/
    └── audio-contract.ts
```

Dán nội dung:

<CodeBlock language="typescript" editable>
export type AudioTaskStatus =
  | "queued"
  | "downloading"
  | "decoding"
  | "ready"
  | "playing"
  | "completed"
  | "cancelled"
  | "error";

export interface AudioTask {
  id: string;
  trackUrl: string;
  status: AudioTaskStatus;
  createdAt: number;
  error?: string;
}

export interface AudioQueueState {
  pending: AudioTask[];
  activeTask: AudioTask | null;
  isProcessing: boolean;
}

export interface AudioQueueController {
  enqueue(trackUrl: string): Promise<AudioBuffer>;
  cancel(taskId: string): void;
  cancelAll(): void;
}

export interface AudioEngine {
  initialize(): Promise<void>;
  decode(data: ArrayBuffer): Promise<AudioBuffer>;
  play(buffer: AudioBuffer): void;
  stop(): void;
  cleanup(): void;
}
