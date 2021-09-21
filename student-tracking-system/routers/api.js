const express = require("express");
const students = require("../models/students");
const mongoUtil = require("../database/mongoUtil");
const bodyParser = require("body-parser");
const e = require("express");
const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://huseyin:1234@egitimyildizi.avgnp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

exports.api = express.Router();

exports.api.get('/login', (req, res) => {
    students.GetUser().then(result=>{
        res.json(result)
    }).catch(err=>{
        console.log(err)
        res.json(err)
    })
})

//mongodb ye ekleme yapma
exports.api.get('/add',(req,res)=>{
  MongoClient.connect(url,(err, client) => {
  if (err) throw err;
  const db = client.db('kisi');
  let veri = { adi: 'hüseyin', soyadi: 'bitikçi' };
  db.collection('kisiler').insertOne(veri, (err, result) => {
    if (err) throw err;
    console.log('Başarılı bir şekilde eklendi.');
    client.close();
  });
});  
});


exports.api.get('/all',(req,res)=>{
  
})
