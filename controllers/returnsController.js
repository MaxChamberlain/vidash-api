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
    const exists = await collection.findOne({ id: req.body.id });
    if(!exists && !req.body.id.includes('undefined') && !req.body.id.includes('12345')) {
        await collection.insertOne({
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        });
        console.log('returns inserted')
        res.status(201).send('returns inserted');
    }else{
        res.status(201).send('returns already exists');
    }
}

module.exports = { getReturns, insertReturns }