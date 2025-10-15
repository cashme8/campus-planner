import { tasks, addTask } from './state.js';
import { validate } from './validators.js';
import { compileRegex, highlight } from './search.js';

const tbody = document.querySelector('#taskTable tbody');
const form = document.querySelector('#taskForm');
const searchInput = document.querySelector('#search');
const errorsDiv = document.querySelector('#formErrors');

function renderTasks(re = null) {
  tbody.innerHTML = '';
  tasks.forEach(task => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${highlight(task.title, re)}</td>
      <td>${task.dueDate}</td>
      <td>${task.duration}</td>
      <td>${highlight(task.tag, re)}</td>
      <td><button onclick="deleteTask('${task.id}')">Delete</button></td>
    `;
    tbody.appendChild(tr);
  });
}

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
    addTask(task);
    form.reset();
    errorsDiv.textContent = '';
    renderTasks();
  }
});

searchInput.addEventListener('input', () => {
  const re = compileRegex(searchInput.value);
  renderTasks(re);
});

window.deleteTask = function(id) {
  const i = tasks.findIndex(t => t.id === id);
  if (i !== -1) {
    tasks.splice(i, 1);
    renderTasks();
  }
};

renderTasks();
