const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in environment variables');
    return;
  }
  
  console.log('🔗 Testing MongoDB connection...');
  console.log('📍 URI (masked):', uri.replace(/\/\/.*:.*@/, '//***:***@'));
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    retryWrites: true,
    retryReads: true,
  });
  
  try {
    console.log('⏳ Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');
    
    console.log('⏳ Testing database access...');
    const db = client.db('idcard');
    
    console.log('⏳ Pinging database...');
    const pingResult = await db.admin().ping();
    console.log('✅ Ping successful:', pingResult);
    
    console.log('⏳ Listing collections...');
    const collections = await db.listCollections().toArray();
    console.log('✅ Collections found:', collections.map(c => c.name));
    
    // Test reading from students collection
    console.log('⏳ Testing students collection...');
    const students = db.collection('students');
    const studentCount = await students.countDocuments();
    console.log('✅ Students count:', studentCount);
    
    // Test reading from entry_logs collection
    console.log('⏳ Testing entry_logs collection...');
    const entries = db.collection('entry_logs');
    const entryCount = await entries.countDocuments();
    console.log('✅ Entry logs count:', entryCount);
    
    console.log('🎉 All tests passed! MongoDB is working correctly.');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('📋 Error details:');
    console.error('   - Code:', error.code);
    console.error('   - Name:', error.name);
    if (error.cause) {
      console.error('   - Cause:', error.cause.message);
    }
    
    // Specific error handling
    if (error.message.includes('ECONNREFUSED')) {
      console.error('');
      console.error('🔧 Possible solutions:');
      console.error('   1. Check if MongoDB Atlas cluster is paused (resume it)');
      console.error('   2. Verify your IP address is whitelisted in MongoDB Atlas');
      console.error('   3. Check your internet connection');
      console.error('   4. Verify the connection string is correct');
    }
    
    if (error.message.includes('authentication failed')) {
      console.error('');
      console.error('🔧 Authentication issue:');
      console.error('   1. Check username and password in connection string');
      console.error('   2. Verify database user permissions in MongoDB Atlas');
    }
    
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

testConnection().catch(console.error);
