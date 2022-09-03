var { MongoClient } = require('mongodb');
const connectionString = process.env.MONGO_URI

const client = new MongoClient(connectionString, { useUnifiedTopology: true });

const init = async () => {
  try{
    await client.connect();
    console.log('MongoDB Standalone Connected');
  }catch(err){
    console.log(err);
  }
}

const getClient = () => {
  return client;
}

module.exports = { init, getClient }