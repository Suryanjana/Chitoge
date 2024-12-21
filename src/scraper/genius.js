const axios = require("axios");
const cheerio = require("cheerio");

/**
 * Scrapes lyrics from a given URL.
 * @param {string} url - The URL of the lyrics page.
 * @returns {Promise<Object>} - A promise that resolves to an object containing the lyrics.
 * @throws {Error} - Throws an error if the request fails or if the lyrics cannot be extracted.
 */
async function scrapeLyrics(url) {
    try {
        const response = await axios.get(url);
        const htmlData = response.data;
        const $ = cheerio.load(htmlData);

        const lyricsContainer = $(".Lyrics__Container-sc-1ynbvzw-1").text();
        const formattedLyrics = lyricsContainer.replace(
            /($$[A-Za-z\s0-9\-]+$$)/g,
            "\n\n$1\n"
        );

        return {
            lyrics: formattedLyrics.trim(),
        };
    } catch (error) {
        console.error("Error scraping lyrics:", error);
        throw new Error("Failed to scrape lyrics.");
    }
}

/**
 * Searches for lyrics based on a query.
 * @param {string} query - The search query for lyrics.
 * @param {string} [page="1"] - The page number for pagination.
 * @returns {Promise<Object>} - A promise that resolves to an object containing an array of song results.
 */
async function searchLyric(query, page = "1") {
    try {
        const apiUrl = `https://genius.com/api/search/song?q=${encodeURIComponent(
            query
        )}&page=${page}`;

        const response = await axios.get(apiUrl);
        if (!response.status === 200) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = response.data;

        const results = data.response.sections[0].hits.map((hit) => hit.result);
        const formattedResults = results.map((result) => ({
            title: result.title,
            fullTitle: result.full_title,
            artist: result.artist_names,
            image: result.header_image_url,
            url: result.url,
        }));

        return {
            songs: formattedResults,
        };
    } catch (error) {
        console.error("Error searching for lyrics:", error);
        throw new Error("Failed to search for lyrics.");
    }
}

module.exports = {
    scrapeLyrics,
    searchLyric,
};