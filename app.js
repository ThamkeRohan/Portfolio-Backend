const express = require('express')
const app = express()
const cors = require("cors");
const nodemailer = require("nodemailer");
require('dotenv').config()

const corsOptions = {
  origin: ["https://rohan-thamke.app", "http://localhost:5173"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
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
        style="padding: 0.5rem"
      >
        <h2>New message from Portfolio</h2>
        <div>
          <p><strong>Sender's Name: </strong></p>
          <p>${name}</p>
        </div>
        <div>
          <p><strong>Sender's Email: </strong></p>
          <p>${email}</p>
        </div>
        <div>
          <p><strong>Message: </strong></p>
          <p>${message}</p>
        </div>
   </section>
    `,
  };

  // Send email
  try {
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