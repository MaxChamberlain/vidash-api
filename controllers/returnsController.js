const { getClient } = require('../utils/connectToMongoDirect');

const getReturns = async (req, res) => {
    const client = getClient();
    const db = client.db();
    const collection = db.collection('loop-returns-' + req.params.id);
    const data = await collection.find({
        created_at: {
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
            updatedAt: new Date().toISOString(),
            closed: req.body.state === 'closed' ? new Date().toISOString() : false,
            started_transit: (req.body.label_status === 'new' || req.body.label_status === 'delivered') ? new Date().toISOString() : false,
            received: req.body.label_status === 'delivered' ? new Date().toISOString() : false,
        });
        console.log('returns inserted')
        res.status(201).send('returns inserted');
    }else{
        res.status(201).send('returns already exists');
    }
}

const updateReturns = async (req, res) => {
    const client = getClient();
    const db = client.db();
    const collection = db.collection('loop-returns-' + req.params.id);
    const exists = await collection.findOne({ id: req.body.id });
    if(exists) {
        await collection.updateOne({ id: req.body.id }, {
            $set: {
                ...req.body,
                updatedAt: new Date().toISOString(),
                closed: req.body.state === 'closed' ? new Date().toISOString() : false,
                started_transit: (req.body.label_status === 'new' || req.body.label_status === 'delivered') ? new Date().toISOString() : false,
                received: req.body.label_status === 'delivered' ? new Date().toISOString() : false,
            }
        });
        console.log('returns updated')
        res.status(201).send('returns updated');
    }else{
        res.status(201).send('returns does not exist');
    }
}

module.exports = { getReturns, insertReturns, updateReturns }