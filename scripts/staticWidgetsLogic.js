import dom from "./dom.js";

export const addTodoLogic = function () {
  dom.todo.list.addEventListener("click", function (e) {
    const clicked = e.target.classList.value;

    if (clicked === "todo__list") {
      return;
    } else if (clicked.includes("delete")) {
      e.target.closest(".todo__item").remove();
    } else if (clicked.includes("todo__item")) {
      e.target.classList.toggle("todo__item--crossed");
    } else if (!clicked.includes("todo__item")) {
      e.target.closest(".todo__item").classList.toggle("todo__item--crossed");
    }
  });

  dom.todo.form.addEventListener("submit", function (e) {
    e.preventDefault();

    const todoMarkup = `
      <div class="todo__item">
        <p class="todo__text">${dom.todo.input.value}</p>
        <button class="todo__delete">&#9587;</button>
      </div>
    `;

    if (!dom.todo.input.value) return;

    dom.todo.list.insertAdjacentHTML("beforeend", todoMarkup);

    dom.todo.input.value = "";
    dom.todo.input.focus();
  });

  dom.todo.clearButton.addEventListener("click", function () {
    for (let el of document.querySelectorAll(".todo__item")) {
      el.remove();
    }
  });
};

export const addSearchLogic = function () {
  // Allow user to search with at least one character in query
  dom.search.input.addEventListener("input", function () {
    // Global selector has been set on page loading, so I need to update it
    dom.search.input = document.getElementById("search__form__input");

    if (dom.search.input.value.length === 0) {
      dom.search.submit.disabled = true;
    } else if (dom.search.input.value.length > 0) {
      dom.search.submit.disabled = false;
    }
  });

  dom.search.form.addEventListener("submit", function (e) {
    e.preventDefault();
    // Selecting only checked option
    const searchCheckedOption = document.querySelector(
      'input[name="search__option"]:checked'
    );

    const targetUrl = `${searchCheckedOption.getAttribute("data-url")}${
      dom.search.input.value
    }`;
    window.open(targetUrl, "_blank");
  });
};
