import dom from "./dom.js";

const WEATHER_API_KEY = "idctje4bnhbwdwoue45keuwv79h51f2hkz63boy7";

// Wordpress gives 10 last news, so number can't be larger then 10
// (but can be smaller)
const NEWS_ON_PAGE = 10;

const MILLISECONDS_TO_UPDATE_DATA = 300000;

const STATIC_URLS = {
  listOfCryptos: "https://api.coingecko.com/api/v3/coins/list",
  vsCurrencies:
    "https://api.coingecko.com/api/v3/simple/supported_vs_currencies",
  news: "https://forklog.com/wp-json/wp/v2/posts/#",
};

// It is ugly, but gives urls, whitch depends on current profile settings
const DYNAMIC_URLS = function (profileSettings, widget, i) {
  if (widget === "weather") {
    return `https://www.meteosource.com/api/v1/free/point?place_id=${profileSettings.location[0]}&sections=current&units=${profileSettings.measurement}&key=${WEATHER_API_KEY}`;
  } else if (widget === "crypto") {
    return `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${profileSettings.currency}&ids=${profileSettings.coins[i]}`;
  } else if (widget === "locations") {
    return `https://www.meteosource.com/api/v1/free/find_places?text=${dom.settings.locationInput.value}&key=${WEATHER_API_KEY}`;
  }
};

// Available color themes
const colorSchemas = {
  colorDefault: ["#a597e9", "#74d68e"],
  colorBeige: ["#ece8dd", "#e1d7c6"],
  colorSage: ["#87bd9a", "#cae1adad"],
  colorSky: ["#82aae3", "#bfeaf5"],
  colorSpace: ["#37c9d1", "#f2f0f09c"],
};

const keyBinds = function (e) {
  if (e.code === "KeyI" && e.metaKey) {
    e.preventDefault();
    dom.search.input.focus();
  } else if (e.code === "KeyO" && e.metaKey) {
    e.preventDefault();
    dom.todo.input.focus();
  } else if (e.code === "KeyU" && e.metaKey) {
    init();
  }
};

export {
  WEATHER_API_KEY,
  NEWS_ON_PAGE,
  MILLISECONDS_TO_UPDATE_DATA,
  STATIC_URLS,
  DYNAMIC_URLS,
  colorSchemas,
  keyBinds,
};
