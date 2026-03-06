import swaggerJSDoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "BrainyQuizy  Service",
    version: "1.0.0",
    description: " API with JWT and MongoDB",
  },
  servers: [
    { url: "http://localhost:5000" },
    { url: "https://brainyquizy.vercel.app" },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  tags: [
    { name: "Auth" },
    { name: "Categories" },
    { name: "Questions" },
    { name: "User Questions" },
    { name: "Token" },
    { name: "Scores" },
  ],
};

const options = {
  swaggerDefinition,
  apis: [
    path.join(__dirname, "../docs/*.yaml"),
    path.resolve(process.cwd(), "backend/docs/*.yaml"),
  ],
};

export const swaggerSpec = swaggerJSDoc(options);
