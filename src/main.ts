import "./style.css";

import { AudioTaskQueue } from "./queue/AudioTaskQueue";
import {
  realAudioProcessor,
  cleanupAudioDecoder
} from "./audio/realAudioProcessor";
import { AudioPlaybackEngine } from "./audio/AudioPlaybackEngine";

import type { AudioTask } from "./contracts/audio-contract";

// HTML Elements

const audioForm =
  document.querySelector<HTMLFormElement>("#audio-form");

const audioUrlInput =
  document.querySelector<HTMLInputElement>("#audio-url");

const taskList =
  document.querySelector<HTMLOListElement>("#audio-task-list");

const queueStatus =
  document.querySelector<HTMLElement>("#queue-status");

const cancelAllButton =
  document.querySelector<HTMLButtonElement>("#cancel-all-btn");

const playButton =
  document.querySelector<HTMLButtonElement>("#play-btn");

const stopButton =
  document.querySelector<HTMLButtonElement>("#stop-btn");

// FIFO Controller

const audioQueue = new AudioTaskQueue(realAudioProcessor);

// Playback Engine

const playbackEngine = new AudioPlaybackEngine();

// Decoded Audio Library

interface ReadyTrack {
  id: string;
  url: string;
  buffer: AudioBuffer;
}

const readyTracks: ReadyTrack[] = [];
// M4C - Maximum decoded tracks retained in memory
const MAX_READY_TRACKS = 5;
let selectedTrackId: string | null = null;
let isPlaying = false;
let playbackRequestId = 0;
let isStartingPlayback = false;

function updatePlaybackButtons(): void {
  if (playButton) {
    playButton.disabled =
      selectedTrackId === null;
  }

  if (stopButton) {
    stopButton.disabled =
      !isPlaying && !isStartingPlayback;
  }
}
// M4C - AudioBuffer memory management

function addReadyTrack(track: ReadyTrack): void {
  // Avoid duplicate task IDs
  const existingIndex = readyTracks.findIndex(
    (item) => item.id === track.id
  );

  if (existingIndex !== -1) {
    readyTracks.splice(existingIndex, 1);
  }

  readyTracks.push(track);

  // Limit retained decoded buffers
  while (readyTracks.length > MAX_READY_TRACKS) {
    const removedTrack = readyTracks.shift();

    if (!removedTrack) break;

    console.log(
      "Released audio buffer reference:",
      removedTrack.url
    );

    // If removed track was selected, select another
    if (selectedTrackId === removedTrack.id) {
      selectedTrackId = null;

      playbackRequestId++;
      isStartingPlayback = false;

      playbackEngine.stop();
      isPlaying = false;
    }
  }

  if (
    selectedTrackId === null &&
    readyTracks.length > 0
  ) {
    selectedTrackId = readyTracks[0].id;
  }

  renderReadyTracks();
  updatePlaybackButtons();
}
// Ready Track List

const readySection = document.createElement("section");

readySection.setAttribute(
  "aria-label",
  "Ready audio tracks"
);

const readyHeading = document.createElement("h3");
readyHeading.textContent = "Ready to Play";

const readyList = document.createElement("ul");
readyList.className = "task-list";

readySection.append(readyHeading, readyList);

taskList?.parentElement?.insertAdjacentElement(
  "afterend",
  readySection
);

// Render Ready Tracks

function renderReadyTracks(): void {
  readyList.replaceChildren();

  readyTracks.forEach((track) => {
    const item = document.createElement("li");

    item.className = "task-item";

    const selectButton = document.createElement("button");

    selectButton.type = "button";
    selectButton.textContent = track.url;

    selectButton.setAttribute(
      "aria-pressed",
      String(selectedTrackId === track.id)
    );

    selectButton.addEventListener("click", () => {
      selectedTrackId = track.id;
      renderReadyTracks();
      updatePlaybackButtons();
    });

    const duration = document.createElement("span");

    duration.textContent =
      `${track.buffer.duration.toFixed(1)} seconds`;

    item.append(selectButton, duration);

    readyList.appendChild(item);
  });
}



// Render Queue Task

