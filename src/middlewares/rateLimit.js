module.exports = async function (fastify) {
    fastify.register(require("@fastify/rate-limit"), {
        max: 100,
        timeWindow: "1 minute",
        errorResponseBuilder: (res) => {
            res.status(429);
            return {
                statusCode: 429,
                error: "Too Many Requests",
                message: "You have exceeded the request limit. Please try again later.",
            };
        },
    });
};