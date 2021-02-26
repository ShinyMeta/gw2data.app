'use strict';

const express = require('express');
const router = express.Router();


const AccountState = require('../../models/AccountState.js')


module.exports = router;


router.get('/:apikey', (req, res, next) => {
  const accountState = {}
  accountState.apikey = req.params.apikey
  accountState.user_id = req.user.id
  accountState.id = `${accountState.user_id}_${accountState.apikey}`

  // let db = req.app.get('db')
  AccountState.find({id: accountState.id})
    .then((accountState) => {
      // console.log(accountState)
      if (accountState.length > 0) {
        res.send(accountState[0])
      }
      else {
        res.status(404).send("no saved state for this apikey")
      }
    }, console.error)
})

router.post('/:apikey', (req, res, next) => {
  const accountState = req.body
  accountState.apikey = req.params.apikey
  accountState.user_id = req.user.id
  accountState.id = `${accountState.user_id}_${accountState.apikey}`

  // let db = req.app.get('db')
  AccountState.updateOne(
    {id: accountState.id},
    accountState,
    {
        upsert: true
    }
  ).then(console.log, console.error)
  res.sendStatus(200)
})