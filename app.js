const express = require('express')
const app = express()
const nodemailer = require("nodemailer");
require('dotenv').config()

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).json({msg: "App is running on port: " + (process.env.PORT || 5000)})
})

app.post('/', async(req, res) => {
  const {name, email, subject, message} = req.body
  const senderMail = process.env.MAIL
  const senderPass = process.env.PASS  
  const receiverMail = process.env.RECEIVER_MAIL
  
  // Create a transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    // service: "Gmail", // You can use other email services like Outlook, Yahoo, etc.
    host: "smtp.gmail.com", // Gmail SMTP server
    port: 465, // SMTPS port
    secure: true, // Use SSL/TLS
    auth: {
      user: senderMail,
      pass: senderPass,
    },
  });

  // Email content
  const mailOptions = {
    from: senderMail,
    to: receiverMail,
    subject,
    html: `
      <section
        style="padding: 2rem"
      >
        <h3>Message from ${name}</h3>
        <h3>Email: ${email}</h3>
        <div>
          <h3>Message:</h3>
          <p style="margin-bottom: 30px;">${message}</p>
        </div>
   </section>
    `,
  };

  // Send email
  try {
    return res.status(200).json({
      MAIL: process.env.MAIL,
      PASS: process.env.PASS,
      RECEIVER_MAIL: process.env.RECEIVER_MAIL
    })
    const info = await transporter.sendMail(mailOptions)
    res.status(200).json({response: info.response})
  } catch (error) {
    res.status(400).json({error: error})
  }
})


const port = process.env.PORT || 5000
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})