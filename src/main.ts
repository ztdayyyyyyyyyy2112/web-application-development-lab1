import "./style.css";

import { AudioTaskQueue } from "./queue/AudioTaskQueue";
import { realAudioProcessor } from "./audio/realAudioProcessor";
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

let selectedTrackId: string | null = null;
let isPlaying = false;

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

// Update Buttons

function updatePlaybackButtons(): void {
  if (playButton) {
    playButton.disabled =
      selectedTrackId === null;
  }

  if (stopButton) {
    stopButton.disabled = !isPlaying;
  }
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
      readyTracks.push({
        id,
        url,
        buffer
      });

      if (selectedTrackId === null) {
        selectedTrackId = id;
      }

      renderReadyTracks();
      updatePlaybackButtons();

      console.log("Audio ready:", url);
    },
    (error: unknown) => {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        console.log("Task cancelled:", id);
        return;
      }

      console.error("Audio task failed:", error);

      if (queueStatus) {
        queueStatus.textContent =
          `Failed to load: ${url}`;
      }
    }
  );

  audioUrlInput.value = "";
  audioUrlInput.focus();
});

// Play Selected Track

playButton?.addEventListener("click", async () => {
  const track = readyTracks.find(
    (item) => item.id === selectedTrackId
  );

  if (!track) return;

  try {
    await playbackEngine.play(track.buffer, () => {
      isPlaying = false;
      updatePlaybackButtons();
    });

    isPlaying = true;
    updatePlaybackButtons();

    console.log("Playing:", track.url);
  } catch (error) {
    isPlaying = false;
    updatePlaybackButtons();
    console.error("Playback failed:", error);
  }
});

// Stop Playback

stopButton?.addEventListener("click", () => {
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

window.addEventListener("pagehide", () => {
  audioQueue.cancelAll();
  void playbackEngine.cleanup();
});

// Initial State

updatePlaybackButtons();