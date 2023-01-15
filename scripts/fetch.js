import { profileSettings } from "../script.js";
import { renderCrypto, renderWeather, renderNews } from "./render.js";
import { WEATHER_API_KEY } from "./config.js";

// WEATHER
export const fetchWeather = function () {
  fetch(
    `https://www.meteosource.com/api/v1/free/point?place_id=${profileSettings.location[0]}&sections=current&units=${profileSettings.measurement}&key=${WEATHER_API_KEY}`
  )
    .then((res) => res.json())
    .then((data) => renderWeather(data));
};

// CRYPTO
export const fetchCrypto = function (i) {
  fetch(
    `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${profileSettings.currency}&ids=${profileSettings.coins[i]}`
  )
    .then((res) => res.json())
    .then((data) => renderCrypto(data));
};

// NEWS

export const fetchNews = function () {
  fetch("https://forklog.com/wp-json/wp/v2/posts/#")
    .then((res) => res.json())
    .then((data) => {
      for (let i = 0; i < 10; i++) {
        const title = data[i].title.rendered;
        const snippet = data[i].excerpt.rendered.slice(3, -5);
        const link = data[i].link;

        renderNews(title, snippet, link);
      }
    });
};
