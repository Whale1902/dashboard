import dom from "./dom.js";

// Fetch
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

// Render
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

export const updateNews = function () {
  for (let thing of [...document.querySelectorAll(".news")]) {
    thing.remove();
  }

  fetchNews();

  // Preview news on click
  dom.newsWidget.list.addEventListener("click", function (e) {
    if (!e.target.classList.value === "news-heading") return;
    const clickedNews = e.target.closest(".news");
    clickedNews.querySelector(".news-additional").classList.toggle("hidden");
  });
};
