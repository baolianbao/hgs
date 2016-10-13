'use strict';

var db = require('../models/db');

    // owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    // address: {type: String, required: true},
    // name: {type: String, required: true},
    // unit: {type: String},
    // floor: Number,
    // apartmentId: String,
    // coordinates: [Number],
    // area: Number,
    // ownershipType: {type:String, enum: ownershipTypes },
    // transport:{type:String},
    // environment:{type:String},
    // facilities:[String],
    // waterMeterId:{type: String},
    // electricMeterId:{type: String},
    // gasMeterId:{type: String},

    // trusteeshipRecords: [trusteeshipSchema], // Apartment trusteeship records.
    // bills: [billSchema],    // Apartment trusteeship bills
    // rooms: [roomSchema],    // Apartment rooms
    // assets: [assetSchema]   // Apartment assets

var newRoom1 = {
    name: 'A',
    area : 35,
    towardsType: 1,
    features: '阳台，飘窗，独立卫生间',
    status: 0
};

var newRoom2 = {
    name: 'B',
    area : 30,
    towardsType: 1,
    features: '飘窗',
    status: 1
};


var newRoom3 = {
    name: 'C',
    area : 25,
    towardsType: 1,
    status: 1
};

var newApartment = new db.Apartment({
    address: '河南省，郑州市，二七区，淮河路，兴华街',
    name: '27号家属院',
    unit: '5号楼',
    floor: '5',
    apartmentId: '东户',
    coordinates: [113.633082,34.729748],
    area: 95,
    // ownershipType: 
    transport: '203, 138',
    environment: '比较安静',
    facilities: ['集中供暖', '热水器', '无线网络'],
    waterMeterId: 'ZZ1234567',
    electricMeterId: 'HNZZ83483838383',
    gasMeterId: 'ZLO838383812099d',
    createdOn: Date.now(),

    rooms: [newRoom1, newRoom2, newRoom3]
});


    // name: {type: String, index:true, required: true },
    // area: Number,
    // towardsType: {type: Number, enum: towardsTypes},
    // features:{type: String}, // 阳台，飘窗
    // status:{type: Number, enum: roomStatus },

    // rentRecords: [rentRecordSchema],
    // bills:[billSchema]

db.User.findOne(
    { 'username': 'hexcola'},
    function(err, user){
        if(!err){
            if(!user){
                console.log('We not get a user.')
            } else {
                addNewApartment(user);
            }
        } else {
            console.log('Some issue...');
        }
    }
)


function addNewApartment(user){
    db.Apartment.remove({ name: '27号家属院'}, function(err){
        if(!err){
            console.log('27号家属院 was deleted');

            newApartment.createdBy = user;
            // newApartment.rooms = [newRoom1, newRoom2, newRoom3];

            newApartment.save(function(err, apartment){
                if(!err){
                    console.log('Saved apartment name: ' + apartment.name);
                    console.log(apartment);
                } else {
                    console.log(err);
                }
            });
        }
    });
}