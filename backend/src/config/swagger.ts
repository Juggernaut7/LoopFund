import swaggerJSDoc from 'swagger-jsdoc';
import { env } from './env';

const version = '1.0.0';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'LoopFund API',
      version,
      description: 'LoopFund REST API Documentation',
    },
    servers: [
      { url: `http://localhost:${env.port}`, description: 'Local dev' },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }],
  },
  apis: ['src/routes/**/*.ts'],
}); 