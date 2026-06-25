import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to prefer IPv4 DNS resolution globally to prevent ENETUNREACH IPv6 routing errors
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

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
      family: 4, // Force IPv4 to prevent connect ENETUNREACH errors on IPv6 networks
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

export const sendContactEmail = async (contactData) => {
  const transporter = getTransporter();
  const adminEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "admin@authorgallery.com";

  const mailOptions = {
    from: `"Author Gallery Contact" <noreply@authorgallery.com>`,
    to: adminEmail,
    replyTo: contactData.email,
    subject: `New Contact Inquiry from ${contactData.name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #FAF6F0;">
        <h2 style="color: #8C4E35; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
        <p style="color: #334155; font-size: 14px; margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
        <p style="color: #334155; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${contactData.email}</p>
        <p style="color: #334155; font-size: 14px; margin: 15px 0 5px 0;"><strong>Message:</strong></p>
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${contactData.message}</div>
      </div>
    `,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Contact message from ${contactData.email} forwarded to ${adminEmail}`);
    } catch (err) {
      console.error("Error sending contact email via SMTP:", err);
      logContactFallback(contactData, adminEmail);
    }
  } else {
    logContactFallback(contactData, adminEmail);
  }
};

const logContactFallback = (contactData, adminEmail) => {
  console.log("\n==================================================");
  console.log(`✉️ [DEV-FALLBACK] CONTACT INQUIRY FOR ${adminEmail.toUpperCase()}:`);
  console.log(` FROM: ${contactData.name} <${contactData.email}>`);
  console.log(` MESSAGE:`);
  console.log(` ${contactData.message}`);
  console.log("==================================================\n");
};

export const sendResetPasswordOTPEmail = async (email, otp) => {
  const transporter = getTransporter();

  const mailOptions = {
    from: `"Author Gallery" <noreply@authorgallery.com>`,
    to: email,
    subject: "Reset Your Password - Author Gallery",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #FAF6F0;">
        <h2 style="color: #8C4E35; font-family: 'Playfair Display', Georgia, serif; text-align: center;">Reset Your Password</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">You have requested to reset your password. Please use the following One-Time Password (OTP) code to complete the process. This code will expire in 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8C4E35; border: 2px dashed #8C4E35; padding: 10px 35px; border-radius: 8px; background-color: #ffffff; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 40px;">If you did not request a password reset, please ignore this email.</p>
      </div>
    `,
  };

  if (transporter) {
    try {
      await transporter.sendMail(mailOptions);
      console.log(`Password reset email sent to ${email}`);
    } catch (err) {
      console.error("Error sending password reset email via SMTP:", err);
      logResetFallback(email, otp);
    }
  } else {
    logResetFallback(email, otp);
  }
};

const logResetFallback = (email, otp) => {
  console.log("\n==================================================");
  console.log(`🔑 [DEV-FALLBACK] PASSWORD RESET CODE FOR ${email.toUpperCase()}:`);
  console.log(` 👉 ${otp} 👈`);
  console.log("==================================================\n");
};
