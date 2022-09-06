const mongoose = require('mongoose');

const dhlZoneSchema = mongoose.Schema(
    {
        origin_zip: {
            type: String,
            required: true,
        },
        destination_zip: {
            type: String,
            required: true,
        },
        zone_number: {
            type: Number,
            required: true,
        },
        origin_facility: {
            type: String,
            required: true,
        },
    },
    {
        timeStamps: true,
    }
)

const DhlZone = mongoose.model('DhlZone', dhlZoneSchema, 'dhl_zone_map');

module.exports = DhlZone;