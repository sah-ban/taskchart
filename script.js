 const taskInput = document.getElementById('taskInput');
  const taskTime = document.getElementById('taskTime');
  const addBtn = document.getElementById('addBtn');
  const taskList = document.getElementById('taskList');
  let serialNumber = 1;

  // Function to add a new task
  function addTask() {
    const taskText = taskInput.value.trim();
    const taskDateTime = taskTime.value;
    if (taskText === '' || taskDateTime === '') {
      alert('Please enter both task and date/time.');
      return;
    }
    const [date, time] = taskDateTime.split('T');
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${serialNumber}</td>
      <td>${date}</td>
      <td>${time}</td>
      <td>${taskText}</td>
      <td><input type="checkbox"></td>
      <td><button class="deleteBtn">Delete</button></td>
    `;
    taskList.appendChild(row);
    saveTasksToLocalStorage(); // Save tasks to local storage
    taskInput.value = ''; // Clear input field after adding task
    taskTime.value = ''; // Clear time input field after adding task
    setAlert(time, taskText);
    serialNumber++; // Increment serial number
  }

  // Function to set alert for the task time
  function setAlert(time, taskText) {
    const taskDateTime = new Date(time);
    const alertTime = new Date(taskDateTime.getTime() - 60000); // 1 minute before task time
    const currentTime = new Date();
    const timeDifference = alertTime - currentTime;
    if (timeDifference > 0) {
      setTimeout(() => {
        const taskChecked = !taskList.querySelector('input[type="checkbox"]:checked');
        if (taskChecked) {
          alert(`You have to do "${taskText}" in 1 minute.`);
        }
      }, timeDifference);
    }
  }

  // Function to save tasks to local storage
  function saveTasksToLocalStorage() {
    const tasks = [];
    const rows = taskList.querySelectorAll('tr');
    rows.forEach(row => {
      const task = {
        date: row.cells[1].textContent,
        time: row.cells[2].textContent,
        taskText: row.cells[3].textContent,
        completed: row.cells[4].querySelector('input[type="checkbox"]').checked
      };
      tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  // Function to load tasks from local storage
  function loadTasksFromLocalStorage() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${serialNumber}</td>
        <td>${task.date}</td>
        <td>${task.time}</td>
        <td>${task.taskText}</td>
        <td><input type="checkbox" ${task.completed ? 'checked' : ''}></td>
        <td><button class="deleteBtn">Delete</button></td>
      `;
      taskList.appendChild(row);
      serialNumber++; // Increment serial number
    });
  }

  // Load tasks from local storage on page load
  loadTasksFromLocalStorage();

  // Event listener for Add Task button
  addBtn.addEventListener('click', addTask);

  // Event listener for Enter key in input field
  taskInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
      addTask();
    }
  });

  // Event delegation for marking task as completed and deleting task
  taskList.addEventListener('click', function(event) {
    const target = event.target;
    if (target.tagName === 'INPUT') {
      const taskText = target.parentElement.previousElementSibling;
      taskText.classList.toggle('completed');
      saveTasksToLocalStorage(); // Save tasks to local storage when task status changes
    } else if (target.classList.contains('deleteBtn')) {
      const taskRow = target.closest('tr');
      taskRow.remove();
      saveTasksToLocalStorage(); // Save tasks to local storage after deleting task
      serialNumber = 1; // Reset serial number
      const rows = taskList.querySelectorAll('tr');
      rows.forEach(row => {
        row.cells[0].textContent = serialNumber++;
      });
    }
  });