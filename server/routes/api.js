'use strict';

const express = require('express');
const router = express.Router();
const session = require('express-session')
const passport = require('passport')
// require('../../db/passport.js')
// const RedisStore = require('connect-redis')(session)



module.exports = router;





router
  //session setup for maintained logins
  //this adds req.session to the incoming req object
  //anything that I add to the session object will be remembered until deleted
  .use(session({
    // store: new RedisStore(), //this will store those sessions in redis database
    secret: 'goldFarmSecretz',
    resave: false,
    saveUninitialized: false}))
  .use(passport.initialize()) //will look for user on req
  .use(passport.session()) //stores the serialized user to session (req.user)


  .use('/auth', require('./api/auth.js'))
  .use('/accountState', require('./api/accountState.js'))
  .use('/account', require('./api/account.js'))
  .use('/dataRecord', require('./api/dataRecord.js'))
  .use('/report', require('./api/report.js'))

