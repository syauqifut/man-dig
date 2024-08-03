import puppeteer, { Browser, Page } from "puppeteer";
import dotenv from "dotenv";
import { ErrorMessage } from "./errorMessage";
import { SearchResult } from "./models/searchResult";

dotenv.config();

const scrapeFilmLists = async function scrapeFilms(
  searchQuery: string,
  browser: Browser
): Promise<SearchResult[]> {
  try {
    const page = await browser.newPage();
    const userAgent = process.env.USER_AGENT;
    if (!userAgent) {
      ErrorMessage.EnvironmentNotFoundError("USER_AGENT");
      return [];
    }
    await page.setUserAgent(userAgent);

    const baseUrl = process.env.FILM_SEARCH_URL;
    if (!baseUrl) {
      ErrorMessage.EnvironmentNotFoundError("FILM_SEARCH_URL");
      return [];
    }

    await page.goto(`${baseUrl}?q=${encodeURIComponent(searchQuery)}`, {
      waitUntil: "networkidle2",
      timeout: 10000,
    });

    await page.waitForSelector(
      'section[data-testid="find-results-section-title"]',
      { timeout: 10000 }
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

    return searchResults;
  } catch (error) {
    ErrorMessage.ScrapeError(error);
    return [];
  }
};

const scrapeAnimeLists = async function scrapeAnime(
  searchQuery: string,
  browser: Browser
): Promise<SearchResult[]> {
  try {
    const page = await browser.newPage();

    const baseUrl = process.env.ANIME_SEARCH_URL;
    if (!baseUrl) {
      ErrorMessage.EnvironmentNotFoundError("ANIME_SEARCH_URL");
      return [];
    }

    await page.goto(
      `${baseUrl}?q=${encodeURIComponent(searchQuery)}&cat=anime`,
      {
        waitUntil: "networkidle2",
        timeout: 10000,
      }
    );

    await page.waitForSelector(".js-categories-seasonal tr", {
      timeout: 10000,
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

    return searchResults;
  } catch (error) {
    ErrorMessage.ScrapeError(error);
    return [];
  }
};

const scrapeMangaLists = async function scrapeManga(
  searchQuery: string,
  browser: Browser
): Promise<SearchResult[]> {
  try {
    const page = await browser.newPage();

    const baseUrl = process.env.MANGA_SEARCH_URL;
    if (!baseUrl) {
      ErrorMessage.EnvironmentNotFoundError("MANGA_SEARCH_URL");
      return [];
    }

    await page.goto(
      `${baseUrl}?q=${encodeURIComponent(searchQuery)}&cat=manga`,
      {
        waitUntil: "networkidle2",
        timeout: 10000,
      }
    );

    await page.waitForSelector(".js-categories-seasonal tr", {
      timeout: 10000,
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

    return searchResults;
  } catch (error) {
    ErrorMessage.ScrapeError(error);
    return [];
  }
};

const scrapeBookLists = async function scrapeBook(
  searchQuery: string,
  browser: Browser
): Promise<SearchResult[]> {
  try {
    const page = await browser.newPage();
    const userAgent = process.env.USER_AGENT;
    if (!userAgent) {
      ErrorMessage.EnvironmentNotFoundError("USER_AGENT");
      return [];
    }
    await page.setUserAgent(userAgent);

    const baseUrl = process.env.BOOK_SEARCH_URL;
    if (!baseUrl) {
      ErrorMessage.EnvironmentNotFoundError("BOOK_SEARCH_URL");
      return [];
    }

    await page.goto(
      `${baseUrl}?q=${encodeURIComponent(searchQuery)}&search_type=books`,
      {
        waitUntil: "networkidle2",
        timeout: 10000,
      }
    );

    await page.waitForSelector(".tableList tr", { timeout: 10000 });

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

    return searchResults;
  } catch (error) {
    ErrorMessage.ScrapeError(error);
    return [];
  }
};

const scrapeGameLists = async function scrapeGame(
  searchQuery: string,
  browser: Browser
): Promise<SearchResult[]> {
  try {
    const page = await browser.newPage();
    const userAgent = process.env.USER_AGENT;
    if (!userAgent) {
      ErrorMessage.EnvironmentNotFoundError("USER_AGENT");
      return [];
    }
    await page.setUserAgent(userAgent);

    const baseUrl = process.env.GAME_SEARCH_URL;
    if (!baseUrl) {
      ErrorMessage.EnvironmentNotFoundError("GAME_SEARCH_URL");
      return [];
    }
    await page.goto(`${baseUrl}?term=${encodeURIComponent(searchQuery)}`, {
      waitUntil: "networkidle2",
      timeout: 10000,
    });

    await page.waitForSelector(".search_result_row", { timeout: 10000 });

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

    return searchResults;
  } catch (error) {
    ErrorMessage.ScrapeError(error);
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
