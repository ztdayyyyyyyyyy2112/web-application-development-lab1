
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

## M1 - User Interface

- Create semantic HTML interface.
- Add track URL input.
- Add Enqueue, Play, Stop and Cancel controls.
- Add accessible queue status.
- Create Canvas visualization region.

## M2 - FIFO Queue Controller

- Accept multiple audio tasks.
- Process tasks in FIFO order.
- Maintain queue state.
- Prevent duplicate processing.
- Isolate the queue from UI logic.

## M3 - Web Audio Engine

- Create AudioContext.
- Fetch and decode audio resources.
- Use AudioBufferSourceNode.
- Connect AnalyserNode.
- Configure FFT size 256 or 512.

## M4 - Cancellation & Cleanup

- Use AbortController for downloads.
- Cancel pending and active tasks.
- Disconnect obsolete audio nodes.
- Avoid resource leaks.

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
