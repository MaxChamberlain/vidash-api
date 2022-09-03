const { getClient } = require('../utils/connectToMongoDirect');
const { verify } = require('../utils/generateToken');

const getPacks = async (req, res) => {
    const { company_code, startDate, endDate } = req.body;
    const client = getClient();
    const db = client.db();
    const collection = db.collection('packs-' + company_code);
    const data = await collection.find({
        created_at: {
            $gte: new Date(startDate).toISOString(),
            $lte: new Date(endDate).toISOString()
        }
    }).toArray();
    console.log(data)
    res.status(201).send(data);
}

const insertPacks = async (req, res) => {
    const { company_code, packs } = req.body;
    packs.forEach(e => {
        e.createdAt = new Date().toISOString();
        e.updatedAt = new Date().toISOString();
    })
    const client = getClient();
    const db = client.db();
    const collection = db.collection('packs-' + company_code);
    const data = await collection.insertMany(packs);
    res.status(201).send({message: 'Pack Jobs Inserted'});
}

module.exports = { getPacks, insertPacks }