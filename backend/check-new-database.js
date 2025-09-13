const mongoose = require('mongoose');
require('dotenv').config();

const checkNewDatabase = async () => {
  try {
    console.log('🔍 Checking your NEW MongoDB database...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to your NEW MongoDB database!');
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`\n📊 NEW Database Name: "${dbName}"`);
    
    // List all collections in the new database
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Found ${collections.length} collections in "${dbName}":`);
    
    if (collections.length === 0) {
      console.log('   ⚠️  No collections found - this is a fresh database!');
      console.log('   💡 Collections will be created when you add your first car.');
    } else {
      collections.forEach((collection, index) => {
        console.log(`${index + 1}. Collection Name: "${collection.name}"`);
      });
    }
    
    // Check each collection for documents
    console.log('\n🔍 Checking each collection for documents:');
    for (const collection of collections) {
      const count = await db.collection(collection.name).countDocuments();
      console.log(`   - ${collection.name}: ${count} documents`);
      
      if (count > 0 && collection.name === 'cars') {
        console.log('   📋 Sample car document:');
        const sample = await db.collection(collection.name).findOne();
        console.log(JSON.stringify(sample, null, 2));
      }
    }
    
    // Test creating a collection by adding a test car
    console.log('\n🧪 Testing collection creation...');
    try {
      const Car = require('./models/Car');
      const User = require('./models/User');
      
      // First, let's create a test user
      const testUser = new User({
        name: 'Test User',
        email: 'test@newdb.com',
        password: 'hashedpassword'
      });
      
      await testUser.save();
      console.log('✅ Test user created successfully!');
      
      // Now create a test car
      const testCar = new Car({
        user: testUser._id,
        make: 'Test',
        model: 'Car',
        year: 2024,
        color: 'Blue',
        licensePlate: 'TEST123',
        mileage: 0
      });
      
      await testCar.save();
      console.log('✅ Test car created successfully!');
      console.log('🎉 Collections are now created in your new database!');
      
      // Clean up test data
      await Car.deleteOne({ make: 'Test' });
      await User.deleteOne({ email: 'test@newdb.com' });
      console.log('🧹 Test data cleaned up!');
      
    } catch (error) {
      console.log('⚠️  Could not create test data:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  }
};

checkNewDatabase();
