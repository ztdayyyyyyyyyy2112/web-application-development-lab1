# Concurrent FIFO Audio Visualizer Queue Engine

A web-based audio processing and visualization application built with TypeScript, Vite, Web Audio API, and HTML Canvas.

The project demonstrates asynchronous task management, FIFO scheduling, cancellation, playback race-condition prevention, memory management, and real-time audio frequency visualization.

## 1. Project Overview

The application allows users to submit audio URLs for processing.

Audio tasks are managed by a FIFO queue to ensure sequential execution.

After downloading and decoding, audio tracks become available for playback.

During playback, the Web Audio API provides frequency-domain data that is rendered as animated bars using HTML Canvas.

## 2. Technologies

- TypeScript
- Vite
- HTML5
- CSS3
- Web Audio API
- Canvas 2D API
- AbortController
- ResizeObserver
- Vitest
- Git and GitHub

## 3. Core Features

### FIFO Audio Processing

Audio tasks are processed in the order they are submitted.

The queue prevents multiple tasks from being processed simultaneously.

### Cancellation

Users can cancel individual tasks or all unfinished tasks.

AbortController is used to interrupt active network requests.

### Error Recovery

Failed tasks do not prevent subsequent tasks from being processed.

HTTP errors and audio decoding errors are handled.

### Audio Playback

Decoded audio is played using AudioBufferSourceNode.

Playback requests are protected against asynchronous race conditions.

### Real-Time Audio Visualization

Audio frequency data is obtained using AnalyserNode.

Configuration:

- FFT size: 512
- Frequency bins: 256
- Visualizer bars: 64
- Rendering target: approximately 60 FPS

### Memory Management

The application limits the number of retained decoded audio tracks.

Audio resources are cleaned up when no longer required.

## 4. System Architecture

```text
User Interface
      |
      v
AudioTaskQueue
      |
      v
FIFO Task Scheduler
      |
      v
Fetch API + AbortController
      |
      v
AudioContext.decodeAudioData()
      |
      v
Decoded AudioBuffer
      |
      v
AudioPlaybackEngine
      |
      v
AudioBufferSourceNode
      |
      v
AnalyserNode (FFT 512)
      |
      v
256 Frequency Bins
      |
      v
CanvasVisualizer
      |
      v
64 Animated Frequency Bars
```

## 5. Project Structure

```text
src/
├── audio/
│   ├── AudioPlaybackEngine.ts
│   └── realAudioProcessor.ts
├── contracts/
│   └── audio-contract.ts
├── queue/
│   └── AudioTaskQueue.ts
├── tests/
│   └── AudioTaskQueue.test.ts
├── visualizer/
│   └── CanvasVisualizer.ts
├── main.ts
└── style.css
```

## 6. Installation

Requirements:

- Node.js
- npm

Clone the repository:

```bash
git clone <repository-url>
```

Navigate to the project directory:

```bash
cd hw2-audio-visualizer
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the local URL displayed by Vite.

## 7. Usage

1. Enter a valid audio URL.
2. Add the audio task to the FIFO queue.
3. Wait for downloading and decoding.
4. Select a track from Ready to Play.
5. Click Play.
6. Observe the real-time frequency visualizer.
7. Click Stop to stop playback.

Users can also cancel pending or active tasks.

## 8. Automated Testing

Vitest is used for unit testing.

Run:

```bash
npm run test
```

The FIFO test suite includes:

| Test | Description |
|------|-------------|
| T01 | FIFO processing order |
| T02 | Concurrent enqueue protection |
| T03 | Pending task cancellation |
| T04 | Active task cancellation |
| T05 | Cancel all tasks |
| T06 | Error recovery |

## 9. Performance Verification

Performance is evaluated using Chrome DevTools.

Verification areas:

- Canvas rendering FPS
- Memory usage
- FIFO concurrency
- Cancellation behavior
- Audio resource cleanup

Detailed results are documented in:

`docs/PERFORMANCE_REPORT.md`

## 10. Build

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## 11. Technical Concepts

The project demonstrates:

- Asynchronous programming
- Promise-based task processing
- FIFO scheduling
- Concurrency control
- AbortController cancellation
- Race-condition prevention
- Web Audio API
- FFT frequency analysis
- Canvas animation
- Resource lifecycle management
- Unit testing

## 12. Documentation

Additional documentation:

- `TASK_DECOMPOSITION.md`
- `docs/PERFORMANCE_REPORT.md`
- `docs/evidence/`

## 13. Project Status

Implementation milestones M1–M5 completed.

Automated testing and performance verification are documented separately.

## 14. License

Educational project developed for Web Development coursework.