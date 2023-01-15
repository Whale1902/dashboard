import { fetchWeather, fetchCrypto, fetchNews } from "./scripts/fetch.js";
import {
  themePick,
  timeNow,
  toggleElement,
  markAs,
} from "./scripts/helpers.js";
import { WEATHER_API_KEY } from "./scripts/config.js";
import dom from "./scripts/dom.js";

// Available color themes
const colorSchemas = {
  colorDefault: ["#a597e9", "#74d68e"],
  colorBeige: ["#ece8dd", "#e1d7c6"],
  colorSage: ["#a6bb8d", "#61876e"],
  colorSky: ["#bfeaf5", "#82aae3"],
  colorSpace: ["#00abb3", "#eaeaea"],
};

// Default profile settings
export let profileSettings = {
  location: ["Odessa", "Ukraine"],
  measurement: "metric",
  coins: ["bitcoin", "ethereum", "tether"],
  currency: "usd",
  defaultSearch: "google",
  theme: "colorBeige",
};

// Update profile settings if user's settings available
if (window.localStorage.length > 0) {
  profileSettings = JSON.parse(window.localStorage.getItem("profileSettings"));
}

themePick(colorSchemas[profileSettings.theme]);

/////////////////////////////////////  WEATHER WIDGET  /////////////////////////////////////
// Render current time and selected location
dom.weatherWidget.location.textContent = `${profileSettings.location[0]}, ${
  profileSettings.location[1]
}, ${timeNow()}`;

const updateWeather = function () {
  fetchWeather();
};

////////////////////////////////////// CRYPTO WIDGET  //////////////////////////////////////
const updateCrypto = function () {
  for (let i = 0; i < 3; i++) {
    fetchCrypto(i);
  }
};

//////////////////////////////////////  SEARCH WIDGET  //////////////////////////////////////
// Disabling input until input is clear
dom.searchWidget.submit.disabled = true;

// Allow user to search with at least one character in query
dom.searchWidget.input.addEventListener("input", function () {
  // Global selector has been set on page loading, so I need to update it
  dom.searchWidget.input = document.getElementById("search__form__input");

  if (dom.searchWidget.input.value.length === 0) {
    dom.searchWidget.submit.disabled = true;
  } else if (dom.searchWidget.input.value.length > 0) {
    dom.searchWidget.submit.disabled = false;
  }
});

// Search
dom.searchWidget.form.addEventListener("submit", function () {
  // Selecting checked search option
  const searchCheckedOption = document.querySelector(
    'input[name="search__option"]:checked'
  );

  // Open tab for the query in selected engine
  const targetUrl = `${searchCheckedOption.getAttribute("data-url")}${
    dom.searchWidget.input.value
  }`;
  window.open(targetUrl, "_blank");
});

////////////////////////////// TODO WIDGET /////////////////////////////

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
  const todoInput = document.querySelector(".todo__form__input");
  const todoMarkup = `
    <div class="todo__item">
      <p class="todo__text">${todoInput.value}</p>
      <button class="todo__delete">&#9587;</button>
    </div>
  `;

  if (!todoInput.value) return;

  dom.todoWidget.list.insertAdjacentHTML("beforeend", todoMarkup);

  // Reset todo form input
  todoInput.value = "";
  todoInput.focus();
});

// Remove all todos
dom.todoWidget.clearBtn.addEventListener("click", function () {
  for (let el of document.querySelectorAll(".todo__item")) {
    el.remove();
  }
});

/////////////////////////////////// NEWS WIDGET ///////////////////////////////////
const updateNews = function () {
  fetchNews();
};

// Preview news on click
dom.newsWidget.list.addEventListener("click", function (e) {
  console.log(e.target.classList.value);
  if (!e.target.classList.value === "news-heading") return;
  const clickedNews = e.target.closest(".news");
  clickedNews.querySelector(".news-additional").classList.toggle("hidden");
});

//////////////////////////////////////////  INIT  //////////////////////////////////////////

const init = function () {
  const thingsToRemove = [
    ...document.querySelectorAll(".crypto-crypto"),
    ...document.querySelectorAll(".currency-rates"),
    ...document.querySelectorAll(".news"),
  ];

  for (let thing of thingsToRemove) {
    thing.remove();
  }

  updateWeather();
  updateCrypto();
  updateNews();
};

// init();

//////////////////////////////////////  Side Buttons  //////////////////////////////////////

// Handling side buttons clicks
dom.sideButtons.allButtons.addEventListener("click", function (e) {
  if (e.target.classList.value.includes("button__reload")) {
    init();
  } else if (e.target.classList.value.includes("button__settings")) {
    toggleElement(dom.settings.settingsTab, "inline-block");
  } else return;
});

//////////////////////////////////////  SETTINGS TAB  //////////////////////////////////////

// Temporary settings holder, before it replace profile settings
const tempProfileSettings = {
  location: profileSettings.location,
  measurement: profileSettings.measurement,
  coins: profileSettings.coins,
  currency: profileSettings.currency,
  defaultSearch: profileSettings.defaultSearch,
  theme: profileSettings.theme,
};

