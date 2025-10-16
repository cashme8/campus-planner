import { tasks, addTask, cap } from './state.js';
import { validate } from './validators.js';
import { compileRegex, highlight } from './search.js';
import { save } from './storage.js';

// DOM elements
const tbody = document.querySelector('#taskTable tbody');
const form = document.querySelector('#taskForm');
const searchInput = document.querySelector('#search');
const errorsDiv = document.querySelector('#formErrors');
const statsDiv = document.querySelector('#stats');
const capInput = document.querySelector('#cap');

// ------------------- Render Functions -------------------
function renderTasks(re = null) {
  tbody.innerHTML = '';
  tasks.forEach(task => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${highlight(task.title, re)}</td>
      <td>${task.dueDate}</td>
      <td>${task.duration}</td>
      <td>${highlight(task.tag, re)}</td>
      <td>
        <button onclick="editTask('${task.id}')">Edit</button>
        <button class="delete-btn" onclick="deleteTask('${task.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
  renderStats();
}

function renderStats() {
  statsDiv.innerHTML = '';
  const totalTasks = tasks.length;
  const totalDuration = tasks.reduce((sum, t) => sum + Number(t.duration), 0);
  const tagCounts = {};
  tasks.forEach(t => tagCounts[t.tag] = (tagCounts[t.tag] || 0) + 1);
  const topTag = Object.entries(tagCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';
  
  // Last 7-day trend
  const today = new Date();
  const last7Days = tasks.filter(t => {
    const d = new Date(t.dueDate);
    const diff = (today - d) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  }).length;

  statsDiv.innerHTML = `
    <div>Total Tasks: ${totalTasks}</div>
    <div>Total Duration: ${totalDuration} min</div>
    <div>Top Tag: ${topTag}</div>
    <div>Tasks Last 7 Days: ${last7Days}</div>
    <div>Weekly Cap: ${capInput.value || cap} min</div>
  `;
}

// ------------------- Task Functions -------------------
form.addEventListener('submit', e => {
  e.preventDefault();
  const task = {
    title: form.title.value.trim(),
    dueDate: form.dueDate.value,
    duration: form.duration.value,
    tag: form.tag.value.trim()
  };
  const errors = validate(task);
  if (errors.length) {
    errorsDiv.textContent = errors.join(', ');
  } else {
    // Add or edit
    if (form.dataset.editId) {
      updateTask(form.dataset.editId, task);
      form.dataset.editId = '';
    } else {
      addTask(task);
    }
    form.reset();
    errorsDiv.textContent = '';
    renderTasks();
  }
});

// ------------------- Edit / Update -------------------
window.editTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;
  form.title.value = task.title;
  form.dueDate.value = task.dueDate;
  form.duration.value = task.duration;
  form.tag.value = task.tag;
  form.dataset.editId = id;
};

function updateTask(id, updated) {
  const index = tasks.findIndex(t => t.id === id);
  if (index === -1) return;
  tasks[index] = {
    ...tasks[index],
    ...updated,
    updatedAt: new Date().toISOString()
  };
  save(tasks);
}

// ------------------- Delete -------------------
window.deleteTask = function(id) {
  const i = tasks.findIndex(t => t.id === id);
  if (i !== -1) {
    tasks.splice(i, 1);
    save(tasks);
    renderTasks();
  }
};

// ------------------- Regex Search -------------------
searchInput.addEventListener('input', () => {
  const re = compileRegex(searchInput.value);
  renderTasks(re);
});

// ------------------- Cap/Target Settings -------------------
capInput.value = cap; // default
capInput.addEventListener('change', () => {
  saveCap(Number(capInput.value));
  renderStats();
});

function saveCap(value) {
  localStorage.setItem('planner:cap', value);
}

// Load cap from localStorage if present
const storedCap = localStorage.getItem('planner:cap');
if (storedCap) capInput.value = Number(storedCap);

// ------------------- Initial Render -------------------
renderTasks();
