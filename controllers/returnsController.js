const { getClient } = require('../utils/connectToMongoDirect');

const getReturns = async (req, res) => {
    const client = getClient();
    const db = client.db();
    const collection = db.collection('loop-returns-' + req.params.id);
    const data = await collection.find({
        created_date: {
            $gte: new Date(startDate).toISOString(),
            $lte: new Date(endDate).toISOString()
        }
    }).toArray();
    res.status(201).send(data);
}

const insertReturns = async (req, res) => {
    const client = getClient();
    const db = client.db();
    const collection = db.collection('loop-returns-' + req.params.id);
    const exists = await collection.findOne({ id: returns.id });
    if(!exists){
        await collection.insertOne({
            ...req.body,
            createdAt = new Date().toISOString(),
            updatedAt = new Date().toISOString()
        });
        console.log('returns inserted')
    }
}

module.exports = { getReturns, insertReturns }