let nextId = 1;
// 3. addTask: Appends a new task with unique ID and "todo" status
export function addTask(tasks, title) {
    const newTask = {
        id: nextId++,
        title,
        status: "todo",
    };
    return [...tasks, newTask];
}
// 4. completeTask: Sets the task with matching ID to "done"
export function completeTask(tasks, id) {
    return tasks.map((task) => task.id === id ? { ...task, status: "done" } : task);
}
// 5. filterByStatus: Returns tasks matching the given TaskStatus
export function filterByStatus(tasks, status) {
    return tasks.filter((task) => task.status === status);
}
// 6. Originality requirement: Extra typed operation
export function deleteTask(tasks, id) {
    return tasks.filter((task) => task.id !== id);
}
