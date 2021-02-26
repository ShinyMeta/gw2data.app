
const express = require('express');
const router = express.Router();
// const session = require('express-session')
const passport = require('passport')
require('../../db/passport.js')
// const RedisStore = require('connect-redis')(session)



module.exports = router;




router

  
  .post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      // if error
      if (err) {
        console.error(err)
        return next(err)
      }
      //if user not found
      if (!user) {
        return res.status(401).send(info.message)
      }
      //if autehenticated, will return user:
      return req.login(user, function(err) {
        if (err) { return next(err); }
        return res.json(req.user)
      });
    })(req, res, next)
    
    // //if autehenticated, will return user:
    // res.json(req.user)
  })
  .post('/logout', (req, res, next) => {
    if (req.user){
      req.session.destroy((err) => {
        if (err) return next(err)
        res.sendStatus(200)
      })
    } else {
      res.sendStatus(200)
    }
  })
  .post('/signup', (req, res, next) => {
    passport.authenticate('local-register', (err, user, info) => {
      // if error during signup
      if (err) {
        console.error(err)
        return next(err)
      }
      //if user did not get created
      if (!user) {
        return res.status(401).send(info.message)
      }
      //if user registered, will return user:
      return req.login(user, function(err) {
        if (err) { return next(err); }
        return res.json(req.user)
      });
    })(req, res, next)
  })


  //used to check if user is logged in
  .get('/user', (req, res, next) => {
    if (req.user) res.json(req.user)
    else res.json(null)
  })



