
const express = require('express');
const router = express.Router();
// const session = require('express-session')
const passport = require('passport')
require('../../db/passport.js')
// const RedisStore = require('connect-redis')(session)
const DB = require('../../db/mysqlDB')

const jwt = require('jwt-simple')
const emailService = require('../../serverUtilities/emailService')



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

  .post('/forgotPassword', (req, res, next) => {
    const username = req.body.username
    return DB('users')
      .where('username', username)
      .first()
      .then((user) => {
        const secret = "secretgw2data.app" + user.passhash + user.password_last_changed
        const payload = {userId: user.id}
        const token = jwt.encode(payload, secret)
        const url = `https://gw2data.app/passwordReset/${user.id}/${token}`
        return emailService.sendPasswordReset(user.email, url)
        .then((result) => {
          res.sendStatus(200)
          console.log(token)
        })
      })
      .catch((err) => {
        res.sendStatus(200)
      })

  })

  .post('/changePassword', (req, res, next) => {
    const {userId, token, newPassword} = req.body
    return DB.users.getFirst({id: userId})
      .then((user) => {
        const secret = "secretgw2data.app" + user.passhash + user.password_last_changed
        try{
          decode = jwt.decode(token, secret)
        } catch(err) {
          res.status(400).send({message: "This reset link is not valid.  Please request a new reset link"})
          // console.error(err)
          return
        }
        if (decode && decode.userId === userId) {
          return DB.users.changePassword(userId, newPassword)
            .then((userId) => {
              res.status(200).send({userId})
            })
        }
      })
      .catch((err) => {
        
        console.error(err)
      })
  })


