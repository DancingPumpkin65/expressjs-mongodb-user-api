require("dotenv").config();
const axios = require('axios');
const express = require('express');
const mongoose = require('mongoose');
const Order = require('./Order');
const connectDB = require('../db/db');

connectDB();

const app = express();
const port = 9000;

app.use(express.json());

/**
 * @swagger
 * /order:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Order'
 *     responses:
 *       200:
 *         description: New order created successfully
 *       500:
 *         description: Internal Server Error
 */
app.post('/order', (req, res) => {
  const newOrder = new Order({
    customerID: mongoose.Types.ObjectId(req.body.customerID),
    bookID: mongoose.Types.ObjectId(req.body.bookID),
    initialDate: req.body.initialDate,
    deliveryDate: req.body.deliveryDate
  });

  newOrder.save()
    .then(() => {
      res.send('New order created successfully!');
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Retrieve all orders
 *     tags:
 *       - Orders
 *     responses:
 *       200:
 *         description: Successfully retrieved orders
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       404:
 *         description: Orders not found
 *       500:
 *         description: Internal Server Error
 */
app.get('/orders', (req, res) => {
  Order.find()
    .then((orders) => {
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.status(404).send('Orders not found');
      }
    })
    .catch(() => res.status(500).send('Internal Server Error!'));
});

/**
 * @swagger
 * /order/{id}:
 *   get:
 *     summary: Get order details by ID
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The order ID
 *     responses:
 *       200:
 *         description: Successfully retrieved order
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 CustomerName:
 *                   type: string
 *                   description: Name of the customer
 *                 BookTitle:
 *                   type: string
 *                   description: Title of the book
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal Server Error
 */ 
app.get('/order/:id', (req, res) => {
  Order.findById(req.params.id)
    .then((order) => {
      if (order) {
        axios.get(`http://localhost:5000/customer/${order.customerID}`)
          .then((customerResponse) => {
            let orderObject = {
              CustomerName: customerResponse.data.name,
              BookTitle: ''
            };
  
            axios.get(`http://localhost:3000/book/${order.bookID}`)
              .then((bookResponse) => {
                orderObject.BookTitle = bookResponse.data.title;
                res.json(orderObject);
              })
              .catch((err) => {
                res.status(500).send('Error fetching book details');
              });
          })
          .catch((err) => {
            res.status(500).send('Error fetching customer details');
          });
      } else {
        res.status(404).send('Order not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

app.listen(port, () => {
  console.log(`Up and Running on port ${port} - This is Order service`);
});
