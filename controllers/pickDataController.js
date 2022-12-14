const { getClient } = require('../utils/connectToMongoDirect');
const { verify } = require('../utils/generateToken');

const getPicks = async (req, res) => {
    const { company_code, startDate, endDate } = req.body;
    const client = getClient();
    const db = client.db();
    const collection = db.collection('picks-' + company_code);
    const data = await collection.find({
        created_at: {
            $gte: new Date(startDate).toISOString(),
            $lte: new Date(endDate).toISOString()
        }
    }).toArray();
    res.status(201).send(data);
}

const getPicksLocal = async (req, res) => {
    const { company_code, startDate, endDate } = req;
    const client = getClient();
    const db = client.db();
    const collection = db.collection('picks-' + company_code);
    const data = await collection.find({
        created_at: {
            $gte: new Date(startDate).toISOString(),
            $lte: new Date(endDate).toISOString()
        }
    }).toArray();
    return data;
}

const insertPicks = async (req, res) => {
    const { company_code, picks } = req;
    picks.createdAt = new Date().toISOString();
    picks.updatedAt = new Date().toISOString();
    const client = getClient();
    const db = client.db();
    const collection = db.collection('picks-' + company_code);
    const exists = await collection.findOne({ id: picks.id });
    if(!exists){
        const data = await collection.insertOne(picks);
        console.log('pick inserted')
    }
}

module.exports = { getPicks, getPicksLocal, insertPicks }