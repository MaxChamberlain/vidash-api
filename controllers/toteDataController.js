const { getClient } = require('../utils/connectToMongoDirect');

const getTotes = async (req, res) => {
    const { company_code, startDate, endDate } = req.body;
    const client = getClient();
    const db = client.db();
    const collection = db.collection('totes-' + company_code);
    const data = await collection.find({
        created_at: {
            $gte: new Date(startDate).toISOString(),
            $lte: new Date(endDate).toISOString()
        }
    }).toArray();
    res.status(201).send(data);
    res.status(201).send({ message: 'Success!' });
}

const insertTotes = async (req, res) => {
    const { totes } = req;
    const company_code = req.params.id;
    totes.createdAt = new Date().toISOString();
    totes.updatedAt = new Date().toISOString();
    const client = getClient();
    const db = client.db();
    const collection = db.collection('totes-' + company_code);
    const exists = await collection.findOne({ id: totes.id });
    if(!exists){
        const data = await collection.insertOne(totes);
        console.log('totes inserted')
    }
    res.status(201).send({ message: 'Success!' });
}

module.exports = { getTotes, insertTotes }