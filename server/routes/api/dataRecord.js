
const express = require('express');
const router = express.Router();

const DB = require('../../db/mysqlDB')
// const client = require('gw2api-client')
// const gw2api = client()


module.exports = router;



router
//return list of apikeys for user
  .post('/new', (req, res, next) => {
    const newRecord = req.body
    return DB.dataRecords.create(newRecord)
    .then((id) => {
      res.status(200).send({id})
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Unable to create record successfully')
    }) 
  })
  .get('/list', (req, res) => {
    const user_id = req.user.id
    return DB.dataRecords.retrieveRecordsByUserId(user_id)
      .then((records) => {
        res.status(200).send(records)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Unable to retrieve records')
      }) 
    
  })
  .get('/:record_id', (req, res) => {
    const record_id = req.params.record_id
    return DB.dataRecords.retrieveRecordByRecordId(record_id)
      .then((record) => {
        res.status(200).send(record)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Unable to retrieve record successfully')
      }) 
    
  })