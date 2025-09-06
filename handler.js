import { scrapeQuotes } from "./scraper.js";

export const handler = async (event) => {
  try {
    const input = (typeof event.body === "string") ? JSON.parse(event.body) : event.body;

    const response = await scrapeQuotes(input);

    return {
      statusCode: 200,
      body: { success: true, data: response },
    };
  } catch (err) {
    console.error("Scraper error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message }),
    };
  }
};