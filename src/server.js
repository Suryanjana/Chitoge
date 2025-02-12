const path = require("path");
const fs = require("fs");
const Fastify = require("fastify");
const autoload = require("@fastify/autoload");
const fastifyStatic = require("@fastify/static");
const app = Fastify({
    logger: process.env.NODE_ENV === "production" ? true : {
        transport: {
            target: "pino-pretty",
            options: {
                colorize: true,
                translateTime: "SYS:standard",
                ignore: "pid,hostname",
            },
        },
    },
});

app.register(require("./plugins/swagger"));
app.register(require("./middlewares/rateLimit"));
app.register(require("./middlewares/logger"))
app.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
});

app.register(autoload, {
    dir: path.join(__dirname, "routes"),
    options: { prefix: "/api" },
});

app.register(require("@fastify/view"), {
    engine: {
        ejs: require("ejs"),
    },
    root: path.join(__dirname, "views"),
});

app.get("/", (request, reply) => {
    reply.view("index.ejs", { title: "Dashboard" });
});

const registerRoutes = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            registerRoutes(filePath);
        } else if (file.endsWith(".js")) {
            app.register(require(filePath));
        }
    });
};

registerRoutes(path.join(__dirname, "routes"));

const start = async () => {
    try {
        await app.listen({ port: process.env.PORT || 3000 });
        console.log(
            `Server listening on http://localhost:${process.env.PORT || 3000}`
        );
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};

start();
