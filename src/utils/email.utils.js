import nodemailer from "nodemailer";

// Generate a 4-digit OTP
function generateOTP() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Send a generic email
async function sendEmail(to, subject, text) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to,
    subject,
    text,
  };

  await transporter.sendMail(mailOptions);
}

// Send an OTP email
async function sendOTPEmail({ to, otp }) {
  const subject = "Your One-Time Password (OTP) for Smart Insight";
  const text = `Your OTP is: ${otp}`;
  await sendEmail(to, subject, text);
}

// Export as an object for CommonJS compatibility
const EmailUtils = {
  generateOTP,
  sendOTPEmail,
};

export default EmailUtils; 