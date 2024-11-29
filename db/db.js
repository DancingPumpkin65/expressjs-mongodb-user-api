const mongoose = require('mongoose');

/**
 * Establish a connection to the MongoDB database
 */
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGO_URI || 'mongodb://localhost:27017/userDatabase';

    await mongoose.connect(dbURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });

    console.log('MongoDB connected successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    
    process.exit(1);
  }
};

module.exports = connectDB;
