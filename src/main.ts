
import "./style.css";
import type { AudioTask } from "./contracts/audio-contract.ts";

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

const tasks: AudioTask[] = [];

function createTask(url: string): AudioTask {
  return {
    id: crypto.randomUUID(),
    trackUrl: url,
    status: "queued",
    createdAt: Date.now()
  };
}

function renderTasks(): void {
  if (!taskList || !queueStatus) return;

  taskList.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = "task-item";

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
      const index = tasks.findIndex(
        (item) => item.id === task.id
      );

      if (index !== -1) {
        tasks.splice(index, 1);
        renderTasks();
      }
    });

    item.append(trackName, status, cancelButton);
    taskList.appendChild(item);
  });

  queueStatus.textContent =
    `${tasks.length} audio task(s) in queue.`;

  if (cancelAllButton) {
    cancelAllButton.disabled = tasks.length === 0;
  }
}

audioForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!audioUrlInput) return;

  const url = audioUrlInput.value.trim();

  if (!url) return;

  tasks.push(createTask(url));

  audioUrlInput.value = "";
  renderTasks();
  audioUrlInput.focus();
});

cancelAllButton?.addEventListener("click", () => {
  tasks.length = 0;
  renderTasks();
});

renderTasks();
