require("dotenv").config();
const express = require('express');
const mongoose = require('mongoose');
const Book = require('./Book');
const connectDB = require('../db/db');

connectDB();

const app = express();
const port = 3000;

app.use(express.json());

app.post('/book', (req, res) => {
  const newBook = new Book({ ...req.body });
  newBook.save()
    .then(() => {
      res.send('New Book added successfully!');
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error!');
    });
});

app.get('/book/:id', (req, res) => {
    console.log("dadadada")
    const bookId = req.params.id; 
    
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).send('Invalid Book ID');
    }
  
    Book.findById(bookId)
    .then((book) => {
      if (book) {
        return res.json(book);
      } else {
        return res.status(404).send('Book not found');
      }
    })
    .catch((err) => {
      // Capture and log the error for better debugging
      console.error('Error retrieving book:', err);
      return res.status(500).send('Internal Server Error');
    });
});
  

app.get('/books', (req, res) => {
  Book.find()
    .then((books) => {
      if (books.length !== 0) {
        res.json(books);
      } else {
        res.status(404).send('Books not found');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error');
    });
});

app.delete('/book/:id', (req, res) => {
  Book.findByIdAndRemove(req.params.id)
    .then((book) => {
      if (book) {
        res.json('Book deleted successfully!');
      } else {
        res.status(404).send('Book not found!');
      }
    })
    .catch((err) => {
      res.status(500).send('Internal Server Error');
    });
});

app.listen(port, () => {
  console.log(`Up and running on port ${port} - This is Book service`);
});
