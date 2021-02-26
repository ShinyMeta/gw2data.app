//knex file for the item and currency lookup tables database
const {IP} = require('C:/server_secrets/serverIP.json')
const {user, password} = require('C:/server_secrets/MySQL.json')

module.exports = {
  development: {
    client: 'mysql',
    connection: {
      host: IP,
      user,
      password,
      database: 'gw2data_dev'
    },
    // debug: true
  },

  production: {
    client: 'mysql',
    connection: {
      host: IP,
      user,
      password,
      database: 'gw2data'
    }
  }
}
