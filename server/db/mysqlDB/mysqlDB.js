

const knex = require('knex')
const knex_config = require('./mysqlDBConfig')[process.env.NODE_ENV || 'development']


const DB = knex(knex_config)

DB.data_records = require('./accessObjects/data_records.js')(DB)


module.exports = DB




