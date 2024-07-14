const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Library System API',
      version: '1.0.0',
    },
    servers: [
      {
        url: 'http://localhost:8080/'
      }
    ]
  },
  apis: ['./routes/*.js'], // files containing annotations
};

const specs = swaggerJsdoc(options);
module.exports = specs;
