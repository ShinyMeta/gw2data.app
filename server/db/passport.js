const bcrypt = require('bcrypt-nodejs')

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const DB = require('./mysqlDB/mysqlDB.js')


//strategy gives you access to 'req.isAuthenticated()'
//passport automatically checks for "username" and "password"
//and runs authenticate function on them
passport.use(new LocalStrategy(authenticate))
passport.use('local-register',
    new LocalStrategy({passReqToCallback: true}, register))


//call done() with
// (system-error, false/user, {message: ''})
function authenticate(username, password, done) {
  //check that DB has same username-password pair
  return DB('users')
    .where('username', username)
    .first()
    .then((user) => {
      if (!user || !bcrypt.compareSync(password, user.passhash)) {
        console.log('here')
        return done(null, false, {message: 'Incorrect username/password combination'})
      }
      delete user.passhash
      return done(null, user)
    })
    .catch(done)
}

function register(req, username, password, done) {
  return DB('users')
    .where('username', username)
    // .orWhere('email', req.body.email)
    .first()
    .then((existingUser) => {
      if (existingUser && existingUser.username === username) {
        return done(null, false, {message: 'That username is already in use'})
      }
      // if (existingUser && existingUser.email === req.body.email) {
      //   return done(null, false, {message: 'That email is already in use'})
      // }

      //if form filled correctly, add to DB
      const new_user = {
        username,
        passhash: bcrypt.hashSync(password),
        email: req.body.email,
        // apikey: req.body.apikey
      }

      return DB('users')
        .insert(new_user)
        .then(([id]) => {
          new_user.id = id
          delete new_user.passhash
          req.user = new_user
          return done(null, new_user)
        })
        .catch(done)
    })
    .catch(done)
}




passport.serializeUser((user, done) => {
  // console.log(`serialized ${user.id}`)
  return done(null, user.id)
})

passport.deserializeUser((id, done) => {
  return DB('users')
    .where('id', id)
    .first()
    .then((user) => {
      delete user.passhash
      done(null, user)
      return null
    })
    .catch(done)

})
