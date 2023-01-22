import dom from "./dom.js";
import { profileSettings } from "./settings.js";

// Fetch
export const fetchCrypto = function (i) {
  try {
    fetch(
      `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${profileSettings.currency}&ids=${profileSettings.coins[i]}`
    )
      .then((res) => res.json())
      .then((data) => renderCrypto(data))
      .catch((error) => {
        console.error(error);
      });
  } catch (error) {
    console.log(error.message);
  }
};

// Render
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

export const updateCrypto = function () {
  let elementsToRemove = [
    ...document.querySelectorAll(".crypto__crypto"),
    ...document.querySelectorAll(".crypto__rates"),
  ];

  for (let element of elementsToRemove) {
    element.remove();
  }

  for (let i = 0; i < 3; i++) {
    fetchCrypto(i);
  }
};
