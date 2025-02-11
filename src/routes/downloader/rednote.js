import { Config } from "../../config.js";
import rednote from "../../scraper/rednote.js";

/**
 * @swagger
 * /downloader/rednote:
 *   get:
 *     summary: Rednote Downloader
 *     tags:
 *       - Downloader
 *     parameters:
 *       - name: url
 *         in: query
 *         required: true
 *         description: The URL of the rednote to scrape
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successfully retrieved rednote information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 noteId:
 *                   type: string
 *                   description: The ID of the note
 *                 nickname:
 *                   type: string
 *                   description: The nickname of the note creator
 *                 title:
 *                   type: string
 *                   description: The title of the note
 *                 description:
 *                   type: string
 *                   description: The description of the note
 *                 keywords:
 *                   type: string
 *                   description: Keywords associated with the note
 *                 duration:
 *                   type: string
 *                   description: Duration of the video
 *                 noteLikes:
 *                   type: string
 *                   description: Number of likes on the note
 *                 noteCollects:
 *                   type: string
 *                   description: Number of collects on the note
 *                 noteComments:
 *                   type: string
 *                   description: Number of comments on the note
 *                 images:
 *                   type: array
 *                   items:
 *                     type: string
 *                     description: URLs of images associated with the note
 *                 videoUrl:
 *                   type: string
 *                   description: URL of the video
 *       400:
 *         description: Bad request, invalid URL
 *       500:
 *         description: Internal server error
 */

export default async (fastify) => {
    fastify.get("/downloader/rednote", async (request, reply) => {
        const { url } = request.query;

        if (!url) {
            return reply.status(400).send({ error: Config.message.invalidUrl });
        }

        try {
            const data = await rednote(url);
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