import puppeteer from "puppeteer";
import dotenv from "dotenv";

dotenv.config();

interface SearchResult {
  title: string;
  year: string;
  type: string;
  url: string;
  image: string;
  desc: string;
}

const scrapeFilmLists = async function scrapeFilms(
  searchQuery: string
): Promise<SearchResult[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-extensions",
      "--disable-gpu",
      "--window-size=1280,800",
    ],
  });
  const page = await browser.newPage();

  const userAgent = process.env.USER_AGENT;
  if (!userAgent) {
    throw new Error("USER_AGENT is not defined in environment variables.");
  }
  await page.setUserAgent(userAgent);

  try {
    const baseUrl = process.env.FILM_SEARCH_URL;
    if (!baseUrl) {
      throw new Error(
        "FILM_SEARCH_URL is not defined in environment variables."
      );
    }

    await page.goto(`${baseUrl}?q=${encodeURIComponent(searchQuery)}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector(
      'section[data-testid="find-results-section-title"]',
      { timeout: 60000 }
    );

    const searchResults = await page.evaluate(() => {
      const results = document.querySelectorAll(
        'section[data-testid="find-results-section-title"] .find-result-item'
      );

      return Array.from(results).map((result) => {
        const titleElement = result.querySelector(
          ".ipc-metadata-list-summary-item__t"
        );
        const yearElements = result.querySelectorAll(
          ".ipc-metadata-list-summary-item__tl .ipc-metadata-list-summary-item__li"
        );
        const yearTexts = Array.from(yearElements).map((li) =>
          li?.textContent?.trim()
        );
        const year = yearTexts[0] || "";
        const type = yearTexts[1] || "Film";

        const imageElement = result.querySelector(".ipc-image");
        const actorsElement = result.querySelector(
          ".ipc-metadata-list-summary-item__stl .ipc-metadata-list-summary-item__li"
        );

        return {
          title: titleElement?.textContent?.trim() || "",
          year: year,
          url: titleElement?.getAttribute("href") || "",
          type: type,
          image: imageElement?.getAttribute("src") || "",
          desc: actorsElement?.textContent?.trim() || "",
        };
      });
    });
    console.log('batas senja');
    console.log("Search Results:", searchResults);

    return searchResults;
  } catch (error) {
    console.error("An error occurred during scraping:", error);
    await page.screenshot({ path: "error-screenshot.png" });
    console.log("Page content:", await page.content());
    return [];
  }
};

const scrapeAnimeLists = async function scrapeAnime(
  searchQuery: string
): Promise<SearchResult[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const baseUrl = process.env.ANIME_SEARCH_URL;
    if (!baseUrl) {
      throw new Error(
        "ANIME_SEARCH_URL is not defined in environment variables."
      );
    }

    await page.goto(
      `${baseUrl}?q=${encodeURIComponent(searchQuery)}&cat=anime`,
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    await page.waitForSelector(".js-categories-seasonal tr", {
      timeout: 60000,
    });

    const searchResults = await page.evaluate(() => {
      const results = document.querySelectorAll(".js-categories-seasonal tr");

      return Array.from(results)
        .slice(1)
        .map((row) => {
          const titleElement = row.querySelector(".hoverinfo_trigger strong");
          const imageElement = row.querySelector(".picSurround img");
          const descriptionElement = row.querySelector(".pt4");
          const typeElement = row.querySelector("td:nth-child(3)");

          return {
            title: titleElement?.textContent?.trim() || "",
            year: "",
            url: titleElement?.parentElement?.getAttribute("href") || "",
            type: typeElement?.textContent?.trim() || "",
            image:
              imageElement?.getAttribute("data-src") ||
              imageElement?.getAttribute("src") ||
              "",
            desc: descriptionElement?.textContent?.trim() || "",
          };
        });
    });
    console.log('batas senja');
    console.log("Search Results:", searchResults);

    return searchResults;
  } catch (error) {
    console.error("An error occurred during scraping:", error);
    await page.screenshot({ path: "error-screenshot.png" });
    console.log("Page content:", await page.content());
    return [];
  }
};

const scrapeMangaLists = async function scrapeManga(
  searchQuery: string
): Promise<SearchResult[]> {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  try {
    const baseUrl = process.env.MANGA_SEARCH_URL;
    if (!baseUrl) {
      throw new Error(
        "MANGA_SEARCH_URL is not defined in environment variables."
      );
    }

    await page.goto(
      `${baseUrl}?q=${encodeURIComponent(searchQuery)}&cat=manga`,
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    await page.waitForSelector(".js-categories-seasonal tr", {
      timeout: 60000,
    });

    const searchResults = await page.evaluate(() => {
      const results = document.querySelectorAll(".js-categories-seasonal tr");

      return Array.from(results)
        .slice(1)
        .map((row) => {
          const titleElement = row.querySelector(".hoverinfo_trigger strong");
          const imageElement = row.querySelector(".picSurround img");
          const descriptionElement = row.querySelector(".pt4");
          const typeElement = row.querySelector("td:nth-child(3)");

          return {
            title: titleElement?.textContent?.trim() || "",
            year: "",
            url: titleElement?.parentElement?.getAttribute("href") || "",
            type: typeElement?.textContent?.trim() || "",
            image:
              imageElement?.getAttribute("data-src") ||
              imageElement?.getAttribute("src") ||
              "",
            desc: descriptionElement?.textContent?.trim() || "",
          };
        });
    });
    console.log('batas senja');
    console.log("Search Results:", searchResults);

    return searchResults;
  } catch (error) {
    console.error("An error occurred during scraping:", error);
    await page.screenshot({ path: "error-screenshot.png" });
    console.log("Page content:", await page.content());
    return [];
  }
};

const scrapeBookLists = async function scrapeBook(
  searchQuery: string
): Promise<SearchResult[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-extensions",
      "--disable-gpu",
      "--window-size=1280,800",
    ],
  });
  const page = await browser.newPage();
  const userAgent = process.env.USER_AGENT;
  if (!userAgent) {
    throw new Error("USER_AGENT is not defined in environment variables.");
  }
  await page.setUserAgent(userAgent);

  try {
    const baseUrl = process.env.BOOK_SEARCH_URL;
    if (!baseUrl) {
      throw new Error(
        "BOOK_SEARCH_URL is not defined in environment variables."
      );
    }

    await page.goto(
      `${baseUrl}?q=${encodeURIComponent(searchQuery)}&search_type=books`,
      {
        waitUntil: "networkidle2",
        timeout: 60000,
      }
    );

    await page.waitForSelector(".tableList tr", { timeout: 60000 });

    const searchResults = await page.evaluate(() => {
      const results = document.querySelectorAll(".tableList tr");

      return Array.from(results).map((row) => {
        const titleElement = row.querySelector(".bookTitle");
        const imageElement = row.querySelector("img.bookCover");

        return {
          title: titleElement?.textContent?.trim() || "",
          year: "",
          url: titleElement?.getAttribute("href") || "",
          type: "Book",
          image: imageElement?.getAttribute("src") || "",
          desc: "",
        };
      });
    });
    console.log('batas senja');
    console.log("Search Results:", searchResults);

    return searchResults;
  } catch (error) {
    console.error("An error occurred during scraping:", error);
    await page.screenshot({ path: "error-screenshot.png" });
    console.log("Page content:", await page.content());
    return [];
  }
};

const scrapeGameLists = async function scrapeGame(
  searchQuery: string
): Promise<SearchResult[]> {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-infobars",
      "--disable-extensions",
      "--disable-gpu",
      "--window-size=1280,800",
    ],
  });
  const page = await browser.newPage();

  try {
    const baseUrl = process.env.GAME_SEARCH_URL;
    if (!baseUrl) {
      throw new Error(
        "GAME_SEARCH_URL is not defined in environment variables."
      );
    }
    await page.goto(`${baseUrl}?term=${encodeURIComponent(searchQuery)}`, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    await page.waitForSelector(".search_result_row", { timeout: 60000 });

    const searchResults = await page.evaluate(() => {
      const results = document.querySelectorAll(".search_result_row");

      return Array.from(results).map((row) => {
        const titleElement = row.querySelector(".search_name");
        const imageElement = row.querySelector(".search_capsule img");
        const descriptionElement = row.querySelector(".discount_final_price");
        const yearElements = row.querySelector(".search_released");

        return {
          title: titleElement?.textContent?.trim() || "",
          year: yearElements?.textContent?.trim() || "",
          url: row.getAttribute("href") || "",
          type: "Game",
          image: imageElement?.getAttribute("src") || "",
          desc: descriptionElement?.textContent?.trim() || "",
        };
      });
    });
    console.log('batas senja');
    console.log("Search Results:", searchResults);

    return searchResults;
  } catch (error) {
    console.error("An error occurred during scraping:", error);
    await page.screenshot({ path: "error-screenshot.png" });
    console.log("Page content:", await page.content());
    return [];
  }
};

export {
  scrapeFilmLists,
  scrapeAnimeLists,
  scrapeMangaLists,
  scrapeBookLists,
  scrapeGameLists,
};
