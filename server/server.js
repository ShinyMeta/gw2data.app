
//ExpressServer_dev is the source, and gets babel-node built into ExpressServer for production


global.path = require('path');
const bodyParser = require('body-parser')
const express = require('express')
// const fs = require('fs')
// const helmet = require('helmet')
const http = require('http')
// const https = require('https')
// const path = require('path')





//app is for controlling the server
let app = express()
let httpServer = http.createServer(app)

// const privateKey = fs.readFileSync('C:/SSL/private.key')
// const certificate = fs.readFileSync('C:/SSL/certificate.crt')
// const credentials = {key: privateKey, cert: certificate}
// let httpsServer = https.createServer(credentials, app)





///////////////////////////////////////////////
//  PLACE TO RUN SCRIPT ON SERVER START
///////////////////////////////////////////////
require('./db/mongoDB/index.js')(app)
// const mongoose = require('mongoose')

// mongoose.connect('mongodb://localhost/gw2data', {useNewUrlParser: true})
// // .then(console.log)
// .catch(console.error)
// const db = mongoose.connection
// db.on('error', console.error.bind(console, 'connection error:'))
// db.once('open', function() {
//   // we're connected!
//   app.set('db', db); //
//   //req.app.get('db').usercollection.find()
// })



//////////////////////////////////////////////
//////////////////////////////////////////////
//////////////////////////////////////////////










//http requests with content type application/json will be parsed
//req.body will be changed to a json object
app.use(bodyParser.json({limit: '50mb'}))
  .use(bodyParser.urlencoded({limit: '50mb', extended: true}))
  .use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.sendStatus(200);
    }
    else {
      next();
    }
})

// tells the browser to use https if they are on http
  // .use(helmet())





//Easy routing for requesting html and images, etc.
app.use(express.static('../client/dist'))


//if request reaches this, then physical file doesn't exist
// app.get('/gw2data/*', (req, res, next) => {
//   res.sendFile(path.resolve(__dirname,'./website_public/gw2data/index.html'))
// })


app.use('/api', require('./server_routes/api.js'))













///////////////////////////////////
//    ERROR RESPONSES
///////////////////////////////////

  .use (function routeNotFound(req, res, next){
  let message = `Not Found:\nRequest from: ${req.ip}\nhttp info:\n`+
      `method: ${req.method}\nhost: ${req.hostname}\npath: ${req.path}\n`

  if (req.params) message += `params: ${JSON.stringify(req.params)}\n`
  if (req.query) message += `query: ${JSON.stringify(req.query)}\n`
  var err = new Error(message)

  err.status = 404;
  next(err)
})

  .use (function errorHandler(err, req, res, next){
  console.error (err);

  res.status(err.status || 500).send('Something went wrong!')
})



//
// function errorHandler(err, req, res, next){
//   console.error (err);
//   res.status(err.status || 500).send('Something went wrong!')
// }



//this starts the server
httpServer.listen(80, () => {
  console.log('http listening on port 80')
})

// httpsServer.listen(443, () => {
//   console.log('https listening on port 443')
// })
