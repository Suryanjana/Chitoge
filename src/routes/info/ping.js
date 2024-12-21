const os = require("os");

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Get system information
 *     tags:
 *       - Testing
 *     responses:
 *       200:
 *         description: Successfully retrieved system information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 uptime:
 *                   type: number
 *                   description: System uptime in seconds
 *                 memory:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       description: Total system memory in bytes
 *                     free:
 *                       type: number
 *                       description: Free system memory in bytes
 *                 cpus:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       model:
 *                         type: string
 *                         description: CPU model
 *                       speed:
 *                         type: number
 *                         description: CPU speed in MHz
 */

module.exports = async (fastify) => {
    fastify.get("/ping", async () => {
        const uptime = os.uptime();
        const totalMemory = os.totalmem();
        const freeMemory = os.freemem();
        const cpus = os.cpus();

        const systemInfo = {
            status: true,
            uptime,
            memory: {
                total: totalMemory,
                free: freeMemory,
            },
            cpus: cpus.map((cpu) => ({
                model: cpu.model,
                speed: cpu.speed,
            })),
        };

        return systemInfo;
    });
};
