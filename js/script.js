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

const storeTaskInStorage = (newTask) => {
  const tasks = getTasksFromStorage();
  tasks.push(newTask);

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

const clearTasksFromStorage = () => {
  localStorage.removeItem(TASKS_STORAGE_KEY);
};

const removeTaskFromStorage = (index) => {
  const tasks = getTasksFromStorage();

  tasks.splice(index, 1);

  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
};

//

// "tasks" functions
const appendLi = (value, index) => {
  // Create and add LI element
  const li = document.createElement("li");

  // li.textContent = value; // Значення яке ввів користувач
  li.innerHTML = `${value} <i class="fa fa-edit edit-item"></i><i class="fa fa-remove delete-item"></i>`;
  li.setAttribute("data-id", index);
  taskList.append(li);
};

const addTask = (event) => {
  event.preventDefault();

  // Перевірка на пусте значення
  const value = taskInput.value.trim();
  if (value === "") {
    return;
  }
  const tasks = getTasksFromStorage();

  appendLi(value, tasks.length);

  // Очистити форму
  // 1 - скидає значення у input'a taskInput
  taskInput.value = "";
  // 2 - скидає всі значення форми
  // form.reset();

  // Фокусуємось на input
  taskInput.focus();

  // Зберігаємо елемент у localStorage
  storeTaskInStorage(value);
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
  const index = parseInt(li.getAttribute("data-id"), 10);
  li.remove();

  // Видалити зі сховища

  removeTaskFromStorage(index);
};

const editTask = (event) => {
  const isEditButton = event.target.classList.contains("edit-item");
  if (!isEditButton) {
    return;
  }

  const li = event.target.closest("li");
  const currentTask = li.textContent;
  const newTaskText = prompt("Редагувати завдання:", currentTask);

  if (newTaskText === null || newTaskText.trim() === "") {
    return;
  }
  const index = li.getAttribute("data-id");
  li.innerHTML = `${newTaskText} <i class="fa fa-edit edit-item"></i><i class="fa fa-remove delete-item"></i>`;
  li.setAttribute("data-id", index);
};

const filterTasks = ({ target: { value } }) => {
  const text = value.toLowerCase();
  const list = taskList.querySelectorAll("li"); // []

  list.forEach((li) => {
    const liText = li.textContent.trim().toLowerCase();

    // if (liText.includes(text)) {
    //   li.hidden = false;
    // } else {
    //   li.hidden = true;
    // }
    li.hidden = !liText.includes(text);
  });
};

const initTasks = () => {
  const tasks = getTasksFromStorage();
  // tasks.forEach((task) => appendLi(task));
  tasks.forEach((task, index) => appendLi(task, index));
};

// Init
initTasks();

// Event listeners
// onsubmit
form.addEventListener("submit", addTask);

clearButton.addEventListener("click", clearTasks);

taskList.addEventListener("click", removeTask);

filterInput.addEventListener("input", filterTasks);

taskList.addEventListener("click", editTask);
