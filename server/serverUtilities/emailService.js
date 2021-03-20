
const nodemailer = require('nodemailer')

const SMTP_CONFIG = require('C:/server_secrets/SMTPconfig.json')
const transporter = nodemailer.createTransport(SMTP_CONFIG)

const hbs = require('nodemailer-express-handlebars')
transporter.use('compile', hbs({
  viewEngine: {   
    extname: '.hbs',
    layoutsDir: `./serverUtilities/emailTemplates/`,
    layout: 'main'
  },
  viewPath: `./serverUtilities/emailTemplates/`,
  extName: '.hbs',
}))

// transporter.verify(function(error, success) {
//   if (error) {
//     console.log(error);
//   } else {
//     console.log("Server is ready to take our messages");
//   }
// });

module.exports = {
  sendPasswordReset(toEmail, pwResetLink) {
    const message = require('./emailTemplates/forgotPassword')
    message.to = toEmail
    message.context = {
      pwResetLink
    }
    return transporter.sendMail(message)
      .then((result) => {
        console.log(result)
      })
      .catch((err) => {
        console.log('ooooooopes')
        console.error(err)
      })
  },

}




// transporter.sendMail(message)
//   .then((result) => {
//     console.log(result)
//   })
//   .catch((err) => {
//     console.error(err)
//   })