const { connect, connection } = require('mongoose');




module.exports = (app) => {
  // config(); //invoking the dotenv config here
  // const uri = process.env.DB_URI;
  const {host, user, pass} = require('./mongoDBConfig')[process.env.NODE_ENV || 'development']
  connect(host, {
    //  dbName: process.env.DB_NAME,
    user,//: process.env.DB_USER,
    pass,//: process.env.DB_PASS,
    useNewUrlParser: true,
    authSource: 'admin'
    //  useUnifiedTopology: true,
    //  useFindAndModify: false,
    //  useCreateIndex: true
  })
  .then(() => {
      console.log('Connection estabislished with MongoDB');
  })
  .catch(error => console.error(error.message));

  connection.on('connected', () => {
    console.log('Mongoose connected to DB Cluster');
  })
  connection.on('error', (error) => {
      console.error(error.message);
  })
  connection.on('disconnected', () => {
      console.log('Mongoose Disconnected');
  })

  connection.once('open', function() {
    // we're connected!
    app.set('db', connection); //
    //req.app.get('db').usercollection.find()
  })
}



//  const mongoose = require('mongoose')

//  mongoose.connect('mongodb://localhost/gw2data', {useNewUrlParser: true})
//  const db = mongoose.connection
//  db.on('error', console.error.bind(console, 'connection error:'))
//  db.once('open', function() {
//    // we're connected!
//    app.set('db', db); //
//    //req.app.get('db').usercollection.find()
//  })
