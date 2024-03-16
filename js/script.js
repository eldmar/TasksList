"use strict";

// const
const TASKS_STORAGE_KEY = "tasks";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const taskList = document.querySelector(".collection");
const clearButton = document.querySelector(".clear-tasks");
const filterInput = document.querySelector(".filter-input");

// "storage" functions
const getTasksFromStorage = () => {
  return JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
};

const storeTaskInStorage = (taskText, taskId) => {
  const tasks = getTasksFromStorage();
  const newTask = { id: taskId, text: taskText };
  tasks.push(newTask);

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromStorage = () => {
  localStorage.removeItem(TASKS_STORAGE_KEY);
};

const removeTaskFromStorage = (taskId) => {
  const tasks = getTasksFromStorage();
  const updatedTasks = tasks.filter((task) => task.id !== taskId);

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(updatedTasks));
};

//

// "tasks" functions
const appendLi = (task) => {
  // Create and add LI element
  const li = document.createElement("li");
  li.setAttribute("data-id", task.id);

  li.innerHTML = `${task.text} <i class="fa fa-remove delete-item"></i>`;
  taskList.append(li);
};

const addTask = (event) => {
  event.preventDefault();

  // Перевірка на пусте значення
  const value = taskInput.value.trim();
  if (value === "") {
    return;
  }
  // Генеруєм унікальний ID
  const taskId = Date.now().toString();

  storeTaskInStorage(value, taskId);

  appendLi({ id: taskId, text: value });

  // Очистити форму
  // 1 - скидає значення у input'a taskInput
  taskInput.value = "";
  // 2 - скидає всі значення форми
  // form.reset();

  // Фокусуємось на input
  taskInput.focus();
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearTasksFromStorage();
};

const removeTask = (event) => {
  const isDeleteButton = event.target.classList.contains("delete-item");
  if (!isDeleteButton) {
    return;
  }

  const isConfirmed = confirm("Ви впевнені що хочете видалити це завдання?");
  if (!isConfirmed) {
    return;
  }

  const li = event.target.closest("li");
  const taskId = li.getAttribute("data-id");
  li.remove();

  // Видалити зі сховища

  removeTaskFromStorage(taskId);
};

const filterTasks = ({ target: { value } }) => {
  const text = value.toLowerCase();
  const list = taskList.querySelectorAll("li"); // []

  list.forEach((li) => {
    const liText = li.textContent.trim().toLowerCase();

    li.hidden = !liText.includes(text);
  });
};

const initTasks = () => {
  const tasks = getTasksFromStorage();
  // tasks.forEach((task) => appendLi(task));
  tasks.forEach(appendLi);
};

// Init
initTasks();

// Event listeners
// onsubmit
form.addEventListener("submit", addTask);

clearButton.addEventListener("click", clearTasks);

taskList.addEventListener("click", removeTask);

filterInput.addEventListener("input", filterTasks);

// 12
