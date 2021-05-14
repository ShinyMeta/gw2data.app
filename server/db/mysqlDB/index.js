

const knex = require('knex')
const knex_config = require('./mysqlDBConfig')[process.env.NODE_ENV || 'development']


const DB = knex(knex_config)

DB.dataRecords = require('./accessObjects/dataRecords.js')(DB)
DB.summaryReports = require('./accessObjects/summaryReports.js')(DB)
DB.users = require('./accessObjects/users.js')(DB)


module.exports = DB




