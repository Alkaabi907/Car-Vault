const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: '../.env' });

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname,'build')));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cars', require('./routes/cars'));
app.use('/api/maintenance', require('./routes/maintenance'));
app.use('/api/expenses', require('./routes/expenses'));

// MongoDB Connection - ONLY MongoDB Atlas
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI is not set in .env file');
  console.error('Please add your MongoDB Atlas connection string to .env file');
  process.exit(1);
}

if (MONGODB_URI.includes('localhost')) {
  console.log('⚠️  Using local MongoDB for development');
  console.log('Your current URI:', MONGODB_URI);
  console.log('💡 For production, please use MongoDB Atlas URI');
}

console.log('🔗 Connecting to MongoDB...');
console.log('Database:', MONGODB_URI.split('/').pop().split('?')[0]);

mongoose.connect(MONGODB_URI)
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('🌐 Database ready for CarVault!');
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.error('Please check your MongoDB URI in .env file');
  process.exit(1);
});

const PORT = process.env.PORT || 5002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});
