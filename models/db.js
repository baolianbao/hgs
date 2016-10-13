'use strict';

/**
 * Module dependencies.
 */
var config = require('../config');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var creationInfo = require('./creationInfo');

//-------------------------------
// Database configure
//-------------------------------
console.log(config.DB_URI);
mongoose.connect(config.DB_URI);

/**
 * Database Events
 */
mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + config.DB_URI);
});

mongoose.connection.on('error',function (err) {
    console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function() {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});
//////////////////////////////////////////

var towardsTypes = [
    0, // 未设置
    1, // 东
    2, // 西
    3, // 南
    4, // 北
];

var roomStatus = [
    0, // 空置
    1  // 已经出租
]
var ownershipTypes = [0, 1, 3];
var idTypes = ['身份证', '军官证'];
var bankTypes = ['招商银行', '工商银行'];
var decorateTypes =[
    0, // 未设置
    1, // 毛坯
    2, // 简装修
    3  // 精装修
]

var payTypes = [
    0, // 未设置
    1, // 月付
    2, // 二月付
    3, // 季付款
    4, 
    5,
    6, // 半年付
    7,
    8,
    9,
    10,
    11,
    12  // 年付
]

/*********************************************
 *  Role Schema
 ********************************************/
var roleSchema = new mongoose.Schema({
    name: {type: String, unique:true}
});

roleSchema.statics.representation = function(){
  return 'Role: ' + this.name;
};

// Build the Role model
mongoose.model('Role', roleSchema);
exports.Role = mongoose.model('Role');


/*********************************************
 * User Schema
 ********************************************/
var userSchema = new mongoose.Schema({
    role_id:{type: mongoose.Schema.Types.ObjectId, ref: 'Role'},
    email: {type: String, unique: true, index: true },
    username: {type: String, unique: true, index: true },
    password_hash: {type: String },
    telephone: {type: String, unique: true},

    // ---------------
    realname: {type: String},
    idType:{ type:String, enum:idTypes }, // 证件类型
    idValue:{ type:String, unique:true }, // 证件号码
    idPicture: { type: Buffer}, // 证件照片
    job: { type: String },
    bankType: { type:String, enum: bankTypes },
    bankCard: { type:String },
    createdOn: { type: Date, default: Date.now },
    modifiedOn: Date,
    lastLogin: Date
});

userSchema.statics.passwordHash = function(password, callback){
    bcrypt.hash(password, config.PASSWORD_SALT_ROUNDS, function(err,hash){
        callback(err, hash);
    });
};

userSchema.statics.passwordCompare = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, res){
        callback(err, res);
    });
};

userSchema.statics.addUser = function(user, callback){

};

// Build the User model
mongoose.model( 'User', userSchema );
exports.User = mongoose.model('User');


/////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////


/***********************************************
            Bill Item Schema
 ***********************************************/
var billSchema = new mongoose.Schema({
    amount: {type: Number, required: true}, 
    billcycle: {type:String},
    remindDate: Date,
    status: {type:Number, default:0}, // 账单状态：0未付款，1已付款
    payer: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    payee: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
});
billSchema.plugin(creationInfo);

/* ********************************************
            ROOM SCHEMA
    ******************************************** */
var rentRecordSchema = new mongoose.Schema({
    tenant: {type: mongoose.Schema.Types.ObjectId, ref:'User', required: true},
    cotenant: [{type: mongoose.Schema.Types.ObjectId, ref:'User', required: true}], // 合租人是否要用数组？
    expectPayType: {type: Number, enum: payTypes},
    actualPayType: {type:Number, enum:  payTypes},
    expectDeposit: {type: Number},
    actualDeposit: {type:Number},
    expectRent: {type: Number},
    actualRent: {type: Number},
    payDate: Date,
    rentStart: Date,
    rentStop: Date,
    actualRentStart: Date,
    actualRentEnd: Date,
    remindPayDays: {type: Number, default: 7},
    defaultWaterCount: Number,
    defaultElectricCount:Number,
    defaultGasCount: Number,
    accessCardStatus: {type: Number, default: -1}, // 门禁卡发放状态： -1 表示未发放， 0 表示已经发放，但无押金，x表示已经发放，且押金为x
    keyStatus: {type: Number, default: -1}, // 钥匙发放状态： -1 表示未发放， 0表示已经发放
    rentStatus: {type: Number,default: 0} , // 出租状态： -1 表示退租 0 表示正常出租中， 1表示续租状态，2合同到期且未续租
    signature: {type:Buffer},
    stopRentReason: String, // 退租原因
    stopRentRebate: Number, // 退租返款
    note: String, // 备注
    infoSource: String // 租房信息来源
});
rentRecordSchema.plugin(creationInfo);

