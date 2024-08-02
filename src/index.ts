import puppeteer from "puppeteer";
import { scrapeFilmLists, scrapeAnimeLists, scrapeMangaLists, scrapeBookLists, scrapeGameLists } from "./scrapper";

async function main() {
  const searchQuery = process.argv[2].trim();

  if (!searchQuery) {
    console.error("Please provide a search query as an argument.");
    process.exit(1);
  }

  console.log(`Searching for: "${searchQuery}"`);

  const browser = await puppeteer.launch();

  const films = await scrapeFilmLists(searchQuery);
  const animes = await scrapeAnimeLists(searchQuery);
  const mangas = await scrapeMangaLists(searchQuery);
  const books = await scrapeBookLists(searchQuery);
  const games = await scrapeGameLists(searchQuery);

  //process exit
  await browser.close();
  process.exit(1);
}


main().catch(console.error);
