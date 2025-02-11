export default async function (fastify, options) {
    fastify.addHook("onRequest", (request, reply, done) => {
        const { method, url } = request;
        const ip = request.ip;
        const userAgent = request.headers["user-agent"];

        request.log.info({ method, url, ip, userAgent }, "Incoming request");
        done();
    });
}