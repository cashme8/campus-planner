import { load, save } from './storage.js';
export let tasks = load();
export let cap = 600;

export function addTask(task) {
  task.id = Date.now().toString();
  task.createdAt = new Date().toISOString();
  task.updatedAt = task.createdAt;
  tasks.push(task);
  save(tasks);
}
