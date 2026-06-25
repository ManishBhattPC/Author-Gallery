import nodemailer from "nodemailer";
import dns from "dns";

// Force Node.js to prefer IPv4 DNS resolution globally to prevent ENETUNREACH IPv6 routing errors
if (typeof dns.setDefaultResultOrder === "function") {
  dns.setDefaultResultOrder("ipv4first");
}

const dnsPromises = dns.promises;

// Cache the resolved IP and transporter to avoid repeating DNS lookup on every email
let cachedTransporter = null;
let cachedTransporterTime = 0;

const getTransporter = async () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return null;
  }

  // Check if we have a valid cached transporter (cache for 5 minutes)
  const now = Date.now();
  if (cachedTransporter && (now - cachedTransporterTime < 5 * 60 * 1000)) {
    return cachedTransporter;
  }

  console.log("SMTP configurations found. Initializing real mail transporter.");
  
  let hostAddress = SMTP_HOST;
  const isIP = /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(SMTP_HOST);

  // If the host is a domain, resolve it to IPv4 explicitly to prevent IPv6 ENETUNREACH errors
  if (!isIP) {
    try {
      const addresses = await dnsPromises.resolve4(SMTP_HOST);
      if (addresses && addresses.length > 0) {
        hostAddress = addresses[0];
        console.log(`Resolved SMTP host ${SMTP_HOST} to IPv4: ${hostAddress}`);
      }
    } catch (dnsErr) {
      console.error(`DNS IPv4 resolution failed for ${SMTP_HOST}, using hostname.`, dnsErr);
    }
  }

  const transporterOptions = {
    host: hostAddress,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  };

  // If we resolved a hostname to an IP, we MUST specify the servername for TLS validation
  if (!isIP && hostAddress !== SMTP_HOST) {
    transporterOptions.tls = {
      servername: SMTP_HOST,
    };
  }

  cachedTransporter = nodemailer.createTransport(transporterOptions);
  cachedTransporterTime = now;
  return cachedTransporter;
};

const sendEmail = async ({ to, subject, html, replyTo }) => {
  const { RESEND_API_KEY, BREVO_API_KEY, SMTP_HOST } = process.env;

  // 1. Resend API (HTTP POST over HTTPS port 443)
  if (RESEND_API_KEY) {
    try {
      console.log(`Attempting email delivery to ${to} via Resend HTTP API.`);
      const fromEmail = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
      const body = {
        from: `Author Gallery <${fromEmail}>`,
        to: [to],
        subject,
        html,
      };
      if (replyTo) {
        body.reply_to = replyTo;
      }

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log(`Email successfully sent to ${to} via Resend.`);
        return true;
      } else {
        const errText = await response.text();
        console.warn(`Resend API response not OK (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.error("Error sending email via Resend HTTP API:", err);
    }
  }

  // 2. Brevo API (HTTP POST over HTTPS port 443)
  if (BREVO_API_KEY) {
    try {
      console.log(`Attempting email delivery to ${to} via Brevo HTTP API.`);
      const fromEmail = process.env.BREVO_FROM_EMAIL || process.env.SMTP_USER || process.env.CONTACT_EMAIL || "noreply@authorgallery.com";
      const body = {
        sender: { name: "Author Gallery", email: fromEmail },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      };
      if (replyTo) {
        body.replyTo = { email: replyTo };
      }

      const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": BREVO_API_KEY,
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        console.log(`Email successfully sent to ${to} via Brevo.`);
        return true;
      } else {
        const errText = await response.text();
        console.warn(`Brevo API response not OK (${response.status}): ${errText}`);
      }
    } catch (err) {
      console.error("Error sending email via Brevo HTTP API:", err);
    }
  }

  // 3. SMTP Fallback (if API keys are not provided)
  if (SMTP_HOST) {
    try {
      console.log(`Attempting email delivery to ${to} via SMTP.`);
      const transporter = await getTransporter();
      if (transporter) {
        const fromEmail = process.env.SMTP_USER || "noreply@authorgallery.com";
        const mailOptions = {
          from: `"Author Gallery" <${fromEmail}>`,
          to,
          subject,
          html,
        };
        if (replyTo) {
          mailOptions.replyTo = replyTo;
        }

        await transporter.sendMail(mailOptions);
        console.log(`Email successfully sent to ${to} via SMTP.`);
        return true;
      }
    } catch (err) {
      console.error("Error sending email via SMTP:", err);
    }
  }

  console.warn(`No configured email provider (Resend, Brevo, or SMTP) succeeded in sending email to ${to}.`);
  return false;
};

export const sendOTPEmail = async (email, otp) => {
  const subject = "Verify Your Email - Author Gallery OTP Verification";
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #FAF6F0;">
        <h2 style="color: #8C4E35; font-family: 'Playfair Display', Georgia, serif; text-align: center;">Verify Your Email Address</h2>
        <p style="color: #334155; font-size: 16px; line-height: 1.6;">Thank you for registering at Author Gallery. Please use the following One-Time Password (OTP) to complete your signup process. This code will expire in 10 minutes.</p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #8C4E35; border: 2px dashed #8C4E35; padding: 10px 35px; border-radius: 8px; background-color: #ffffff; display: inline-block;">
            ${otp}
          </span>
        </div>
        <p style="color: #64748b; font-size: 13px; text-align: center; margin-top: 40px;">If you did not request this email, please ignore it.</p>
      </div>
    `;

  const success = await sendEmail({ to: email, subject, html });
  if (!success) {
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
  const adminEmail = process.env.CONTACT_EMAIL || process.env.SMTP_USER || "admin@authorgallery.com";
  const subject = `New Contact Inquiry from ${contactData.name}`;
  const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #FAF6F0;">
        <h2 style="color: #8C4E35; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-top: 0;">New Contact Form Submission</h2>
        <p style="color: #334155; font-size: 14px; margin: 5px 0;"><strong>Name:</strong> ${contactData.name}</p>
        <p style="color: #334155; font-size: 14px; margin: 5px 0;"><strong>Email:</strong> ${contactData.email}</p>
        <p style="color: #334155; font-size: 14px; margin: 15px 0 5px 0;"><strong>Message:</strong></p>
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.6; color: #1e293b; white-space: pre-wrap;">${contactData.message}</div>
      </div>
    `;

  const success = await sendEmail({ to: adminEmail, replyTo: contactData.email, subject, html });
  if (!success) {
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
  const subject = "Reset Your Password - Author Gallery";
  const html = `
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
    `;

  const success = await sendEmail({ to: email, subject, html });
  if (!success) {
    logResetFallback(email, otp);
  }
};

const logResetFallback = (email, otp) => {
  console.log("\n==================================================");
  console.log(`🔑 [DEV-FALLBACK] PASSWORD RESET CODE FOR ${email.toUpperCase()}:`);
  console.log(` 👉 ${otp} 👈`);
  console.log("==================================================\n");
};

