/**
 * MongoDB Atlas Ping Script
 * 
 * This script connects to your MongoDB Atlas cluster and performs a simple operation
 * to keep your account active and prevent suspension.
 * 
 * Usage:
 * 1. Replace the connection string with your MongoDB Atlas connection string
 * 2. Run: node scripts/mongodb-ping.js
 */

const { MongoClient } = require('mongodb');

// Replace with your MongoDB Atlas connection string
// Format: mongodb+srv://<username>:<password>@<cluster-url>/<database>?retryWrites=true&w=majority
const uri = "YOUR_MONGODB_ATLAS_CONNECTION_STRING";

async function pingMongoDB() {
  console.log("Connecting to MongoDB Atlas...");
  
  const client = new MongoClient(uri, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();
    console.log("Connected successfully to MongoDB Atlas");

    // Get the database and collection
    const database = client.db("admin");
    const collection = database.collection("system.version");

    // Perform a simple query to keep the account active
    const result = await collection.findOne({});
    console.log("Query executed successfully");
    console.log("MongoDB version information:", result);

    console.log("\nYour MongoDB Atlas account should now remain active.");
    console.log("This request has been logged by MongoDB Atlas.");

  } catch (e) {
    console.error("Error connecting to MongoDB Atlas:", e);
  } finally {
    // Close the connection
    await client.close();
    console.log("Connection closed");
  }
}

// Run the function
pingMongoDB().catch(console.error);
