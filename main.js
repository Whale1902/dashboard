import dom from "./scripts/dom.js";
import WEATHER_API_KEY from "./scripts/config.js";
import { timeNow, toggleElement, markAs } from "./scripts/helpers.js";

// Available color themes
const colorSchemas = {
  colorDefault: ["#a597e9", "#74d68e"],
  colorBeige: ["#ece8dd", "#e1d7c6"],
  colorSage: ["#a6bb8d", "#61876e"],
  colorSky: ["#bfeaf5", "#82aae3"],
  colorSpace: ["#00abb3", "#eaeaea"],
};

// Default profile settings
let profileSettings = {
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

// Apply defined theme from settings
const themePick = function (schema) {
  document.querySelector(":root").style.setProperty("--primary", schema[0]);
  document.querySelector(":root").style.setProperty("--secondary", schema[1]);
};
themePick(colorSchemas[profileSettings.theme]);

/////////////////////////////////////  WEATHER WIDGET  /////////////////////////////////////
// Render location from settings and current time
dom.weather.location.textContent = `${profileSettings.location[0]}, ${
  profileSettings.location[1]
}, ${timeNow()}`;

const renderWeather = function (data) {
  dom.weather.icon.src = `weather_icons/set05/small/${data.current.icon_num}.png`;
  dom.weather.description.textContent = data.current.summary;
  dom.weather.temperature.textContent = `${data.current.temperature}${
    profileSettings.measurement === "metric" ? "\u{2103}" : "\u{2109}"
  }`;
};

const updateWeather = function () {
  fetch(
    `https://www.meteosource.com/api/v1/free/point?place_id=${profileSettings.location[0]}&sections=current&units=${profileSettings.measurement}&key=${WEATHER_API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => renderWeather(data));
};

////////////////////////////////////// CRYPTO WIDGET  //////////////////////////////////////
const updateCrypto = function () {
  for (let i = 0; i < 3; i++) {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${profileSettings.currency}&ids=${profileSettings.coins[i]}`
    )
      .then((res) => res.json())
      .then((data) => {
        const coinName = data[0].id;
        const coinIcon = data[0].image;
        const coinAbr = data[0].symbol.toUpperCase();
        const coinPrice = data[0].current_price.toLocaleString("en", {
          style: "currency",
          currency: `${profileSettings.currency}`,
        });
        const coinPriceChange = data[0].price_change_percentage_24h.toFixed(2);

        const currMarkup = `
          <div class="crypto__crypto">
            <img
              src="${coinIcon}"
              alt=""
              class="crypto__icon"
            />
            <h2 class="crypto__currency">${coinAbr}</h2>
          </div>
          <div class="crypto__rates ${coinName}">
            <p class="crypto__price">${coinPrice}</p>
            <p class="crypto__price__change">${coinPriceChange}%</p>
          </div>
        `;

        dom.crypto.widget.insertAdjacentHTML("beforeend", currMarkup);

        const currentCoin = document.querySelector(`.${coinName}`);

        if (coinPriceChange > 0) {
          currentCoin.style.backgroundColor = "#74d68e";
        } else if (coinPriceChange < 0) {
          currentCoin.style.backgroundColor = "#e77777";
        } else return;
      });
  }
};

//////////////////////////////////////  SEARCH WIDGET  //////////////////////////////////////
// Disable ability to search without any query
dom.search.submit.disabled = true;

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

////////////////////////////// TODO WIDGET /////////////////////////////
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

/////////////////////////////////// NEWS WIDGET ///////////////////////////////////
const createMarkup = function (heading, snippet, link) {
  const newsMarkup = `
    <div class="news">
      <h2 class="news-heading">
        ${heading}
      </h2>
      <div class="news-additional hidden">
        <p class="news-snippet">
          ${snippet}
        </p>
        <a
          href="${link}"
          target="_blank"
          ><button class="news-more">Read full</button></a
        >
      </div>
    </div>
    `;
  dom.news.list.insertAdjacentHTML("beforeend", newsMarkup);
};

// Fetching
const newsLoading = function () {
  fetch("https://forklog.com/wp-json/wp/v2/posts/#")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 10; i++) {
        const title = data[i].title.rendered;
        const snippet = data[i].excerpt.rendered.slice(3, -5);
        const link = data[i].link;

        createMarkup(title, snippet, link);
      }
    });
};

// Expand news on click
dom.news.list.addEventListener("click", function (e) {
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
  newsLoading();
};

// init();

//////////////////////////////////////  Side Buttons  //////////////////////////////////////
dom.sideButtons.buttonsList.addEventListener("click", function (e) {
  if (e.target.classList.value.includes("button__reload")) {
    init();
  } else if (e.target.classList.value.includes("button__settings")) {
    toggleElement(dom.settings.settingsTab, "inline-block");
  } else return;
});

//////////////////////////////////////  SETTINGS TAB  //////////////////////////////////////

// Temporary settings holder, befor it will be inserted into profile settings
const tempProfileSettings = {
  location: profileSettings.location,
  measurement: profileSettings.measurement,
  coins: profileSettings.coins,
  currency: profileSettings.currency,
  defaultSearch: profileSettings.defaultSearch,
  theme: profileSettings.theme,
};

// USER LOCATION
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

// USER CURRENCY
dom.settings.vsCurrencyInput.addEventListener("input", function () {
  // Asking CG for the list of available currencies
  fetch("https://api.coingecko.com/api/v3/simple/supported_vs_currencies")
    .then((res) => res.json())
    .then((data) => {
      if (data.includes(dom.settings.vsCurrencyInput.value.toLowerCase())) {
        // marking input as 'good'
        markAs(dom.settings.vsCurrencyInput, "good");
        tempProfileSettings.currency = dom.settings.vsCurrencyInput.value;
      } else {
        //marking input as 'bad'
        markAs(dom.settings.vsCurrencyInput, "bad");
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
// to call API every time user fire event
let listOftokens = fetch("https://api.coingecko.com/api/v3/coins/list")
  .then((res) => res.json())
  .catch((err) => console.error(err));

// Checking if passed token is listed on CoinGecko
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
for (let option of dom.settings.colorOptions) {
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
dom.settings.vsCurrencyInput.value =
  profileSettings.currency.toLocaleUpperCase();

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
dom.settings.saveButton.addEventListener("click", function (e) {
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

  if (todosFromLocalStorage.length === 0) return;
  for (let todo of todosFromLocalStorage) {
    dom.todo.list.insertAdjacentHTML(
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
    dom.search.input.focus();
  } else if (e.code === "KeyO" && e.metaKey) {
    e.preventDefault();
    console.log("command + O");
    document.querySelector(".todo__form__input").focus();
  } else if (e.code === "KeyU" && e.metaKey) {
    init();
  }
});
