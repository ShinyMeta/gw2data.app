
// const { response } = require('express');
const express = require('express');
const router = express.Router();

const DB = require('../../db/mysqlDB')
const client = require('gw2api-client')
const gw2api = client()


module.exports = router;



router
//return list of apikeys for user
  .get('/apikeys', (req, res, next) => {
    if (req.user) {
      return DB('apikeys')
        .where('user_id', req.user.id)
        .then((results) => {
          res.send(results)
        })
        .catch(next)
    }
    else res.status(401).send('You are not logged in')
  })
  //add new apikey 
  .post('/apikey', (req, res, next) => {
    // console.log(req.user)
    if (req.user) {
      const apikey = {
        apikey: req.body.apikey,
        user_id: req.user.id
      }
      //check if apikey already added
      return DB('apikeys')
        .where(apikey)
        .then((results) => {
          if (results.length > 0) {
            return res.status(400).send('This API key is already registered on account')
          }
          else {
            //safe to add
            return gw2api.authenticate(req.body.apikey).account().get()
              .then((accountInfo) => {
                apikey.account_name = accountInfo.name
                return DB('apikeys')
                  .insert(apikey)
                  .then(() => {
                    // console.log(results)
                    res.send(apikey)
                  })
                  .catch(next)
              })
              .catch((err) => {
                res.status(400).send('invalid apikey')
              })
          }
        })
      
    }
    else {
      res.status(401).send('You are not logged in')
    }
  })
  //delete
  .delete('/apikey', (req, res, next) => {
    if (req.user) {
      // console.log(req.body)
      return DB('apikeys')
      .where({user_id: req.user.id, apikey: req.body.apikey})
        .del()
        .then((results) => {
          console.log(results)
          res.send(results?'Deleted API key successfully':'No matching API key found; zero records deleted')
        })
        .catch(next)
    }
    else res.status(401).send('You are not logged in')
  })



