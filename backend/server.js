import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Resolve environment file path robustly
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });
dotenv.config(); // fallback to root .env if present

const app = express();
const PORT = process.env.PORT || 5000;
const GMAIL_USER = process.env.GMAIL_USER || 'qureshsamir145@gmail.com';
const GMAIL_APP_PASSWORD = (process.env.GMAIL_APP_PASSWORD || 'zhlxkzojpdlxkxtx').replace(/\s+/g, '');

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Transporter using authenticated Gmail App Password
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_APP_PASSWORD,
  },
});

// Verify SMTP connection on startup
transporter.verify((error) => {
  if (error) {
    console.error('❌ [Backend] Gmail SMTP Verification Failed:', error.message);
  } else {
    console.log('✅ [Backend] Gmail SMTP Authenticated & Ready for:', GMAIL_USER);
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    service: 'Samir Portfolio API',
    smtpReady: !!GMAIL_USER,
    timestamp: new Date().toISOString()
  });
});

// Contact endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!email || !message) {
      return res.status(400).json({ success: false, error: 'Email and message are required.' });
    }

    const senderName = name || 'Portfolio Visitor';
    const senderSubject = subject || 'Portfolio Inquiry';

    // 1. Notification to Samir (qureshsamir145@gmail.com)
    const adminMailOptions = {
      from: `"${senderName} via Portfolio" <${GMAIL_USER}>`,
      to: GMAIL_USER,
      replyTo: email,
      subject: `🚀 Portfolio Message from ${senderName}: ${senderSubject}`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0b0f17; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">New Portfolio Message Received</h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 5px 0 0 0;">Received on ${new Date().toLocaleString()}</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 25px;">
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold; width: 100px;">SENDER:</td>
              <td style="padding: 8px 0; color: #f8fafc; font-size: 14px; font-weight: 600;">${senderName}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">EMAIL:</td>
              <td style="padding: 8px 0; color: #38bdf8; font-size: 14px;"><a href="mailto:${email}" style="color: #38bdf8; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #64748b; font-size: 13px; font-weight: bold;">SUBJECT:</td>
              <td style="padding: 8px 0; color: #f8fafc; font-size: 14px;">${senderSubject}</td>
            </tr>
          </table>

          <div style="background: #111827; border: 1px solid #1f2937; border-radius: 8px; padding: 18px; margin-bottom: 25px;">
            <div style="color: #64748b; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 8px;">MESSAGE CONTENT</div>
            <div style="color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${email}?subject=${encodeURIComponent('Re: ' + senderSubject)}" style="background: #38bdf8; color: #0b0f17; font-weight: bold; font-size: 13px; padding: 10px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">Reply Directly to ${senderName}</a>
          </div>
        </div>
      `,
    };

    // 2. Auto-reply confirmation to the sender
    const autoReplyOptions = {
      from: `"Samir Qureshi" <${GMAIL_USER}>`,
      to: email,
      subject: `Thank you for reaching out, ${senderName}! — Samir Qureshi`,
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; background: #0b0f17; color: #f8fafc; padding: 30px; border-radius: 12px; border: 1px solid #1e293b; max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 1px solid #1e293b; padding-bottom: 15px; margin-bottom: 20px;">
            <h2 style="color: #38bdf8; margin: 0; font-size: 20px;">Message Received Successfully</h2>
            <p style="color: #94a3b8; font-size: 13px; margin: 5px 0 0 0;">Samir Qureshi • Portfolio Direct Channel</p>
          </div>
          
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Hi ${senderName},</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">Thank you for getting in touch! I have received your message regarding "<strong>${senderSubject}</strong>".</p>
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.6;">I will review your note and respond back to you directly at this email address as soon as possible.</p>

          <div style="background: #111827; border-left: 3px solid #38bdf8; padding: 12px 16px; margin: 20px 0; border-radius: 0 6px 6px 0;">
            <div style="color: #64748b; font-size: 11px; font-weight: bold; margin-bottom: 4px;">YOUR MESSAGE COPY:</div>
            <div style="color: #94a3b8; font-size: 13px; line-height: 1.5; white-space: pre-wrap;">${message}</div>
          </div>

          <div style="border-top: 1px solid #1e293b; padding-top: 15px; margin-top: 25px; font-size: 12px; color: #64748b;">
            <strong style="color: #f8fafc;">Samir Qureshi</strong><br />
            B.Sc. in Computer Science & Engineering (Metropolitan University, Sylhet)<br />
            Full-Stack Web Developer, Cybersecurity Specialist & Tech Entrepreneur<br />
            GitHub: <a href="https://github.com/samir-60" style="color: #38bdf8;">github.com/samir-60</a> | WhatsApp: <a href="https://wa.me/8801725198663" style="color: #38bdf8;">+8801725198663</a>
          </div>
        </div>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMailOptions),
      transporter.sendMail(autoReplyOptions),
    ]);

    return res.status(200).json({ success: true, message: 'Emails delivered successfully.' });
  } catch (err) {
    console.error('❌ [Backend] Email dispatch error:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 [Backend] Portfolio API Server listening on http://localhost:${PORT}`);
});
