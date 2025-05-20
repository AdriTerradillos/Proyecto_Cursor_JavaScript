document.addEventListener('DOMContentLoaded', () => {
  const areaInput = document.getElementById('areaInput');
  const addAreaBtn = document.getElementById('addAreaBtn');
  const areaSelect = document.getElementById('areaSelect');
  const taskInput = document.getElementById('taskInput');
  const addTaskBtn = document.getElementById('addTaskBtn');
  const taskList = document.getElementById('taskList');

  let data = JSON.parse(localStorage.getItem('todoData')) || {};

  function saveData() {
    localStorage.setItem('todoData', JSON.stringify(data));
  }

  function renderAreas() {
    areaSelect.innerHTML = '';
    Object.keys(data).forEach(area => {
      const option = document.createElement('option');
      option.value = area;
      option.textContent = area;
      areaSelect.appendChild(option);
    });
    renderTasks();
  }

  function renderTasks() {
    const selectedArea = areaSelect.value;
    taskList.innerHTML = '';

    if (!selectedArea || !data[selectedArea]) return;

    data[selectedArea].forEach((task, index) => {
      const li = document.createElement('li');
      li.textContent = task.text;
      if (task.completed) li.classList.add('completed');

      li.addEventListener('click', () => {
        data[selectedArea][index].completed = !task.completed;
        saveData();
        renderTasks();
      });

      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Eliminar';
      deleteBtn.className = 'delete-btn';
      deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        data[selectedArea].splice(index, 1);
        saveData();
        renderTasks();
      });

      li.appendChild(deleteBtn);
      taskList.appendChild(li);
    });
  }

  addAreaBtn.addEventListener('click', () => {
    const area = areaInput.value.trim();
    if (!area || data[area]) return;

    data[area] = [];
    saveData();
    areaInput.value = '';
    renderAreas();
    areaSelect.value = area; // Selecciona automáticamente la nueva área
  });

  addTaskBtn.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const selectedArea = areaSelect.value;
    if (!taskText || !selectedArea) return;

    data[selectedArea].push({ text: taskText, completed: false });
    taskInput.value = '';
    saveData();
    renderTasks();
  });

  areaSelect.addEventListener('change', renderTasks);

  // Cargar datos al iniciar
  renderAreas();
});