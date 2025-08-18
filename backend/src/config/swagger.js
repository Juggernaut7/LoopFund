const swaggerJSDoc = require('swagger-jsdoc');
const { env } = require('./env');

const version = '1.0.0';

const swaggerSpec = swaggerJSDoc({
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
  apis: ['src/routes/**/*.js'],
});

module.exports = { swaggerSpec }; 