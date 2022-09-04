const { getClient } = require('../utils/connectToMongoDirect');

const getPackages = async (req, res) => {
    const { company_code, startDate, endDate } = req.body;
    const client = getClient();
    const db = client.db();
    const collection = db.collection('packages-' + company_code);
    const data = await collection.find({
        created_date: {
            $gte: new Date(startDate).toISOString(),
            $lte: new Date(endDate).toISOString()
        }
    }).toArray();
    console.log(data)
    res.status(201).send(data);
}

const insertPackages = async (req, res) => {
    const { company_code, packages } = req;
    packages.createdAt = new Date().toISOString();
    packages.updatedAt = new Date().toISOString();
    const client = getClient();
    const db = client.db();
    const collection = db.collection('packages-' + company_code);
    const exists = await collection.findOne({ id: packages.id });
    if(!exists){
        const data = await collection.insertOne(packages);
        console.log('packages inserted')
    }
}

module.exports = { getPackages, insertPackages }