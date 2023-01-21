import dom from "./dom.js";

export const setTodoListeners = function () {
  dom.todoWidget.list.addEventListener("click", function (e) {
    const clicked = e.target.classList.value;

    if (clicked === "todo__list") {
      return;
    } else if (clicked.includes("delete")) {
      // Remove todo when delete button pressed
      e.target.closest(".todo__item").remove();
    } else if (clicked.includes("todo__item")) {
      // Mark todo as crossed
      e.target.classList.toggle("todo__item--crossed");
    } else if (!clicked.includes("todo__item")) {
      // Mark todo as uncrossed
      e.target.closest(".todo__item").classList.toggle("todo__item--crossed");
    }
  });

  dom.todoWidget.form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Insert new todo
    const todoMarkup = `
      <div class="todo__item">
        <p class="todo__text">${dom.todoWidget.input.value}</p>
        <button class="todo__delete">&#9587;</button>
      </div>
    `;

    if (!dom.todoWidget.input.value) return;

    dom.todoWidget.list.insertAdjacentHTML("beforeend", todoMarkup);

    // Reset todo form input
    dom.todoWidget.input.value = "";
    dom.todoWidget.input.focus();
  });

  // Remove all todos
  dom.todoWidget.clearBtn.addEventListener("click", function () {
    for (let el of document.querySelectorAll(".todo__item")) {
      el.remove();
    }
  });
};

// Saving todos before leaving the page
window.addEventListener("beforeunload", function () {
  {
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
  }
});

export const loadTodosFromLocalStorage = function () {
  // Rendering todos from local storage — initial render
  for (let todo of document.querySelectorAll(".todo__item")) {
    todo.remove();
  }

  const todosFromLocalStorage = JSON.parse(
    window.localStorage.getItem("todos")
  );

  for (let todo of todosFromLocalStorage) {
    dom.todoWidget.list.insertAdjacentHTML(
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
