// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Laptop Store API',
    version: '1.0.0',
    description: 'API documentation for Laptop Store',
  },
  servers: [
    {
      url: 'http://localhost:8080',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./src/modules/**/*.ts',
    './src/server.ts', 
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
