import swagger from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0", // Specify the OpenAPI version
    info: {
      title: "Social-app",
      version: "1.0.0",
      description: "A Social-app API documentation using Swagger",
    },
    server: {
      url: "http://localhost:8000",
    },
  },
  apis: [`./routes/*.ts`], // Specify the path to your API route files
};

const swaggerSpec = swagger(options);

export default swaggerSpec;
