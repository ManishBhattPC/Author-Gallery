import nodemailer from "nodemailer";

const getTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    console.log("SMTP configurations found. Initializing real mail transporter.");
    return nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: Number(SMTP_PORT) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  // Developer fallback
  return null;
};

export const sendOTPEmail = async (email, otp) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Author Gallery" <noreply@authorgallery.com>`,
    to: email,
    subject: "Verify Your Email - Author Gallery OTP Verification",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #FAF6F0;">
        <h2 style="color: #8C4E35; font-family: 'Playfair Display', Georgia, serif; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Thank you for registering at Author Gallery. Please use the following One-Time Password (OTP) to complete your signup process. This code will expire in 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8C4E35; border: 2px dashed #8C4E35; padding: 10px 35px; border-radius: 8px; background-color: #ffffff; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 40px;">If you did not request this email, please ignore it.</p>
      </div>
    `,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Verification email sent to ${email}`);
    } catch (err) {
      console.error("Error sending verification email via SMTP:", err);
      logFallback(email, otp);
    }
  } else {
    logFallback(email, otp);
  }
};

const logFallback = (email, otp) => {
  console.log("\n==================================================");
  console.log(`🔑 [DEV-FALLBACK] VERIFICATION CODE FOR ${email.toUpperCase()}:`);
  console.log(` 👉 ${otp} 👈`);
  console.log("==================================================\n");
};
