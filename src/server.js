import path from "path";
import { fileURLToPath, pathToFileURL } from "node:url";
import fs from "fs";
import Fastify from "fastify";
import autoload from "@fastify/autoload";
import fastifyStatic from "@fastify/static";
import swaggerPlugin from "./plugins/swagger.js";
import rateLimitMiddleware from "./middlewares/rateLimit.js";
import loggerMiddleware from "./middlewares/logger.js";
import fastifyView from "@fastify/view";
import ejs from "ejs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = Fastify({
    logger: {
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

app.register(swaggerPlugin);
app.register(rateLimitMiddleware);
app.register(loggerMiddleware);

app.register(fastifyStatic, {
    root: path.join(__dirname, "public"),
});

app.register(autoload, {
    dir: path.join(__dirname, "routes"),
    options: { prefix: "/api" },
}).after(() => {
    console.log(app.printRoutes());
});

app.register(fastifyView, {
    engine: {
        ejs,
    },
    root: path.join(__dirname, "views"),
});

app.get("/", (request, reply) => {
    reply.view("index.ejs", { title: "Dashboard" });
});

const registerRoutes = async (dir) => {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            await registerRoutes(filePath);
        } else if (file.endsWith(".js")) {
            const moduleUrl = pathToFileURL(filePath).href; 
            const module = await import(moduleUrl);
            app.register(module.default);
        }
    }
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