const MongoClient = require( 'mongodb' ).MongoClient;
const url = "mongodb+srv://egitimyildizi67:egitim.yildizi67@egitimyildizi.myiru.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

var _db;

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect( url,  { useNewUrlParser: true,useUnifiedTopology:true, useCreateIndex:true }, function( err, client ) {
      console.log('module export çalıştı')
      _db  = client.db('egitimyildizi');
      return callback(err);
    } );
  },
  getDb: function() {
    return _db;
  }
};


