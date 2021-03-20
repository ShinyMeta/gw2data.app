
const bcrypt = require('bcrypt-nodejs')


module.exports = (DB) => {
  //returns an object that has access function
  return {
    getFirst(whereConditions) {
      return DB('users')
        .where(whereConditions)
        .first() 
    },


    changePassword(userId, newPassword) {

      return DB('users')
        .where({id: userId})
        .update({
          passhash: bcrypt.hashSync(newPassword),
          password_last_changed: new Date(Date.now())
        })
        .then((id) => {
          return id
        })
        .catch((err) => {
          console.error(err)
        }) 
    },
    

    changeEmail(userId, newEmail) {

      return DB('users')
        .where({id: userId})
        .update({
          email: newEmail,
          email_last_changed: new Date(Date.now())
        })
        .then((id) => {
          return id
        })
        .catch((err) => {
          console.error(err)
        }) 
    },
   








  }
}