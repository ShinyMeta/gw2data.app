
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
  .post('/summaryReport/new', (req, res, next) => {
    const newReport = req.body
    // newReport.user_id = req.user.id
    return DB.summaryReports.create(newReport, req.user.id)
    .then((id) => {
      res.status(200).send({id})
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Unable to create report successfully')
    }) 
  })
  .post('/summaryReport/edit', (req, res, next) => {
    const reportChanges = req.body
    // reportChanges.user_id = req.user.id
    return DB.summaryReports.update(reportChanges, req.user.id)
    .then((id) => {
      res.status(200).send({id})
    })
    .catch((err) => {
      console.error(err)
      res.status(500).send('Unable to update report successfully')
    }) 
  })


  .get('/summaryReport/list', (req, res) => {
    return DB.summaryReports.getAllReports(req.user.id)
      .then(reports => {
        res.status(200).send({reports})
      })
  })

  .get('/summaryReport/:reportId', (req, res) => {
    const reportId = req.params.reportId
    return DB.summaryReports.getByReportId(reportId, req.user.id)
      .then((record) => {
        res.status(200).send(record)
      })
      .catch((err) => {
        console.error(err)
        res.status(500).send('Unable to retrieve record successfully')
      }) 
    
  })
  // .get('myReports', (req, res) => {
  //   return DB.summaryReports.getAllReports(req.user.id)
  //     .then(reports => {
  //       res.status(200).send({reports})
  //     })
  // })