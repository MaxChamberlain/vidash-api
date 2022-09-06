const express = require('express');
const router = express.Router();
const DhlZone = require('../models/dhlZoneModel');

router.post('/findone', async (req, res) => {
    try{
        const { origin_zip, destination_zip } = req.body;
        const zones = await DhlZone.find({origin_zip: {$in: origin_zip}, destination_zip: {$in: destination_zip}});
        res.status(200).json(zones);
    }catch(e){
        res.status(500).json({message: e.message});
        console.error(e);
    }
})

module.exports = router;