var roomSchema = new mongoose.Schema({
    name: {type: String, index:true, required: true },
    area: Number,
    towardsType: {type: Number, enum: towardsTypes},
    features:{type: String}, // 阳台，飘窗
    status:{type: Number, enum: roomStatus },

    rentRecords: [rentRecordSchema],
    bills:[billSchema]
});

/* ********************************************
        TRUSTEESHIP SCHEMA
    ******************************************** */
var trusteeshipSchema = new mongoose.Schema({
    decorateType: {type: Number, enum: decorateTypes},  // 初始装修类型
    expectPayType: {type: Number, enum: payTypes},
    actualPayType: {type:Number, enum:  payTypes},
    expectDeposit: {type: Number},
    actualDeposit: {type:Number},
    expectRent: {type: Number},
    actualRent: {type: Number},
    rentIncrementRate: {type: Number}, // 租金递增方式
    payDate: Date,
    priceOfWater: Number,
    priceOfElectric: Number,
    priceOfGas: Number,
    defaultWaterCount: Number,
    defaultElectricCount: Number,
    defaultGasCount: Number,
    rentFreePeriod: Number,
    decoratePeriod: Number,
    expectHostStart: Date,
    expectHostEnd: Date,
    actualHostStart: Date,
    actualHostEnd: Date,
    stopHostReason: String,
    stopHostRebate: Number,
    note: String,
    agent: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    // createBy 就是管家
});
trusteeshipSchema.plugin(creationInfo);

/* ********************************************
        APARTMENTASSET SCHEMA
    ******************************************** */
var assetSchema = new mongoose.Schema({
    room: {type: mongoose.Schema.Types.ObjectId, ref:'Room'},
    name: {type: String, required: true},
    price: {type:Number, required: true},
    amount: {type:Number, required: true, default: 1},
});
assetSchema.plugin(creationInfo);

/* ********************************************
        APARTMENT SCHEMA
    ******************************************** */
var apartmentSchema = new mongoose.Schema({
    owner: {type: mongoose.Schema.Types.ObjectId, ref:'User'},
    address: {type: String, required: true},
    name: {type: String, required: true},
    unit: {type: String},
    floor: Number,
    apartmentId: String,
    coordinates: [Number],
    area: Number,
    ownershipType: {type:String, enum: ownershipTypes },
    transport:{type:String},
    environment:{type:String},
    facilities:[String],
    waterMeterId:{type: String},
    electricMeterId:{type: String},
    gasMeterId:{type: String},

    trusteeshipRecords: [trusteeshipSchema], // Apartment trusteeship records.
    bills: [billSchema],    // Apartment trusteeship bills
    rooms: [roomSchema],    // Apartment rooms
    assets: [assetSchema]   // Apartment assets
});
apartmentSchema.plugin(creationInfo);
// Build the Apartment model
mongoose.model('Apartment', apartmentSchema);
exports.Apartment = mongoose.model('Apartment');

/* ********************************************
        ARTICLE SCHEMA
    ******************************************** */
var commentSchema = new mongoose.Schema({
    content: {type:String, required: true},
    isPost:{type:Boolean}
});
commentSchema.plugin(creationInfo);

var articleSchema = new mongoose.Schema({
    title:{type:String, unique:true, required:true, default:'Hello, New Post'},
    content:{type:String, required: true},
    isPost:{type:Boolean},
    // TO-DO 
    // category
    // tags
    comments: [commentSchema]
});

articleSchema.plugin(creationInfo);
// Build Article Model
mongoose.model('Article', articleSchema);
exports.Article = mongoose.model('Article');