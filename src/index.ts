import puppeteer from "puppeteer";
import { scrapeFilmLists, scrapeAnimeLists, scrapeMangaLists, scrapeBookLists, scrapeGameLists } from "./scrapper";
import { SearchResult } from "./models/searchResult";

async function main() {
  const searchQuery = process.argv[2].trim();

  if (!searchQuery) {
    console.error("Please provide a search query as an argument.");
    process.exit(1);
  }

  console.log(`Searching for: "${searchQuery}"`);

  const browser = await puppeteer.launch();

  const fetchFunctions: { [key: string]: (searchQuery: string) => Promise<SearchResult[]> } = {
    films: scrapeFilmLists,
    animes: scrapeAnimeLists,
    mangas: scrapeMangaLists,
    books: scrapeBookLists,
    games: scrapeGameLists,
  };

  const results = await Promise.all(
    Object.keys(fetchFunctions).map(async (key) => {
      const fetchFunction = fetchFunctions[key];
      const data = await fetchFunction(searchQuery);
      return { key, data: data.slice(0, 3) };
    })
  );

  results.forEach(({ key, data }) => {
    console.log(`${key.charAt(0).toUpperCase() + key.slice(1)}:`);
    console.log(data);
  });

  await browser.close();
  process.exit(1);
}


main().catch(console.error);
