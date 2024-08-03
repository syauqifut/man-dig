import express from "express";
import { scrapeFilmLists, scrapeAnimeLists, scrapeMangaLists, scrapeBookLists, scrapeGameLists } from "./scrapper";
import { SearchResult } from "./models/searchResult";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get("/search", async (req, res) => {
  const searchQuery = req.query.q as string;

  if (!searchQuery) {
    return res.status(400).json({ error: "Please provide a search query as a 'q' parameter." });
  }

  console.log(`Searching for: "${searchQuery}"`);

  try{
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

    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while processing your request." });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});