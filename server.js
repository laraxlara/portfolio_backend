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

app.get('/send', async (req, res, next) => {
  console.log(req.body)
  try {
    let {name, email, message } = req.body
    const transport = nodemailer.createTransport({
      service: "Gmail",
      auth: {
          type: 'OAuth2',
          user: 'laraa.celic7@gmail.com',
          clientId: '327191201635-qk39c5c9rhadl959d4g6o2pbfdfckisc.apps.googleusercontent.com',
          clientSecret: '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',
          refreshToken: '1//04xAGALWDT2_VCgYIARAAGAQSNwF-L9IrNbDzasw0t4dDoSUs9Q2Y_35WOJj7p-4wi3fOy1mxpxltpjpkl87uZneGeTuICQLMeTw',
          accessToken: 'ya29.a0AX9GBdXEVhViveqzPZcx80yZPseawwz_QGZrE1VIVDsjyOzDmCUN79z7LlmO1qY_GxOApfjRT4Pr6YefvQktltCZOZwcUG22mtUpVjiYIkL3NWarbDHna351HNoOrAiKCpmOqYuCRfOgeWEmoJRNHnnmFtP99MEaCgYKAUsSAQASFQHUCsbCwevZYJSMLZiDgsfNWGu-Cw0166'
      },
      tls: {
        rejectUnauthorized: false
      }
      })
    await transport.sendMail({
        from: 'laraa.celic7@gmail.com',
        to: 'laraxlara97@gmail.com',
        subject: "Website",
        html: `<div className="email">
        <h1>Hello</h1>
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