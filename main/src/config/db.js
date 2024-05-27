const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://shawen17:Shawenbaba1@shawencluster.jzsljb4.mongodb.net/?retryWrites=true&w=majority&appName=shawenCluster";

const client = new MongoClient(uri);

// Connect to MongoDB
async function connect() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Function to get the MongoDB client
function getClient() {
  return client;
}

module.exports = { connect, getClient };
