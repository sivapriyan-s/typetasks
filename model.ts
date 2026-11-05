// 1. TaskStatus literal union
export type TaskStatus = "todo" | "in-progress" | "done";

// 2. Task interface
export interface Task {
  id: number;
  title: string;
  status: TaskStatus;
}

let nextId = 1;

// 3. addTask: Appends a new task with unique ID and "todo" status
export function addTask(tasks: Task[], title: string): Task[] {
  while (tasks.some((task) => task.id === nextId)) {
    nextId += 1;
  }

  const newTask: Task = {
    id: nextId++,
    title,
    status: "todo",
  };
  return [...tasks, newTask];
}

// 4. completeTask: Sets the task with matching ID to "done"
export function completeTask(tasks: Task[], id: number): Task[] {
  return tasks.map((task) =>
    task.id === id ? { ...task, status: "done" } : task
  );
}

// 5. filterByStatus: Returns tasks matching the given TaskStatus
export function filterByStatus(tasks: Task[], status: TaskStatus): Task[] {
  return tasks.filter((task) => task.status === status);
}

// 6. Originality requirement: Extra typed operation
export function deleteTask(tasks: Task[], id: number): Task[] {
  return tasks.filter((task) => task.id !== id);
}