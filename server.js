const express = require('express')
const app = express();
const path = require('path')
require('dotenv').config();
const cors = require('cors')
const nodemailer = require("nodemailer")
const { google } = require('googleapis');
const morgan = require('morgan')
const port = 5000

app.use(morgan('dev'))
app.use(cors());
app.use(express.json());

app.get('/download', async (req, res, next) => {

  const fileName = 'CV.pdf'
  const filePath = path.join(__dirname, '/storage', fileName)

  const options = {
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      'content-disposition': "attachment; filename=" + fileName,
      'content-type': 'pdf'
    }
  }
  try {
    res.download(
      filePath,
      fileName,
      options
    )
    console.log('File sent successfuly!')
  }
  catch (error) {
    console.error('File could not be sent!')
    next(error)
  }
})

app.post('/send', async (req, res, next) => {
  console.log(req.body)
  try {
    let {name, email, message } = req.body
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          type: 'OAuth2',
          user: process.env.GMAIL_EMAIL,
          clientId: process.env.CLIENT_ID,
          clientSecret: process.env.CLIENT_SECRET,
          refreshToken: process.env.REFRESH_TOKEN,
          accessToken: process.env.accessToken
      },
      tls: {
        rejectUnauthorized: false
      }
      })
    await transport.sendMail({
        from: req.body.email,
        to: 'laraxlara97@gmail.com',
        subject: "Website",
        html: `<div className="email">
        <h1>Message</h1>
        <p>Message: ${message}</p>
        </div>`
      })
      return res.status(200).json({ status: 200, message: 'Mail successfully sent'});
  } catch (e) {
    console.log(e);
    next(e);
  }
})

app.listen(process.env.PORT || port, () => {
  console.log(`Now listening on port ${port}`);
}); 