// LOCATION

dom.settings.locationInput.addEventListener("change", function () {
  fetch(
    `https://www.meteosource.com/api/v1/free/find_places?text=${dom.settings.locationInput.value}&key=${WEATHER_API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.length === 0) {
        markAs(dom.settings.locationInput, "bad");
      } else if (data.length > 0) {
        tempProfileSettings.location[0] = data[0].name;
        tempProfileSettings.location[1] = data[0].country;
        markAs(dom.settings.locationInput, "good");
      }
    });
});

// "VS" CURRENCY

dom.settings.currencyInput.addEventListener("input", function () {
  // Asking CG for the list of available currencies
  fetch("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
    .then((res) => res.json())
    .then((data) => {
      if (data.includes(dom.settings.currencyInput.value.toLowerCase())) {
        // marking input as 'good'
        markAs(dom.settings.currencyInput, "good");
        tempProfileSettings.currency = dom.settings.currencyInput.value;
      } else {
        //marking input as 'bad'
        markAs(dom.settings.currencyInput, "bad");
      }
    });
});

// USER CRYPTO-TOKENS
const coinsInputArr = [
  dom.settings.coin1Input,
  dom.settings.coin2Input,
  dom.settings.coin3Input,
];
// Fetching CoinGecko just once, so that I don't need
// to call it on every time user fire 'change' or 'input' event
let listOftokens = fetch("https://api.coingecko.com/api/v3/coins/list")
  .then((res) => res.json())
  .catch((err) => console.error(err));

// Checking if passed input have valid value
// (if token is listed on CoinGecko)
const checkToken = function (input) {
  listOftokens.then((res) => {
    const tokenID = res.find(
      (coin) =>
        coin.id === input.value.toLowerCase() ||
        coin.symbol === input.value.toLowerCase()
    )?.id;
    if (!tokenID) {
      markAs(input, "bad");
    } else {
      markAs(input, "good");
      tempProfileSettings.coins[input.id.slice(4) - 1] = tokenID;
    }
  });
};

// Adding event listener and calling check function
for (let input of coinsInputArr) {
  input.addEventListener("input", function () {
    checkToken(this);
  });
}

// Render theme selectors in their colors
const colorOptions = document.querySelectorAll(
  'input[name="colorSchema"] + label'
);

for (let option of colorOptions) {
  const prim = colorSchemas[option.getAttribute("for")][0];
  const sec = colorSchemas[option.getAttribute("for")][1];

  option.style.background = `linear-gradient(120deg, ${prim} 50%, ${sec} 0%`;
}

// Theme preview on seclect
document.querySelector(".colorTheme").addEventListener("click", function (e) {
  const click = e.target?.closest("label");
  if (!click) return;
  else {
    themePick(colorSchemas[click.getAttribute("for")]);
  }
});

// Render current data on page
dom.settings.locationInput.value = profileSettings.location[0];
dom.settings.currencyInput.value = profileSettings.currency.toLocaleUpperCase();

for (let i = 0; i < 3; i++) {
  coinsInputArr[i].value =
    profileSettings.coins[i][0].toLocaleUpperCase() +
    profileSettings.coins[i].slice(1);
}

document
  .getElementById(`measurement_${profileSettings.measurement}`)
  .setAttribute("checked", "checked");

for (let element of document.querySelectorAll(
  `input[value=${profileSettings.defaultSearch}]`
)) {
  element.setAttribute("checked", "checked");
}

for (let element of document.querySelectorAll(
  `input[value=${profileSettings.theme}]`
)) {
  element.setAttribute("checked", "checked");
}

// Saving the settings
const settingsSaveButton = document.querySelector(".settings__submit");

settingsSaveButton.addEventListener("click", function (e) {
  e.preventDefault();

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

  init();

  for (let inp of document.querySelectorAll(".settings__input")) {
    markAs(inp, "neutral");
  }

  themePick(colorSchemas[profileSettings.theme]);
  toggleElement(dom.settings.settingsTab, "inline-block");
});

// Rendering todos from local storage NEED TO BE MUCH UPPER ON CODE
const renderTodosFromLocalStorage = function () {
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
        <div class="todo__item ${todo[1] === "" ? "" : "todo__item--crossed"}">
          <p class="todo__text">${todo[0]}</p>
          <button class="todo__delete">&#9587;</button>
        </div>
      `
    );
  }
};
renderTodosFromLocalStorage();

// Saving todos and its state in local storage before closing or reloading the tab
const saveTodosToLocalStorage = function () {
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

window.addEventListener("beforeunload", saveTodosToLocalStorage);

// Keyboard bindings
document.addEventListener("keydown", function (e) {
  if (e.code === "KeyI" && e.metaKey) {
    e.preventDefault();
    console.log("command + I");
    dom.searchWidget.input.focus();
  } else if (e.code === "KeyO" && e.metaKey) {
    e.preventDefault();
    console.log("command + O");
    document.querySelector(".todo__form__input").focus();
  } else if (e.code === "KeyU" && e.metaKey) {
    init();
  }
});
