
import "./style.css";

import { AudioTaskQueue } from "./queue/AudioTaskQueue";
import { mockAudioProcessor } from "./audio/mockAudioProcessor";
import type { AudioTask } from "./contracts/audio-contract";

// M2B - Get HTML elements

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

// Create FIFO Queue Controller

const audioQueue = new AudioTaskQueue(mockAudioProcessor);

// Create an HTML list item for each audio task

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

  cancelButton.setAttribute(
    "aria-label",
    `Cancel audio task ${task.trackUrl}`
  );

  cancelButton.addEventListener("click", () => {
    audioQueue.cancel(task.id);
  });

  item.append(trackName, status, cancelButton);

  return item;
}

// Listen for changes to the FIFO Queue

audioQueue.subscribe((state) => {
  if (!taskList || !queueStatus) return;

  const activeTasks = state.activeTask
    ? [state.activeTask]
    : [];

  const visibleTasks = [
    ...activeTasks,
    ...state.pending
  ];

  taskList.replaceChildren(
    ...visibleTasks.map(renderTask)
  );

  const pendingCount = state.pending.length;
  const activeCount = state.activeTask ? 1 : 0;

  queueStatus.textContent =
    `${pendingCount} pending, ${activeCount} processing.`;

  if (cancelAllButton) {
    cancelAllButton.disabled =
      pendingCount + activeCount === 0;
  }
});

// Add audio tasks to queue

audioForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!audioUrlInput) return;

  const url = audioUrlInput.value.trim();

  if (!url) return;

  const { id, result } = audioQueue.enqueueTracked(url);

  console.log("Task enqueued:", id);

  void result.then(
    () => {
      console.log("Task completed:", id);
    },
    (error: unknown) => {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        console.log("Task cancelled:", id);
        return;
      }

      console.error("Audio task failed:", id, error);

      if (queueStatus) {
        queueStatus.textContent =
          `Audio task failed: ${id}`;
      }
    }
  );

  audioUrlInput.value = "";
  audioUrlInput.focus();
});

// Cancel all audio tasks

cancelAllButton?.addEventListener("click", () => {
  audioQueue.cancelAll();
});
