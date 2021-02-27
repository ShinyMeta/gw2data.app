
global.path = require('path');
// const bodyParser = require('body-parser')
// const express = require('express')
const fs = require('fs')
// const helmet = require('helmet')
const http = require('http')
const https = require('https')
// const path = require('path')







module.exports = {
  development: (app) => {
    let httpServer = http.createServer(app)

    httpServer.listen(80, () => {
      console.log('http listening on port 80')
    })
  },

  production: (app) => {
    let httpServer = http.createServer(app)

    httpServer.listen(80, () => {
      console.log('http listening on port 80')
    })

    const privateKey = fs.readFileSync('C:/server_secrets/SSL/private.key')
    const certificate = fs.readFileSync('C:/server_secrets/SSL/certificate.crt')
    const credentials = {key: privateKey, cert: certificate}
    let httpsServer = https.createServer(credentials, app)

    httpsServer.listen(443, () => {
      console.log('https listening on port 443')
    })
  }
}