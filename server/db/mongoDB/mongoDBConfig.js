//knex file for the item and currency lookup tables database
const {IP} = require('C:/server_secrets/serverIP.json')
const {user, pass} = require('C:/server_secrets/Mongo.json')

module.exports = {
  development: {
    // host: `mongodb://localhost/gw2data`,
    host: `mongodb://${IP}/gw2data_dev`,
    user,
    pass,
    // database: 'gw2data_dev'
  },

  production: {
    host: `mongodb://${IP}/gw2data_prod`,
    user,
    pass,
    // database: 'gw2data'
  },
}