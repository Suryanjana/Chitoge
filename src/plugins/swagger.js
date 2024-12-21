const swagger = require("@fastify/swagger");
const { SwaggerTheme, SwaggerThemeNameEnum } = require("swagger-themes");
const swaggerUi = require("@fastify/swagger-ui");
const swaggerJsDoc = require("swagger-jsdoc");
const Config = require("../config");
const fs = require("fs");

module.exports = async function (fastify) {
    const theme = new SwaggerTheme();
    const content = theme.getBuffer(SwaggerThemeNameEnum.FEELING_BLUE);

    const faviconPath = 'src/public/favicon.ico';
    const faviconBuffer = fs.readFileSync(faviconPath);
    const faviconBase64 = faviconBuffer.toString('base64');

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
        apis: ["./src/routes/**/*.js"],
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
                    content: Buffer.from(faviconBase64, 'base64'),
                },
            ],
        },
    });
};