import { tasks, addTask, updateTask, deleteTask, cap, setCap } from './state.js';
import { validate } from './validators.js';
import { compileRegex, highlight } from './search.js';

const tbody = document.querySelector('#taskTable tbody');
const form = document.querySelector('#taskForm');
const searchInput = document.querySelector('#search');
const errorsDiv = document.querySelector('#formErrors');
const statsDiv = document.getElementById('stats');
const capInput = document.getElementById('cap');

let editingId = null;

// Render tasks table
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
        <button onclick="deleteTask('${task.id}')">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}


// Update stats dashboard
function updateStats() {
  const totalTasks = tasks.length;
  const totalDuration = tasks.reduce((sum, t) => sum + Number(t.duration), 0);
  const capRemaining = cap - totalDuration;
  // Last 7 days count
  const last7Days = tasks.filter(t => {
    const taskDate = new Date(t.dueDate);
    const diff = (new Date() - taskDate) / (1000 * 60 * 60 * 24);
    return diff <= 7 && diff >= 0;
  }).length;

  statsDiv.innerHTML = `
    <div>Total Tasks: ${totalTasks}</div>
    <div>Total Duration: ${totalDuration} min</div>
    <div>Cap Remaining: ${capRemaining >= 0 ? capRemaining : 0} min</div>
    <div>Tasks Last 7 Days: ${last7Days}</div>
  `;
}

// Default form submit behavior
function defaultSubmit(e) {
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
    return;
  }

  if (editingId) {
    updateTask(editingId, task);
    editingId = null;
  } else {
    addTask(task);
  }

  form.reset();
  errorsDiv.textContent = '';
  renderTasks();
}

// Form submit
form.addEventListener('submit', defaultSubmit);

// Edit task
window.editTask = function(id) {
  const task = tasks.find(t => t.id === id);
  if (!task) return;

  // Populate form
  form.title.value = task.title;
  form.dueDate.value = task.dueDate;
  form.duration.value = task.duration;
  form.tag.value = task.tag;

  // Change form submit behavior
  form.onsubmit = function(e) {
    e.preventDefault();
    const errors = validate({
      title: form.title.value.trim(),
      dueDate: form.dueDate.value,
      duration: form.duration.value,
      tag: form.tag.value.trim()
    });

    if (errors.length) {
      errorsDiv.textContent = errors.join(', ');
      return;
    }

    // Update task
    task.title = form.title.value.trim();
    task.dueDate = form.dueDate.value;
    task.duration = form.duration.value;
    task.tag = form.tag.value.trim();
    task.updatedAt = new Date().toISOString();

    localStorage.setItem('planner:data', JSON.stringify(tasks));
    form.reset();
    errorsDiv.textContent = '';

    // Restore normal add behavior
    form.onsubmit = addTaskSubmitHandler;
    renderTasks();
  };
};


// Delete task
window.deleteTaskUI = function(id) {
  if (confirm('Are you sure you want to delete this task?')) {
    deleteTask(id);
    renderTasks();
  }
};

// Regex search
searchInput.addEventListener('input', () => {
  const re = searchInput.value.trim() ? compileRegex(searchInput.value) : null;
  renderTasks(re);
});

// Cap input
capInput.value = cap;
capInput.addEventListener('change', () => {
  setCap(capInput.value);
  renderTasks();
});

// Initial render
renderTasks();
