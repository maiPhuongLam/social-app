import swaggerjsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0", // Specify the OpenAPI version
    info: {
      title: "Social-app",
      version: "1.0.0",
      description: "A Social-app API documentation using Swagger",
      contact: {
        name: "Mai Phuong lam",
        email: "maiphuonglambh.2002@gmail.com",
      },
    },
    servers: [
      {
        url: "http://localhost:8000/",
        description: "Development server",
      },
    ],
  },
  apis: [`./routes/*.ts`], // Specify the path to your API route files
};

const swaggerSpec = swaggerjsdoc(options);

export default swaggerSpec;
