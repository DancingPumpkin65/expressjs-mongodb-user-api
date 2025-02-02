require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const Customer = require('./Customer');
const connectDB = require('../db/db');

connectDB();

const app = express();
const port = 5000;

app.use(express.json());

app.post('/customer', (req, res) => {
  const newCustomer = new Customer({ ...req.body });
  newCustomer.save()
    .then(() => {
      res.send('New Customer created successfully!');
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

app.get('/customers', (req, res) => {
  Customer.find()
    .then((customers) => {
      if (customers.length > 0) {
        res.json(customers);
      } else {
        res.status(404).send('Customers not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

app.get('/customer/:id', (req, res) => {
  Customer.findById(req.params.id)
    .then((customer) => {
      if (customer) {
        res.json(customer);
      } else {
        res.status(404).send('Customer not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

app.delete('/customer/:id', (req, res) => {
  Customer.findByIdAndRemove(req.params.id)
    .then((customer) => {
      if (customer) {
        res.json('Customer deleted successfully!');
      } else {
        res.status(404).send('Customer not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

app.listen(port, () => {
  console.log(`Up and Running on port ${port} - This is Customer service`);
});
