require('dotenv').config({ path: '../.env' });

console.log('🔍 Checking your MongoDB URI configuration...');
console.log('MONGODB_URI:', process.env.MONGODB_URI);

if (process.env.MONGODB_URI) {
  // Extract database name from URI
  const uri = process.env.MONGODB_URI;
  const match = uri.match(/\/([^?]+)(\?|$)/);
  const dbName = match ? match[1] : 'Unknown';
  
  console.log(`\n📊 Database name from URI: "${dbName}"`);
  
  // Check if it contains common database names
  if (uri.includes('hkcars')) {
    console.log('✅ URI contains "hkcars" - this should create a new database!');
  } else if (uri.includes('carvault')) {
    console.log('⚠️  URI contains "carvault" - this is the old database');
  } else {
    console.log('ℹ️  URI contains a different database name');
  }
  
  // Show the full connection details
  console.log('\n🔗 Connection details:');
  const url = new URL(uri);
  console.log(`   Host: ${url.hostname}`);
  console.log(`   Port: ${url.port || '27017'}`);
  console.log(`   Database: ${dbName}`);
  console.log(`   Username: ${url.username || 'Not specified'}`);
  
} else {
  console.log('❌ MONGODB_URI is not set in .env file');
}
