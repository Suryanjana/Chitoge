/**
 * @swagger
 * /download/cobalt:
 *   post:
 *     summary: Downloader Using Cobalt
 *     tags:
 *       - Download
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *                 description: The URL to download from
 *               options:
 *                 type: object
 *                 description: Additional options for the download
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: The type of download (e.g., audio, video)
 *                   quality:
 *                     type: string
 *                     description: The quality of the download
 *     responses:
 *       200:
 *         description: Successfully downloaded data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                   description: Indicates if the download was successful
 *                 creator:
 *                   type: string
 *                   description: The creator of the API
 *                 result:
 *                   type: object
 *                   description: The downloaded data
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
const cobalt = require("../../scraper/cobalt");

module.exports = async (fastify) => {
    fastify.post("/download/cobalt", async (request, reply) => {
        const { url, options } = request.body;

        if (!url) {
            return reply.status(400).send({ error: Config.message.invalidUrl });
        }

        const { type, quality } = options || {};

        const downloadOptions = { filenameStyle: "pretty" };

        if (type === "audio") {
            downloadOptions.audioBitrate = quality || "128";
            downloadOptions.downloadMode = "audio";
        } else {
            downloadOptions.videoQuality = quality || "360";
        }

        try {
            const data = await cobalt(url, downloadOptions);
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