import { load, save } from './storage.js';

export let tasks = load();
export let cap = Number(localStorage.getItem('planner:cap')) || 600;

// Add a new task
export function addTask(task) {
  task.id = Date.now().toString();
  task.createdAt = new Date().toISOString();
  task.updatedAt = task.createdAt;
  tasks.push(task);
  save(tasks);
}

// Update existing task
export function updateTask(id, updatedFields) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    Object.assign(task, updatedFields, { updatedAt: new Date().toISOString() });
    save(tasks);
  }
}

// Delete a task
export function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save(tasks);
}

// Update cap
export function setCap(newCap) {
  cap = Number(newCap);
  localStorage.setItem('planner:cap', cap);
}

