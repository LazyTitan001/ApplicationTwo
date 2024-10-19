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

  await transporter.sendMail(mailOptions);
}

// In checkAlerts
if (recentData.every(data => data.temp > setting.temperatureThreshold)) {
  await sendEmailAlert(city, recentData[0].temp);
}
