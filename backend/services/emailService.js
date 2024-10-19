const nodemailer = require('nodemailer');

// Set up transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailAlert(city, temperature) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'recipient@example.com',
    subject: `Weather Alert for ${city}`,
    text: `ALERT: Temperature in ${city} has exceeded the threshold! Current Temperature: ${temperature}°C`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Alert email sent for ${city}`);
  } catch (error) {
    console.error('Error sending alert email:', error);
  }
}

module.exports = { sendEmailAlert };