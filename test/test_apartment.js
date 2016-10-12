'use strict';

var db = require('../models/db');

/**
 * owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    address: {type: String, required: true},
    name: {type: String, required: true},
    unit: {type: String},
    floor: Number,
    apartmentId: String,
    coordinates: String,
    area: Number,
    ownershipType: {type:String, enum: ownershipTypes },
    transport:{type:String},
    environment:{type:String},
    facilities:{type: String},
    waterMeterId:{type: String},
    electricMeter:{type: String},
    gasMeter:{type: String},

    trusteeshipRecords: [trusteeshipSchema], // Apartment trusteeship records.
    bills: [billSchema],    // Apartment trusteeship bills
    rooms: [roomSchema],    // Apartment rooms
    assets: [assetSchema]   // Apartment assets
 */

var newApartment = new db.Apartment({
    address: '河南省，郑州市，二七区，淮河路，兴华街',
    name: '27号家属院',
    unit: '5号楼',
    floor: '5',
    ap
})
