import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "BrainAPI Trivia Service",
    version: "1.0.0",
    description: "OpenTDB-like trivia API with JWT and MongoDB",
  },
  servers: [{ url: "http://localhost:5000" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

const options = {
  swaggerDefinition,
  apis: ["./docs/*.yaml"],
};

export const swaggerSpec = swaggerJSDoc(options);
