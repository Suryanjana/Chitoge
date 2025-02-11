import { Config } from "../../config.js";
import { spotidown } from "../../scraper/spotify.js";

/**
 * @swagger
 * /downloader/spotify:
 *   get:
 *     summary: Spotify Downloader
 *     tags:
 *       - Downloader
 *     parameters:
 *       - name: url
 *         in: query
 *         required: true
 *         description: The URL of the Spotify track to download
 *         schema:
 *           type: string
 *           default: "https://open.spotify.com/track/2gcMYiZzzmzoF8PPAfL3IO?si=45838d03560a4857"
 *     responses:
 *       200:
 *         description: Successfully retrieved track information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the request was successful
 *                 creator:
 *                   type: string
 *                   description: The creator of the service
 *                 result:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                         description: The title of the track
 *                       artist:
 *                         type: string
 *                         description: The artist of the track
 *                       thumbnail:
 *                         type: string
 *                         description: URL of the track's thumbnail
 *                       audioLink:
 *                         type: string
 *                         description: URL of the track's audio file
 *                       coverLink:
 *                         type: string
 *                         description: URL of the track's cover image
 *       400:
 *         description: Bad request, invalid URL
 *       500:
 *         description: Internal server error
 */

export default async (fastify) => {
    fastify.get("/downloader/spotify", async (request, reply) => {
        const { url } = request.query;

        if (!url) {
            return reply.status(400).send({ error: Config.message.invalidUrl });
        }

        try {
            const data = await spotidown.download(url);
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