function renderTask(task: AudioTask): HTMLLIElement {
  const item = document.createElement("li");

  item.className = "task-item";
  item.dataset.taskId = task.id;

  const trackName = document.createElement("span");
  trackName.className = "track-name";
  trackName.textContent = task.trackUrl;

  const status = document.createElement("span");
  status.className = "task-status";
  status.textContent = task.status;

  const cancelButton = document.createElement("button");

  cancelButton.type = "button";
  cancelButton.textContent = "Cancel";

  cancelButton.addEventListener("click", () => {
    audioQueue.cancel(task.id);
  });

  item.append(trackName, status, cancelButton);

  return item;
}

// Queue Subscription

audioQueue.subscribe((state) => {
  if (!taskList || !queueStatus) return;

  const visibleTasks = [
    ...(state.activeTask ? [state.activeTask] : []),
    ...state.pending
  ];

  taskList.replaceChildren(
    ...visibleTasks.map(renderTask)
  );

  queueStatus.textContent =
    `${state.pending.length} pending, ` +
    `${state.activeTask ? 1 : 0} processing.`;

  if (cancelAllButton) {
    cancelAllButton.disabled =
      visibleTasks.length === 0;
  }
});

// Add Audio URL

audioForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!audioUrlInput) return;

  const url = audioUrlInput.value.trim();

  if (!url) return;

  const { id, result } = audioQueue.enqueueTracked(url);

  void result.then(
    (buffer) => {
      // M4C - Store decoded audio with memory limit
addReadyTrack({
  id,
  url,
  buffer
});

      console.log("Audio ready:", url);
    },
    (error: unknown) => {
  const isCancelled =
    error instanceof DOMException &&
    error.name === "AbortError";

  if (isCancelled) {
    console.log("Task cancelled:", id);
    return;
  }

  console.error("Audio task failed:", error);

  const message =
    error instanceof Error
      ? error.message
      : "Unknown audio processing error";

  if (queueStatus) {
    queueStatus.textContent =
      `Failed to load ${url}: ${message}`;
  }
}
  );

  audioUrlInput.value = "";
  audioUrlInput.focus();
});

// Play Selected Track

// M4A - Race-safe Play

playButton?.addEventListener("click", async () => {
  const track = readyTracks.find(
    (item) => item.id === selectedTrackId
  );

  if (!track) return;

  // Identify this UI playback request
  const currentRequest = ++playbackRequestId;
  isStartingPlayback = true;
updatePlaybackButtons();

  try {
    const started = await playbackEngine.play(
      track.buffer,
      () => {
        if (currentRequest !== playbackRequestId) return;

        isPlaying = false;
        updatePlaybackButtons();

        console.log("Playback finished:", track.url);
      }
    );

    // Ignore outdated UI updates
    if (currentRequest !== playbackRequestId) {
      return;
    }

    if (!started) {
      return;
    }

    isPlaying = true;
    updatePlaybackButtons();

    console.log("Playing:", track.url);

    console.log(
      "FFT Bin Count:",
      playbackEngine.getFrequencyBinCount()
    );

    } catch (error) {
    if (currentRequest !== playbackRequestId) {
      return;
    }

    isPlaying = false;
    updatePlaybackButtons();

    console.error("Playback failed:", error);

  } finally {
    if (currentRequest === playbackRequestId) {
      isStartingPlayback = false;
      updatePlaybackButtons();
    }
  }
});

// Stop Playback

// M4A - Race-safe Stop

stopButton?.addEventListener("click", () => {

  // Invalidate previous UI playback requests
  playbackRequestId++;
  isStartingPlayback = false;
  playbackEngine.stop();

  isPlaying = false;
  updatePlaybackButtons();

  console.log("Playback stopped");
});

// Cancel All Queue Tasks

cancelAllButton?.addEventListener("click", () => {
  audioQueue.cancelAll();
});

// Cleanup

// M4C - Application lifecycle cleanup

window.addEventListener("pagehide", () => {
  // Stop pending and active queue operations
  audioQueue.cancelAll();

  // Invalidate playback UI requests
  playbackRequestId++;
  isStartingPlayback = false;
  isPlaying = false;

  // Release playback resources
  void playbackEngine.cleanup();

  // Release decoder resources
  void cleanupAudioDecoder();

  // Remove references to decoded tracks
  readyTracks.length = 0;

  selectedTrackId = null;
});

// Initial State

updatePlaybackButtons();