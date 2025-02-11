import swagger from "@fastify/swagger";
import { SwaggerTheme, SwaggerThemeNameEnum } from "swagger-themes";
import swaggerUi from "@fastify/swagger-ui";
import swaggerJsDoc from "swagger-jsdoc";
import fs from "fs";
import { Config } from "../config.js";

export default async function (fastify) {
    const theme = new SwaggerTheme();
    const content = theme.getBuffer(SwaggerThemeNameEnum.FEELING_BLUE);

    const faviconBuffer = fs.readFileSync("public/favicon.ico");
    const faviconBase64 = faviconBuffer.toString("base64");

    const swaggerOptions = {
        definition: {
            openapi: "3.0.0",
            info: {
                title: Config.info.title,
                description: Config.info.description,
                version: "1.0.0",
                contact: {
                    name: Config.creator,
                    email: Config.info.email,
                    url: Config.web,
                },
            },
            servers: [
                {
                    url: `http://localhost:${process.env.PORT || 3000}`,
                },
            ],
        },
        apis: ["./routes/**/*.js"],
    };

    const swaggerDocs = swaggerJsDoc(swaggerOptions);

    fastify.register(swagger, {
        openapi: swaggerDocs,
        exposeRoute: true,
    });

    fastify.register(swaggerUi, {
        routePrefix: "/docs",
        swagger: swaggerDocs,
        exposeRoute: true,
        uiConfig: {
            layout: "BaseLayout",
        },
        theme: {
            title: "Chitoge RestAPIs",
            css: [{ filename: "theme.css", content }],
            favicon: [
                {
                    filename: "favicon.ico",
                    rel: "icon",
                    sizes: "16x16",
                    type: "image/x-icon",
                    content: Buffer.from(faviconBase64, "base64"),
                },
            ],
        },
    });
}