const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       required:
 *         - customerID
 *         - bookID
 *         - initialDate
 *       properties:
 *         customerID:
 *           type: string
 *           description: ID of the customer who placed the order
 *         bookID:
 *           type: string
 *           description: ID of the book being ordered
 *         initialDate:
 *           type: string
 *           format: date
 *           description: Initial date of the order
 *         deliveryDate:
 *           type: string
 *           format: date
 *           description: Delivery date of the order
 */
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "Order Service API",
      version: "1.0.0",
      description: "API for managing customer orders and fetching related data"
    },
    servers: [
      {
        url: "http://localhost:9000",
        description: "Local server"
      }
    ]
  },
  apis: ["./server.js", "./routes/*.js"], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = { swaggerUi, swaggerDocs };
