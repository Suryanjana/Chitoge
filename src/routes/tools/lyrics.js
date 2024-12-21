/**
 * @swagger
 * /tools/lyrics/search:
 *   get:
 *     summary: Search for lyrics
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *         description: The search query for lyrics
 *     responses:
 *       200:
 *         description: Successfully retrieved lyrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the search was successful
 *                 creator:
 *                   type: string
 *                   description: The creator of the API
 *                 result:
 *                   type: object
 *                   description: The search results
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

/**
 * @swagger
 * /tools/lyrics/get:
 *   get:
 *     summary: Get lyrics from a URL
 *     tags:
 *       - Tools
 *     parameters:
 *       - in: query
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: The URL of the lyrics page
 *     responses:
 *       200:
 *         description: Successfully scraped lyrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the scraping was successful
 *                 creator:
 *                   type: string
 *                   description: The creator of the API
 *                 result:
 *                   type: object
 *                   description: The scraped lyrics
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Error message
 */

const Config = require("../../config");
const { searchLyric, scrapeLyrics } = require("../../scraper/genius");

module.exports = async (fastify) => {
    fastify.get("/tools/lyrics/search", async (request, reply) => {
        const { query } = request.query;

        if (!query) {
            return reply.status(400).send({ error: Config.message.invalidQuery });
        }

        try {
            const data = await searchLyric(query);
            return reply.send({
                status: true,
                creator: Config.creator,
                result: data,
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                status: false,
                message: Config.message.internalServerError,
            });
        }
    });

    fastify.get("/tools/lyrics/get", async (request, reply) => {
        const { url } = request.query;

        if (!url) {
            return reply.status(400).send({ error: Config.message.invalidUrl });
        }

        try {
            const data = await scrapeLyrics(url);
            return reply.send({
                status: true,
                creator: Config.creator,
                result: data,
            });
        } catch (error) {
            console.error(error);
            return reply.status(500).send({
                status: false,
                message: Config.message.internalServerError,
            });
        }
    });
};
