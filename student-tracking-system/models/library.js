const mongoUtil = require("../database/mongoUtil");

function GetLib(){
    const db = mongoUtil.getDb();
    return db.collection('ögrenciler').find({}).toArray()
}


exports.GetLib = GetLib

