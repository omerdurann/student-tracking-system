const express = require("express");
exports.app = express.Router();
var ObjectId = require('mongodb').ObjectID;
const MongoClient = require( 'mongodb' ).MongoClient;
const upload=require('./uploadmiddleware')
const fs = require('fs');
const url = "mongodb+srv://egitimyildizi67:egitim.yildizi67@egitimyildizi.myiru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
MongoClient.connect(url, (err, client) => {
    const db = client.db('egitimyildizi');
exports.app.get('/', (req, res) => {
    res.redirect("/index");
})  

exports.app.post('/dersgun',(req,res)=>{
    var veri={}
    for (const property in req.body) {
        if (req.body[property]!='') {
            veri.ders=req.body[property]
        }
    }
    console.log(veri)
        db.collection('dersadi').updateMany({_id:ObjectId(req.query.id)},{$set:veri})
        res.redirect('/content');
})

exports.app.post('/konugun',(req,res)=>{
    var veri={}
    for (const property in req.body) {
        if (req.body[property]!='') {
            veri.konuadi=req.body[property]
        }
    }
    console.log(veri)
        db.collection('konular').updateMany({_id:ObjectId(req.query.id)},{$set:veri})
        res.redirect('/content');
})

exports.app.post('/altkonugun',(req,res)=>{
    var veri={}
    for (const property in req.body) {
        if (req.body[property]!='') {
            veri.alt_konu=req.body[property]
        }
    }
    console.log(veri)
    db.collection('alt_baslik').find({_id:ObjectId(req.query.id)}).toArray((err,result)=>{
        console.log(result)
        veri.alt_konu=result[0].konu+' - '+veri.alt_konu
        console.log(veri)
        db.collection('alt_baslik').updateMany({_id:ObjectId(req.query.id)},{$set:veri})
        res.redirect('/content');
    })
})

exports.app.post('/snfgun',(req,res)=>{
    var veri={}
    for (const property in req.body) {
        if (req.body[property]!='') {
            veri.sınıf=req.body[property]
        }
    }
    console.log(veri)
    db.collection('siniflar').updateMany({_id:ObjectId(req.query.id)},{$set:veri})
    res.redirect('/content')
})

exports.app.post('/derssec',(req,res)=>{
    var ders=req.body.ders
    db.collection('dersadi').find({_id:ObjectId(ders)}).toArray((err,result)=>{
        console.log(result[0].ders)
        console.log(result)
        db.collection('konular').find({ders:result[0].ders}).toArray((err,result2)=>{
            console.log(result2)
            db.collection('dersadi').find({}).toArray((err,result3)=>{

                res.render("ekle",{layout: false,
                    allders:result3,
                    allkonu:result2   
                })
            })
        })
        
        
    })
})

exports.app.get('/deletesnf',(req,res)=>{
    console.log(req.query.id)
    db.collection('siniflar').deleteOne({_id:ObjectId(req.query.id)},()=>{})
    res.redirect('/content')
})

exports.app.get('/deleteders',(req,res)=>{
    console.log(req.query.id)
    db.collection('dersadi').deleteOne({_id:ObjectId(req.query.id)},()=>{})
    res.redirect('/content')
})

exports.app.get('/deletekonu',(req,res)=>{
    console.log(req.query.id)
    db.collection('konular').deleteOne({_id:ObjectId(req.query.id)},()=>{})
    res.redirect('/content')
})

exports.app.get('/deletealt_konu',(req,res)=>{
    console.log(req.query.id)
    db.collection('alt_baslik').deleteOne({_id:ObjectId(req.query.id)},()=>{})
    res.redirect('/content')
})

exports.app.get('/content',(req,res)=>{
    db.collection('siniflar').find({}).toArray((err,result)=>{
        db.collection('dersadi').find({}).toArray((err,result1)=>{
            db.collection('konular').find({}).toArray((err,result2)=>{
                db.collection('alt_baslik').find({}).toArray((err,result3)=>{
                    res.render('content',{layout:false,sınıf:result,ders:result1,konu:result2,alt_konu:result3})
                })
            })
        })
    })
})

exports.app.get('/raporla',(req,res)=>{
    console.log(req.query.id)
    var ögr_id=parseInt(req.query.id)
    db.collection('konular').find({}).toArray((err,result5)=>{
        var ders=[]
        let group = result5.reduce((r, a) => {
            r[a.ders] =[...r[a.ders] || [], a];
            return r;
        }, {});
        var konu=group
        var konuadı=Object.getOwnPropertyNames(konu)
        for (let i = 0; i < konuadı.length; i++) {
            var veri={ders:konuadı[i]}
            veri.içerik=konu[konuadı[i]]
            ders.push(veri)
            
        }
        console.log(ders[0])

    
    db.collection('dersadi').find({}).toArray((err,result4)=>{
   
       

        db.collection('ögrenciler').find({id:ögr_id}).toArray((err,result3)=>{
            

        res.render("report", {
            layout: false,
            lahmacun: 123123,
            ogrenci:result3,
            ders:result4,
            konu:ders,
            id:ögr_id

        })
        })
        
        
    })
    })
})

exports.app.post('/raporla',(req,res)=>{
    var veri={}
    var veri1={}
    var veri2={}
    var ögr_id=parseInt(req.query.id)
    var naiveReverse = function(string) {
        return string.split('/');
    }
    var startdate=naiveReverse(req.body.start)
    var enddate=naiveReverse(req.body.end)
    var bastar=startdate[1]+'/'+startdate[0]+'/'+startdate[2]
    var bittar=enddate[1]+'/'+enddate[0]+'/'+enddate[2]
    for (const property in req.body) {
        if (req.body[property]!='') {
            veri[property]=req.body[property]
        }
    }
    
    startdate= parseInt(startdate[2]+startdate[0]+startdate[1])
    enddate=parseInt(enddate[2]+enddate[0]+enddate[1])
    
    if (typeof veri.kit_ders=='object') {
        veri1.kit_ders={$in :veri.kit_ders}
    }else if (typeof veri.kit_ders=='string') {
        veri1.kit_ders={$in :[veri.kit_ders]}
    }else{
        veri1.kit=0
    }
    if (typeof veri.konu_adi=='object') {
        console.log('konu_adi')
        veri2.konu_adi={$in :veri.konu_adi}
    }else if (typeof veri.konu_adi=='string') {
        veri2.konu_adi={$in :[veri.konu_adi]}
    }else{
        veri2.kit=0
    }
    
    console.log(veri1)
    console.log(veri2)
    db.collection('dersadi').find({}).toArray((err,result4)=>{
        db.collection('raporlama').find({ögr_id:ögr_id,date:{$gt:startdate,$lt:enddate},$or:[veri1,veri2]}).toArray((err,result)=>{
            console.log(result)
            if (result) {
                var all=[]
                db.collection('ögrenciler').find({id:ögr_id}).toArray((err,result3)=>{
                    let group = result.reduce((r, a) => {
                        r[a.kit_ders] =[...r[a.kit_ders] || [], a];
                        return r;
                    }, {});
                    var grup=group
                    var ödevadi=Object.getOwnPropertyNames(grup)
                    for (let i = 0; i < ödevadi.length; i++) {
                        var veri={ders:ödevadi[i]}
                        veri.rapor=grup[ödevadi[i]]
                        all.push(veri)
                        
                    }
                    db.collection('konular').find({}).toArray((err,result5)=>{
                        var ders=[]
                        let group = result5.reduce((r, a) => {
                            r[a.ders] =[...r[a.ders] || [], a];
                            return r;
                        }, {});
                        var konu=group
                        var konuadı=Object.getOwnPropertyNames(konu)
                        for (let i = 0; i < konuadı.length; i++) {
                            var veri={ders:konuadı[i]}
                            veri.içerik=konu[konuadı[i]]
                            ders.push(veri)
                            
                        }
                        
                        res.render("report", {
                            layout: false,
                            lahmacun: 123123,
                            all:all,
                            ogrenci:result3,
                            ders:result4,
                            konu:ders,
                            bastar:bastar,
                            bittar:bittar,
                            id:ögr_id
                        })
                    })
                })
            }
        })
            
    })
})

exports.app.get('/task',(req,res)=>{
    var id=req.query.id.split(',')
    var kit_id=parseInt(id[0])
    var ögr_id=parseInt(id[1])
    var all=[]
    db.collection('ögrenciler').find({id:ögr_id}).toArray((err,result3)=>{
        
        db.collection('raporlama').find({ögr_id:ögr_id}).toArray((err,result4)=>{
       
        for (let i = 0; i < result4.length; i++) {
            console.log(result4[i].obj_id)
            all.push(result4[i].obj_id)
        }
        
        db.collection('alt_konular').find({kit_id:kit_id,_id:{$nin:all}}).toArray((err,result)=>{
            db.collection('kütüphane').find({kit_id:kit_id}).toArray((err,result2)=>{
                res.render("task",{layout:false,
                    all:result,
                    kit_adı:result2[0].kit_adı,
                    ögrenci:result3,
                    kit_id:result2[0].kit_id,
                    ögr_id:ögr_id
                })
            })
        })
    }) 
    })
})

exports.app.get('/edit-book',(req,res)=>{
    var kit_id=parseInt(req.query.id)
    var sınıf;
    var ders_adi
    db.collection('siniflar').find({}).toArray((err, result) => {  
        if (err) throw err;
        sınıf=result
        db.collection('dersadi').find({}).toArray((err, result2) => {  
            if (err) throw err;
            ders_adi=result2
            db.collection('kütüphane').find({kit_id:kit_id}).toArray((err,result3)=>{
                res.render("edit-book",{layout: false,allküt:result3,allsnf:sınıf,allders:ders_adi,id:kit_id})
            })
        })
    })
})

exports.app.get('/edit-students',async(req,res)=>{
    ögr_id=parseInt(req.query.id)
    var sınıf;
    await db.collection('siniflar').find({}).toArray((err, result) => {  
        if (err) throw err;
        sınıf=result
    })
    await db.collection('ögrenciler').find({id:ögr_id}).toArray((err,result)=>{
        
         res.render('edit-students',{layout:false ,ögr:result,allsnf:sınıf,id:ögr_id})
    })
})

exports.app.post('/bookgun',async(req,res)=>{  
    kit_id=parseInt(req.query.id)
    var veri={}
    console.log(req.body)
    for (const property in req.body) {
        if (req.body[property]!='') {
            veri[property]=req.body[property]
        }
      }
      if (veri.kit_snf) {
          var snf=veri.kit_snf
          console.log(snf)
          
          console.log(veri)
        db.collection('siniflar').find({_id:ObjectId(snf)}).toArray((err,result) => {
            if (err) throw err; 
            db.collection('kütüphane').updateMany({kit_id:kit_id},{$set:{kit_snf:result[0].sınıf}})
        })
        delete veri.kit_snf
    }
    
    if (veri.kit_ders) {
        var ders=veri.kit_ders
        console.log(ders)
        delete veri.kit_ders
        
        db.collection('dersadi').find({_id:ObjectId(ders)}).toArray((err,result)=>{
            db.collection('kütüphane').updateMany({kit_id:kit_id},{$set:{kit_ders:result[0].ders}})
        })
    }

    console.log(veri)
    if (veri.kit_adı || veri.kit_türü || veri.kit_basım || veri.kit_yayın) {
        
        db.collection('kütüphane').updateMany({kit_id:kit_id},{$set:veri})
    }
    res.redirect('/index')
})

exports.app.post('/search_book',(req,res)=>{
        var sorgu={};
    if (req.body.kit_adı!='') {
        sorgu.kit_adı=req.body.kit_adı        
    }
    if (req.body.allders !='') {
        sorgu.kit_ders=req.body.allders
    }
    if (req.body.allsınıf !='') {
        sorgu.kit_snf=req.body.allsınıf
    }
        
        var ders_adi
        var sınıf;
        let sorg = {};
        if ( req.body.allsınıf !='') {
            db.collection('siniflar').find({_id:ObjectId(req.body.allsınıf)}).toArray((err,result1)=>{
                sorgu.kit_snf=result1[0].sınıf
            })
        }
        if (req.body.allders !='') {
            db.collection('dersadi').find({_id:ObjectId(req.body.allders)}).toArray((err,result)=>{
                sorgu.kit_ders=result[0].ders
            })
        }

        db.collection('dersadi').find(sorg).toArray((err, result) => {  
            if (err) throw err;
            ders_adi=result
            
            db.collection('siniflar').find(sorg).toArray((err, result) => {  
                if (err) throw err;
                sınıf=result
                console.log(sınıf)
                console.log(ders_adi)
                db.collection('kütüphane').find(sorgu).toArray((err, result) => {
                    if (err) throw err;
                    kütüphane=result;
                    
                    res.render("courses",{layout: false, allkütüphane:result,allsınıf:sınıf,alldersadi:ders_adi})
                })
                
            })
            
        })

})

exports.app.get('/ekle',async(req,res)=>{
        let sorgu = {};
        var ders;
        var konu;
        await db.collection('dersadi').find(sorgu).toArray((err,result)=>{
            if(err)throw err;
            ders=result
        db.collection('konular').find({}).toArray((err,result)=>{
            konu=result
            console.log(konu)
            db.collection('siniflar').find(sorgu, {projection: { _id: 0 } }).toArray((err, result) => {  
                if (err) throw err;
                res.render("ekle",{layout: false,
                    all:result,
                    allders:ders,
                    allkonu:konu   
                })
            });
        })
        })
      
    
})

//Öğrencileri listele 
exports.app.get('/students',async(req,res)=>{
        let sorgu = {};
        var sınıf;
        await db.collection('siniflar').find(sorgu, {}).toArray((err, result) => {
            if (err) throw err;
            sınıf=result
            db.collection('ögrenciler').find(sorgu,{}).toArray((err, result) => {  
                if (err) throw err;
               
                res.render("students",{layout: false,
                    all:result,
                    allsınıf:sınıf
                })
                
            })
        });
})

//öğrencileri listeleme kısmı
exports.app.get('/add',async(req,res)=>{
        let sorgu = {};
        await db.collection('ögrenciler').find(sorgu, { projection: { _id: 0 } }).toArray((err, result) => {  
          if (err) throw err;
          console.log(result);
          res.render("students",{layout: false,
            all:result,
            
        })
        });
})

exports.app.get('/index',(req,res)=>{
    db.collection('kütüphane').find({}).toArray((err,result2)=>{
        
        db.collection('ögrenciler').find({}, { projection: { _id: 0 } }).toArray((err, result) => {
            res.render("index",{layout: false,lenögr:result.length,lenküt:result2.length})
        })
    })
})

exports.app.get('/bookanlz',async(req,res)=>{
        var id= parseInt(req.query.id)
        console.log(typeof id)
        let sorgu = {kit_id:id};
        console.log(sorgu)
        await db.collection('alt_konular').find({kit_id:id}).sort({sayfa:1}).collation({locale: "en_US", numericOrdering: true}).toArray((err,result2)=>{
            console.log(result2);
            db.collection('kütüphane').find(sorgu).toArray((err, result) => {  
                if (err) throw err;
                var b =result2+result[0].kit_türü
                console.log(b);
                res.render("bookanlz",{layout: false,all:result,all2:result2,türü:result[0].kit_türü})
            })
        });
})

exports.app.get('/ogrpro',async(req,res)=>{
        var id= parseInt(req.query.id)
        var arr=[]
        let sorgu = {id:id};
        var veri
        await db.collection('gün_ödv').find({id:id}).toArray((err,result)=>{
            veri=result
        })
        
        await db.collection('ögrenciler').find(sorgu).toArray((err, result) => {
          if (err) throw err;
          var arr1=[]
         db.collection('ögr_küt').find({ögr_id:id}).toArray((err,result2)=>{
             if (err) throw err;
             console.log(result2)
             for (let i = 0; i < result2.length; i++) {
                arr1.push(result2[i].kit_id)
            }
            db.collection('kütüphane').find({kit_id:{$in:arr1}}).toArray((err,result3)=>{
                console.log(result3)
                for (let j = 0; j < result3.length; j++) {
                    result3[j].date=result2[j].date
                    result3[j].id=id
                }
                res.render("ogrpro",{layout: false,all:result , id:id ,ögr_küt:result3,ödv:veri})
                console.log(result3)
            })
            console.log(arr)

            })
    })
})

exports.app.get('/ogrkitekle',async(req,res)=>{
    var d = new Date(),
    day =  d.getDate(),
    month = '/' + (d.getMonth()+1),
    year = '/'+d.getFullYear();
    var date=day+month+year
    var allid=req.query.id.split(',')
    var veri={kit_id:parseInt(allid[0]),ögr_id:parseInt(allid[1]),date:date}
        await db.collection('ögr_küt').insertOne(veri, (err, result) => {
           if (err) throw err;
           console.log('Başarılı bir şekilde eklendi.');
         });
        await db.collection('gün_ödv').find({id:parseInt(allid[1])}).toArray((err,result)=>{
            veri=result
        })
         var id=parseInt(allid[1])
         var arr=[]
         let sorgu = {id:id};       
        await db.collection('ögrenciler').find(sorgu).toArray((err, result) => {  
           if (err) throw err;
           console.log(result)
           db.collection('ögr_küt').find({ögr_id:id}).toArray((err,result2)=>{
             if (err) throw err;
             console.log(result2)
             console.log(result);
             if (result2 == "") {
                 res.render("ogrpro",{layout: false,all:result , id:id ,ögr_küt:arr,ödv:veri})
             }
             else{
             for (let i = 0; i < result2.length; i++) {
                 db.collection('kütüphane').find({kit_id:result2[i].kit_id}).toArray((err,result3)=>{
                     if (err) throw err;
                     result3[0].date=result2[i].date
                     result3[0].id=id
                    arr.push(result3[0])

                 })
                 }
             }
             })
     })
     res.redirect('/ogrpro?id='+id)
})

exports.app.get('/kitapekle',(req,res)=>{
        const id= parseInt(req.query.id)
        var kütüphane , ders_adi, sınıf
        console.log(typeof id)
        let sorgu = {id:id};
        console.log(sorgu)      
        db.collection('ögrenciler').find(sorgu).toArray((err, result1) => {  
          if (err) throw err;
          let sorgu = {};
          
          db.collection('ögr_küt').find({ögr_id:id}).toArray((err, result)=>{
              if (result=='') {
                  db.collection('kütüphane').find({}).toArray((err, result)=>{
                      kütüphane=result
                      for (let i = 0; i < kütüphane.length; i++) {
                          kütüphane[i].id=id                     
                      }
                      console.log(kütüphane)
                  })
              }else{
            db.collection('kütüphane').find({}, { projection: { _id: 0 } }).toArray((err, result2) => {  
              if (err) throw err;
                  kütüphane=result2;
                  var id=parseInt(req.query.id) 
                  for (let i = 0; i < result.length; i++) {
                  for (let j = 0; j < kütüphane.length; j++) {
                        if (result[i].kit_id == kütüphane[j].kit_id) {
                            kütüphane.splice(j,1)
                        }
                        if (kütüphane =='') {
                            break
                        }
                    }
                }
                for (let x = 0; x < kütüphane.length; x++) {
                    kütüphane[x].id=id                    
                }
                console.log(kütüphane)
              }) }
              db.collection('dersadi').find(sorgu, { projection: { _id: 0 } }).toArray((err, result) => {  
                if (err) throw err;
                ders_adi=result
                db.collection('siniflar').find(sorgu, { projection: { _id: 0 } }).toArray((err, result) => {  
                    if (err) throw err;
                    sınıf=result
                    
                    res.render("kitapekle",{layout: false,adi:result1[0].adı,soyadi:result1[0].soyisim ,allkütüphane:kütüphane,allsınıf:sınıf,alldersadi:ders_adi, ögr_id:id})
                })

          })
              
        })
})
})

exports.app.get('/icerikekle',(req,res)=>{
        var id= parseInt(req.query.id)
        let sorgu = {kit_id:id};
        console.log(sorgu)
        db.collection('kütüphane').find(sorgu).toArray((err, result) => {  
          if (err) throw err;
          db.collection('konular').find({ders:result[0].kit_ders}).toArray((err,result2)=>{
            var all2=result2
            console.log(all2)
          db.collection('alt_baslik').find({}).toArray((err,result3)=>{
              console.log(result3)
          res.render("icerikekle",{layout: false,all:result,all2:all2 ,id:id,allalt:result3})
              
        })
        })
        })
})
//kütüphane listeleme
exports.app.get('/courses',(req,res)=>{
    var sınıf;
    var kütüphane;
    var ders_adi;
    let sorgu = {};
        db.collection('kütüphane').find(sorgu, { projection: { _id: 0 } }).sort({kit_id:1}).toArray((err, result) => {  
            if (err) throw err;
            kütüphane=result;
        })
        db.collection('alt_konular').aggregate([
            { $group: { _id:'$kit_id', testsoru : { $sum:{$toInt:'$soru_sayisi'} },testsay:{$sum:1}}},{$sort:{_id:1}}
         ]).toArray((err,result2)=>{
            db.collection('alt_konular').aggregate([
                { "$group": {
                    "_id": { "sid": "$kit_id", "geo": "$konu_adi" }
                }},
                { "$group": {
                    "_id": "$_id.sid",
                    "konu_say": { "$sum": 1 }
                }},{$sort:{_id:1}}
            ]).toArray((err,result)=>{
                for (let i = 0; i < result2.length; i++) {
                    kütüphane[i].soru_say=result2[i].testsoru
                    kütüphane[i].test_say=result2[i].testsay
                    kütüphane[i].konu_say=result[i].konu_say
                }
                db.collection('dersadi').find(sorgu).toArray((err, result) => {  
                    if (err) throw err;
                    ders_adi=result
                   
                    db.collection('siniflar').find(sorgu).toArray((err, result) => {  
                        if (err) throw err;
                        sınıf=result
                        
                        res.render("courses",{layout: false, allsınıf:sınıf, alldersadi:ders_adi, allkütüphane:kütüphane})
                    })
                    
                })
            })
        })
        
})

exports.app.get('/login', (req, res) => {
    res.render("pide", {
        layout: false,
        lahmacun: function(){
            return 2 + 2
        }
    })
})

//delete işlemleri----------------------------------------
exports.app.get('/alt_delete',(req,res)=>{
    db.collection('alt_konular').deleteOne({_id:ObjectId(req.query.id)},()=>{
    })
    res.redirect('/courses')
})

exports.app.get('/kit_delete',(req,res)=>{
    var add= req.query.id.split(',')
    db.collection('ögr_küt').deleteOne({kit_id:parseInt(add[0]),ögr_id:parseInt(add[1])},()=>{})
    let sorgu = {};
        var sınıf;
        db.collection('siniflar').find(sorgu, { projection: { _id: 0 } }).toArray((err, result) => {  
            if (err) throw err;
            console.log(result.length)
            sınıf=result
        })
        db.collection('ögrenciler').find(sorgu, { projection: { _id: 0 } }).toArray((err, result) => {  
          if (err) throw err;
          console.log(result);
         
        });
    res.redirect('/ogrpro?id='+add[1])
})
//ögrenci silme kısmı
exports.app.get('/delete', (req, res)=> {
        var id= parseInt(req.query.id)
        db.collection('ögrenciler').deleteOne({id:id},()=>{})
        db.collection('ögr_küt').deleteMany({ögr_id:id},()=>{})
        res.redirect('/students')
});
/////post işlemleri---------------------------------------
exports.app.post('/task_add',(req,res)=>{
    var naiveReverse = function(string) {
        return string.split('-').reverse().join('-');
    }
    console.log(req.query)
    var id=req.query.id.split(',')
    var ögr_id=parseInt(id[0])
    var kit_id=parseInt(id[1])
    console.log(kit_id)
    db.collection('kütüphane').find({kit_id:kit_id}).toArray((err,result2)=>{
    var kit_adi=result2[0].kit_adı
    var kit_ders=result2[0].kit_ders
    var alt_konu=req.body.alt_konu
    var ödv=[]
    if (alt_konu) {
    db.collection('alt_konular').find({}).toArray((err,result)=>{
        for (let i = 0; i < result.length; i++) {
            if (alt_konu==result[i]._id) {
                result[i].kit_adi=result2[0].kit_adı
                result[i].kit_ders=result2[0].kit_ders
                ödv.push(result[i])
            }
        }
        for (let j = 0; j <= alt_konu.length; j++) {
            for (let i = 0; i < result.length; i++) {
                if (alt_konu[j]==result[i]._id) {
                    result[i].kit_adi=result2[0].kit_adı
                    result[i].kit_ders=result2[0].kit_ders
                    ödv.push(result[i])
                }
            }
        }
        console.log(ödv)
        var konu_baslık=req.body.ödv_bas
        var acıklama=req.body.ödv_ack
        var bit_tar=naiveReverse(req.body.bit_tar)
        var veri={id:ögr_id,kit_id:kit_id,kit_adi:kit_adi,kit_ders:kit_ders,ödv:ödv,ödv_baslik:konu_baslık,ödv_açıklama:acıklama,ödv_bitş:bit_tar}
         db.collection('gün_ödv').insertOne(veri, (err, result) => {
             if (err) throw err;
            console.log('Başarılı bir şekilde eklendi.');
             });
        })
        }
        })
    var sınıf;
    res.redirect('/ogrpro?id='+ögr_id)

})
//kütüphaneye kitap ekleme
exports.app.post('/add_kitap', upload.single('myFile'), (req,res)=>{

    if (req.file) {
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString('base64');
        var buff = new Buffer(encode_image, 'base64');
    }
    console.log(req.body)
    let sorgu={}
    var kit_snf
    var kit_ders
    db.collection('siniflar').find({_id:ObjectId(req.body.sinif)}).toArray((err,result)=>{
        kit_snf=result[0].sınıf
    
    db.collection('dersadi').find({_id:ObjectId(req.body.ders)}).toArray((err,result)=>{
        kit_ders=result[0].ders
    
    db.collection('kütüphane').find(sorgu, { projection: { _id: 0 } }).toArray((err, result) => {  
        if (err) throw err;
        var id = (result.length)
        console.log(result.length)
        console.log('----------------')
        console.log(result[id-1].kit_id)
        id=result[id-1].kit_id+1
        console.log(id)
        if (req.file) {
            fs.writeFileSync("/root/projesonhali/public/uploads"+id+".jpg", buff);
        }
        var kit_adı=req.body.kitap_adi
        var kit_türü=req.body.kitap_türü
        var kit_basım=req.body.kitap_basım
        var kit_yayın=req.body.kitap_yayın
        var veri={kit_id:id, kit_adı:kit_adı,kit_snf:kit_snf,kit_ders:kit_ders,kit_türü:kit_türü,kit_basım:kit_basım,kit_yayın:kit_yayın}
        db.collection('kütüphane').insertOne(veri, (err, result) => {
           if (err) throw err;
           console.log('Başarılı bir şekilde eklendi.');
         });
        })
	})
})
    res.redirect('/index')
})
//kitap silme
exports.app.get('/book_delete',(req,res)=>{
    var kit_id=parseInt(req.query.id)
    db.collection('kütüphane').deleteOne({kit_id:kit_id},()=>{})
    db.collection('alt_konular').deleteMany({kit_id:kit_id},()=>{})
    res.redirect('/courses')
})
//sınıf ekleme
exports.app.post('/sinifekle',(req,res)=>{
    var sınıf=req.body.sınıf_add
    var veri={sınıf:sınıf}
        db.collection('siniflar').insertOne(veri, (err, result) => {
           if (err) throw err;
           console.log('Başarılı bir şekilde eklendi.');
         });
        
    res.redirect('/ekle')
})

exports.app.post('/altkonuadd',(req,res)=>{
    var konu=req.body.konu_adi
    db.collection('konular').find({_id:ObjectId(konu)}).toArray((err,result)=>{
        var alt_konu=result[0].konuadi+' - ' + req.body.alt_konu_adi
        var veri={konu:result[0].konuadi,alt_konu:alt_konu}
        console.log(veri)
        db.collection('alt_baslik').insertOne(veri, (err, result) => {
                if (err) throw err;
                console.log('Başarılı bir şekilde eklendi.');
              });
            
        })  
    res.redirect('/ekle')
})
//bir sınıfın dersine konu ekleme
exports.app.post('/konuadd',(req,res)=>{
    var ders=req.body.ders
    var konuadi=req.body.konu_adi
    db.collection('dersadi').find({_id:ObjectId(ders)}).toArray((err,result)=>{
        console.log(result[0].ders)
        var veri={ders:result[0].ders,konuadi:konuadi}
        db.collection('konular').insertOne(veri, (err, result) => {
            if (err) throw err;
            console.log('Başarılı bir şekilde eklendi.');
        });
        res.redirect('/ekle')
    })
});
//ders ekleme kısmı
exports.app.post('/ders_add',(req,res)=>{
    var ders=req.body.ders_add
    var veri={ders:ders}
        db.collection('dersadi').insertOne(veri, (err, result) => {
           if (err) throw err;
           console.log('Başarılı bir şekilde eklendi.');
         });
        res.redirect('/ekle')
})
exports.app.post('/viewtask', (req, res) => {
    var naiveReverse = function(string) {
        return string.split('-').reverse().join('-');
    }
    var ödv_bitis=naiveReverse(req.body.date)
    var id =parseInt(req.query.id)
    var ödevmat=[]
    var ödev=[]
    var all=[]
    db.collection('gün_ödv').find({id:id,ödv_bitş:ödv_bitis}).toArray((err,result)=>{
        let group = result.reduce((r, a) => {
            r[a.kit_ders] =[...r[a.kit_ders] || [], a];
            return r;
        }, {});
           ödevmat = group
           var ödevadi=Object.getOwnPropertyNames(ödevmat)
           for (let i = 0; i < ödevadi.length; i++) {
            var acıklama={}
            var veri={ders:ödevadi[i]}
            veri.ödev=ödevmat[ödevadi[i]]
            ödev.push(veri)
            console.log(veri.ödev)
            acıklama.açıklama=ödevmat[ödevadi[i]]
            console.log(acıklama)
            all.push(acıklama)
        }
       
        db.collection('ögrenciler').find({id:id}).toArray((err, result2) => {  
            var adı= result2[0].adı+" "+result2[0].soyisim
            res.render("taskview2", {
                layout: false,
                lahmacun: 123123,
                all:result,
                allmat:ödev,
                ögr_id:id,
                date:ödv_bitis,
                adı:adı,
                acıklama:all
            })
        })
    })
})  


//öğrenci ekleme
exports.app.post('/add', (req,res)=>{
    var d = new Date(),
    day =  d.getDate(),
    month = '/' + (d.getMonth()+1),
    year = '/'+d.getFullYear();
    var sorgu={};
    var id;
        db.collection('ögrenciler').find(sorgu, { projection: { _id: 0 } }).toArray((err, result) => {  
            if (err) throw err;
            id = (result.length+1+67000)
            for (let i = 0; i < result.length; i++) {
                if (id<=result[i].id) {
                    id++;
                }
            }
            db.collection('siniflar').find({_id:ObjectId(req.body.sınıf)}).toArray((err,result2)=>{
        var date=day+month+year
        var ad=req.body.ogrenciadı
        var soy=req.body.ogrencisoyadı
        var email=req.body.email
        var tel=req.body.telno
        var veliad=req.body.veliad
        var velitel=req.body.velitelno
        var okulu=req.body.okulu
        var sınıf=result2[0].sınıf
        var veri={id:id,adı:ad,soyisim:soy,email:email,telefon:tel,veliadı:veliad,velitel:velitel,okulu:okulu,sınıf:sınıf,date:date}
            db.collection('ögrenciler').insertOne(veri, (err, result) => {
                if (err) throw err;
                console.log('Başarılı bir şekilde eklendi.');
            });
        })
    });
    res.redirect('/students')
    
});



exports.app.post('/guncelle',(req,res)=>{
    var ögr_id=parseInt(req.query.id);
    var veri={}
    for (const property in req.body) {
        if (req.body[property]!='') {
            veri[property]=req.body[property]
        }
      }
    if (veri.sınıf) {
        db.collection('siniflar').find({_id:ObjectId(veri.sınıf)}).toArray((err, result) => {  
            if (err) throw err;
            veri.sınıf=result[0].sınıf
            db.collection('ögrenciler').updateMany({id:ögr_id},{$set:veri})
        })
    }else{
    db.collection('ögrenciler').updateMany({id:ögr_id},{$set:veri})
    }
    res.redirect('/students')
})

exports.app.post('/gun',(req,res)=>{
    var veri=Object.entries(req.body)
    var naiveReverse = function(string) {
        var b=string.split('-')
        return parseInt(b[2]+b[1]+b[0])
    }
    var id=req.query.id.split(',')
    var ögr_id=parseInt(id[0])
    var date=id[1]
    console.log(veri)
    for (let i = 0; i < veri.length; i++) {
        
        if (veri[i][1][0]!='') {
             db.collection('alt_konular').find({_id:ObjectId(veri[i][0])}).toArray((err,result)=>{
                
                result[0].obj_id=result[0]._id
                delete result[0]._id
                result[0].ögr_id=ögr_id
                result[0].dogru=veri[i][1][0]
                result[0].yanlıs=veri[i][1][1]
                result[0].bos=veri[i][1][2]
                result[0].date=date

                db.collection('kütüphane').find({kit_id:result[0].kit_id}).toArray((err,result2)=>{
                      
                    result[0].kit_ders=result2[0].kit_ders
                    result[0].kit_adı=result2[0].kit_adı
                    result[0].date=naiveReverse(result[0].date)
                    console.log(result[0])
                    db.collection('raporlama').insertMany(result, (err, result) => {
                                if (err) throw err;
                                console.log('Başarılı bir şekilde eklendi.');
                            });
                })
                db.collection('gün_ödv').deleteOne({'ödv._id':ObjectId(result[0].obj_id)},()=>{})
            })
        }
    }
    res.redirect('/ogrpro?id='+ögr_id)
}) 

exports.app.post('/altadd',(req,res)=>{
    db.collection('alt_konular').find({}, { projection: { _id: 0 } }).toArray((err, result) => { 
    var id=result.length+1
    var kit_id =parseInt(req.query.id)
    var konu_adı=req.body.konu_adi
    var alt_baslik=req.body.alt_konu_adi
    var sayfa=req.body.sayfa
    var test_adi=req.body.test_adi
    var soru_sayisi=req.body.soru_sayisi
    var veri={id:id,kit_id:kit_id,konu_adi:konu_adı,alt_baslik:alt_baslik,
        sayfa:sayfa,test_adi:test_adi,soru_sayisi:soru_sayisi}
       db.collection('alt_konular').insertOne(veri, (err, result) => {
          if (err) throw err;
          console.log('Başarılı bir şekilde eklendi.');
        });
    res.redirect('/bookanlz?id='+kit_id)    
    })
})

})