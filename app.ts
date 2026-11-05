import {
  advanceTask,
  addTask,
  deleteTask,
  filterByStatus,
  type Task,
  type TaskStatus,
} from "./model.js";

type TaskFilter = "all" | TaskStatus;

function getRequiredElement<T extends HTMLElement>(
  id: string,
  elementType: { new (): T },
): T {
  const element = document.getElementById(id);
  if (!(element instanceof elementType)) {
    throw new Error(`The TypeTasks page is missing the "${id}" element.`);
  }
  return element;
}

const form = getRequiredElement("task-form", HTMLFormElement);
const titleInput = getRequiredElement("task-title", HTMLInputElement);
const taskList = getRequiredElement("task-list", HTMLUListElement);
const filterControls = getRequiredElement("filters", HTMLElement);
const taskCount = getRequiredElement("task-count", HTMLElement);
const emptyState = getRequiredElement("empty-state", HTMLElement);
const feedback = getRequiredElement("feedback", HTMLElement);

let tasks: Task[] = [];
let currentFilter: TaskFilter = "all";

function visibleTasks(): Task[] {
  return currentFilter === "all"
    ? tasks
    : filterByStatus(tasks, currentFilter);
}

function render(): void {
  taskList.replaceChildren();
  const displayedTasks = visibleTasks();

  for (const task of displayedTasks) {
    const item = document.createElement("li");
    item.className = "task-card";

    const taskInfo = document.createElement("div");
    taskInfo.className = "task-info";

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const badge = document.createElement("span");
    badge.className = `status-badge status-${task.status}`;
    badge.textContent = task.status;

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const advanceButton = document.createElement("button");
    advanceButton.className = "advance-button";
    advanceButton.type = "button";
    advanceButton.textContent =
      task.status === "done" ? "Completed" : "Advance";
    advanceButton.disabled = task.status === "done";
    advanceButton.setAttribute(
      "aria-label",
      task.status === "done"
        ? `${task.title} is complete`
        : `Advance ${task.title}`,
    );
    advanceButton.addEventListener("click", () => {
      tasks = advanceTask(tasks, task.id);
      render();
    });

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.textContent = "Remove";
    deleteButton.setAttribute("aria-label", `Remove ${task.title}`);
    deleteButton.addEventListener("click", () => {
      tasks = deleteTask(tasks, task.id);
      render();
    });

    taskInfo.append(title, badge);
    actions.append(advanceButton, deleteButton);
    item.append(taskInfo, actions);
    taskList.append(item);
  }

  taskCount.textContent = `${tasks.length} ${
    tasks.length === 1 ? "task" : "tasks"
  }`;
  emptyState.textContent =
    tasks.length === 0
      ? "Your list is clear. Add a task to get started."
      : `No ${currentFilter === "in-progress" ? "in-progress" : currentFilter} tasks right now.`;

  for (const button of filterControls.querySelectorAll<HTMLButtonElement>(
    "[data-filter]",
  )) {
    const isSelected = button.dataset.filter === currentFilter;
    button.classList.toggle("is-selected", isSelected);
    button.setAttribute("aria-pressed", String(isSelected));
  }
}

form.addEventListener("submit", (event: SubmitEvent) => {
  event.preventDefault();
  const title = titleInput.value.trim();

  if (!title) {
    feedback.textContent = "Add a short title before saving.";
    titleInput.focus();
    return;
  }

  tasks = addTask(tasks, title);
  titleInput.value = "";
  feedback.textContent = `Added "${title}".`;
  titleInput.focus();
  render();
});

filterControls.addEventListener("click", (event: MouseEvent) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const button = target.closest<HTMLButtonElement>("[data-filter]");
  const filter = button?.dataset.filter;
  if (
    !button ||
    (filter !== "all" &&
      filter !== "todo" &&
      filter !== "in-progress" &&
      filter !== "done")
  ) {
    return;
  }

  currentFilter = filter;
  render();
});

render();
