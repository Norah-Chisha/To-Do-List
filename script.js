const taskInput = document.getElementById("taskInput");
const timeInput = document.getElementById("timeInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.expired) li.classList.add("expired");

    const taskText = document.createElement("span");
    taskText.className = "task-text";
    taskText.textContent = task.text;

    const timeInfo = document.createElement("span");
    timeInfo.className = "task-time";
    timeInfo.textContent = new Date(task.time).toLocaleString();

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit";
    editBtn.onclick = () => editTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete";
    deleteBtn.onclick = () => deleteTask(index);

    li.append(taskText, timeInfo, editBtn, deleteBtn);
    taskList.appendChild(li);
  });
}

function addTask() {
  const text = taskInput.value.trim();
  const time = timeInput.value;

  if (!text || !time) {
    alert("Please enter a task and select a time limit!");
    return;
  }

  tasks.push({ text, time, expired: false, alerted: false });
  taskInput.value = "";
  timeInput.value = "";
  renderTasks();
}

function editTask(index) {
  const task = tasks[index];

  if (task.expired) {
    alert("You cannot edit an expired task.");
    return;
  }

  const newText = prompt("Edit task text:", task.text);
  if (newText === null) return; // cancelled

  const newTime = prompt(
    "Edit time (YYYY-MM-DDTHH:MM):",
    task.time.slice(0, 16)
  );
  if (newTime === null) return; // cancelled

  if (newText.trim() !== "" && newTime.trim() !== "") {
    task.text = newText.trim();
    task.time = newTime;
    task.alerted = false; // reset pre-expiry alert
    renderTasks();
  } else {
    alert("Task or time cannot be empty!");
  }
}

function deleteTask(index) {
  const confirmDelete = confirm("Are you sure you want to delete this task?");
  if (confirmDelete) {
    tasks.splice(index, 1);
    renderTasks();
  }
}

function checkExpiredTasks() {
  const now = new Date();

  tasks.forEach(task => {
    const taskTime = new Date(task.time);

    // Show alert 2 minutes before expiration (120,000 ms)
    if (!task.alerted && !task.expired && taskTime - now <= 120000 && taskTime > now) {
      alert(`⏰ Reminder: The task "${task.text}" will expire in less than 2 minutes!`);
      task.alerted = true;
    }

    // Mark as expired if time passed
    if (!task.expired && taskTime <= now) {
      task.expired = true;
    }
  });

  renderTasks();
}

addTaskBtn.addEventListener("click", addTask);
setInterval(checkExpiredTasks, 1000);
