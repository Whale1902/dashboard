import dom from "./dom.js";

// Rendering todos from local storage
export const renderTodosFromLocalStorage = function () {
  for (let todo of document.querySelectorAll(".todo__item")) {
    todo.remove();
  }

  const todosFromLocalStorage = JSON.parse(
    window.localStorage.getItem("todos")
  );

  if (!todosFromLocalStorage) return;
  for (let todo of todosFromLocalStorage) {
    dom.todo.list.insertAdjacentHTML(
      "beforeend",
      `
            <div class="todo__item ${
              todo[1] === "" ? "" : "todo__item--crossed"
            }">
            <p class="todo__text">${todo[0]}</p>
            <button class="todo__delete">&#9587;</button>
            </div>
            `
    );
  }
};

// Saving todos and its state in local storage before closing or reloading the tab
export const saveTodosToLocalStorage = function () {
  const currListOfTodos = [];

  const listOfTodos = document.querySelectorAll(".todo__text");

  for (let todo of listOfTodos) {
    if (todo.closest(".todo__item").classList.value.includes("crossed")) {
      currListOfTodos.push([todo.textContent, "crossed"]);
    } else {
      currListOfTodos.push([todo.textContent, ""]);
    }
  }
  window.localStorage.setItem("todos", JSON.stringify(currListOfTodos));
};

export const saveSettingsToLocalStorage = function (
  profileSettings,
  tempProfileSettings
) {
  profileSettings = tempProfileSettings;

  profileSettings.measurement = document.querySelector(
    "input[name='measurement']:checked"
  ).value;

  profileSettings.defaultSearch = document.querySelector(
    "input[name='default__search']:checked"
  ).value;

  profileSettings.theme = document.querySelector(
    "input[name='colorSchema']:checked"
  ).value;

  window.localStorage.setItem(
    "profileSettings",
    JSON.stringify(profileSettings)
  );
};
