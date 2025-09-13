const mongoose = require('mongoose');
require('dotenv').config();

const checkCars = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB connected successfully!');
    
    const Car = require('./models/Car');
    const User = require('./models/User');
    
    const cars = await Car.find().populate('user', 'name email');
    console.log(`Found ${cars.length} cars:`);
    
    cars.forEach((car, index) => {
      console.log(`${index + 1}. ${car.make} ${car.model} (${car.year}) - Owner: ${car.user ? car.user.name : 'No owner'} (${car.user ? car.user.email : 'N/A'})`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
};

checkCars();
