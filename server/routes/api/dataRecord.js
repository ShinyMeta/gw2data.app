
const express = require('express');
const router = express.Router();

const DB = require('../../db/mysqlDB')
// const client = require('gw2api-client')
// const gw2api = client()


module.exports = router;



router
  .use((req, res, next) => {
    if (!req.user) {res.status(401).send()}
    else { next() }
  })
//return list of apikeys for user
  .post('/new', (req, res, next) => {
    const newRecord = req.body
    newRecord.user_id = req.user.id
    return DB.dataRecords.create(newRecord)
    .then((id) => {
      res.status(200).send({id})
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Unable to create record successfully')
    }) 
  })
  .post('/edit', (req, res, next) => {
    const recordToEdit = req.body
    recordToEdit.user_id = req.user.id
    return DB.dataRecords.update(recordToEdit, req.user.id)
    .then((id) => {
      res.status(200).send({id})
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Unable to update record successfully')
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
  .get('/customTags', (req, res) => {
    return DB.dataRecords.getCustomTags(req.user.id)
      .then((tags) => {
        res.status(200).send({tags})
      })
      .catch(console.error)
  })
  .get('/myTags', (req, res) => {
    return DB.dataRecords.myTags(req.user.id)
      .then((tags) => {
        res.status(200).send({tags})
      })
      .catch(console.error)
  })
  .post('/tag', (req, res) => {
    const {recordId, name} = req.body
    const userId = req.user.id
    return DB.dataRecords.addTag(recordId, name, userId)
      .then((newTagId) => {
        res.status(200).send({newTagId})
      })
      .catch((err) => {
        console.error
      })
  })
  .delete('/tag', (req, res) => {
    console.log(req.body)
    return DB.dataRecords.deleteCustomTag(req.body.name, req.user.id)
      .then((tags) => {
        res.status(200).send({tags})
      })
      .catch((err) => {
        res.status(400).send(err.message)
        console.error(err)
      })
  })




  
  .get('/:record_id', (req, res) => {
    const record_id = req.params.record_id
    return DB.dataRecords.retrieveRecordByRecordId(record_id, req.user.id)
      .then((record) => {
        res.status(200).send(record)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Unable to retrieve record successfully')
      }) 
    
  })