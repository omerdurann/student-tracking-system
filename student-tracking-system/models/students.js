const mongoUtil = require("../database/mongoUtil");
var ObjectId = require('mongodb').ObjectID;


function GetUser(searchQuery) {
    const db = mongoUtil.getDb();

    return new Promise((resolve, reject) => {
        db.collection('kisi').aggregate([
            {
                $lookup: {
                    from: "kisiler",
                    localField: "_id",
                    foreignField: "adi",
                    as: "soyadi"
                }
            }
        ]).toArray(function (err, data) {
            if(err) {
               reject(err)
                return 
            }
            console.log(data)
            resolve(data)
        })
    })
}




exports.GetUser = GetUser