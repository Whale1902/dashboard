import { profileSettings } from "../script.js";
import dom from "./dom.js";

// Crypto widget
export const renderCrypto = function (data) {
  // Preparing the markup
  const price = data[0].current_price.toLocaleString("en", {
    style: "currency",
    currency: `${profileSettings.currency}`,
  });
  const priceChange = data[0].price_change_percentage_24h.toFixed(2);

  const currMarkup = `
    <div class="crypto__crypto">
      <img
        src="${data[0].image}"
        alt=""
        class="crypto__icon"
      />
      <h2 class="crypto__currency">${data[0].symbol.toUpperCase()}</h2>
    </div>
    <div class="crypto__rates ${data[0].id}">
      <p class="crypto__price">${price}</p>
      <p class="crypto__price__change">${priceChange}%</p>
    </div>
  `;

  // Inserting markup into page
  dom.cryptoWidget.widget.insertAdjacentHTML("beforeend", currMarkup);

  // Marking price block red if price dropped or green if price incresed
  const currentCoin = document.querySelector(`.${data[0].id}`);

  if (priceChange > 0) {
    currentCoin.style.backgroundColor = "#74d68e";
  } else if (priceChange < 0) {
    currentCoin.style.backgroundColor = "#e77777";
  } else return;
};

// Weather widget
export const renderWeather = function (data) {
  dom.weatherWidget.icon.src = `weather_icons/set05/small/${data.current.icon_num}.png`;
  dom.weatherWidget.description.textContent = data.current.summary;
  dom.weatherWidget.temperature.textContent = `${data.current.temperature}${
    profileSettings.measurement === "metric" ? "\u{2103}" : "\u{2109}"
  }`;
};

// News widget
export const renderNews = function (heading, snippet, link) {
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
  dom.newsWidget.list.insertAdjacentHTML("beforeend", newsMarkup);
};
