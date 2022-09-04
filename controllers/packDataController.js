const { getClient } = require('../utils/connectToMongoDirect');
const { getPackage } = require('../utils/upsertPackageData');

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
    const { company_code, packs, order_id, refresh_token } = req;
    packs.createdAt = new Date().toISOString();
    packs.updatedAt = new Date().toISOString();
    const client = getClient();
    const db = client.db();
    const collection = db.collection('packs-' + company_code);
    const exists = await collection.findOne({ id: packs.id });
    if(!exists){
        const data = await collection.insertOne(packs);
        console.log('pack inserted')
        getPackage(order_id, refresh_token, company_code);
    }
}

module.exports = { getPacks, insertPacks }