const mongoose = require('mongoose');
require('dotenv').config({ path: '../.env' });

const testConnection = async () => {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    // Test creating a car document
    const Car = require('./models/Car');
    const User = require('./models/User');
    
    console.log('Testing database operations...');
    
    // Check if we can access the database
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    // Check existing cars
    const existingCars = await Car.find();
    console.log(`✅ Found ${existingCars.length} existing cars in database`);
    
    if (existingCars.length > 0) {
      console.log('Sample car:', {
        make: existingCars[0].make,
        model: existingCars[0].model,
        year: existingCars[0].year
      });
    }
    
    console.log('🎉 Database is ready for CarVault!');
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

testConnection();
