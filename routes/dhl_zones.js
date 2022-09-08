const express = require('express');
const router = express.Router();
const DhlZone = require('../models/dhlZoneModel');

router.post('/findone', async (req, res) => {
    try{
        const { origin_zip, destination_zip } = req.body;
        const zones = await DhlZone.find({origin_zip: {$in: origin_zip}, destination_zip: {$in: destination_zip}}).select({ origin_zip: 1, destination_zip: 1, zone_number: 1,}).lean();
        res.status(200).json(zones);
    }catch(e){
        res.status(500).json({message: e.message});
        console.error(e);
    }
})

module.exports = router;