const express = require('express');
const session = require('express-session')
const exphbs = require('express-handlebars');
const routers = require("./routers/index");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const {requireAuth}=require('./middlewares/authmiddlewares')

const mongoUtil = require("./database/mongoUtil");

const mongoose = require('mongoose');
const { ObjectId } = require('mongodb');


const url = "mongodb+srv://egitimyildizi67:egitim.yildizi67@egitimyildizi.myiru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

mongoose.connect(url,{useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true})
    .then((result)=> app.listen(3000))
    .catch((err)=>console.log(err))



mongoUtil.connectToServer( function( err, client ) {
  if (err) return console.log(err);
  console.log("Veri tabanına bağlandı!")
} );







const app = express();



app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(express.static("./public"))
app.use(cookieParser())
app.engine('.hbs', exphbs({
    extname: '.hbs'
}))


app.set('view engine', '.hbs')

//app.use("/", routers.auth)
//,requireAuth
app.use("/",routers.app)
app.use("/api", routers.api)






