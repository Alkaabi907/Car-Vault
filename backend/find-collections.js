const mongoose = require('mongoose');
require('dotenv').config();

const findCollections = async () => {
  try {
    console.log('Connecting to MongoDB Atlas...');
    console.log('MONGODB_URI:', process.env.MONGODB_URI ? 'Set' : 'Not set');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');
    
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    console.log(`\n📊 Database Name: "${dbName}"`);
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log(`\n📁 Found ${collections.length} collections:`);
    
    collections.forEach((collection, index) => {
      console.log(`${index + 1}. Collection Name: "${collection.name}"`);
    });
    
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
    
    // Check if there are any cars in any collection
    console.log('\n🚗 Searching for car-related data:');
    for (const collection of collections) {
      const sample = await db.collection(collection.name).findOne({ make: { $exists: true } });
      if (sample) {
        console.log(`   Found car data in collection: "${collection.name}"`);
        console.log(`   Sample: ${sample.make} ${sample.model} (${sample.year})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB Atlas');
  }
};

findCollections();
