import nodemailer from 'nodemailer';

// Configure nodemailer with Titan Email SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.titan.email',
  port: process.env.SMTP_PORT || 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.SMTP_REFERRAL_USER || process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { referralName, referralEmail, userName, userEmail } = req.body;

    // Validate required fields
    if (!referralName || !referralEmail || !userName || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email content
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Referral Notification - Fornix</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            display: inline-block;
            background: #10b981;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            font-size: 24px;
            font-weight: bold;
            line-height: 50px;
            margin-bottom: 10px;
          }
          .title {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
            margin: 0;
          }
          .subtitle {
            color: #6b7280;
            font-size: 16px;
            margin-top: 5px;
          }
          .content {
            margin: 30px 0;
          }
          .highlight {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
          .user-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .cta-button {
            display: inline-block;
            background: #10b981;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #e5e7eb;
            color: #6b7280;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
          
            <h1 class="title">Fornix AI</h1>
            <p class="subtitle">Professional Referral</p>
          </div>
          
          <div class="content">
            <p>Hello <strong>${referralName}</strong>,</p>
            
            <p>I hope this message finds you well. You've been listed as a referral contact by your friend/Colleague.</p>
            
            <div class="user-info">
              <h3 style="margin-top: 0; color: #374151;">Candidate Information:</h3>
              <p><strong>Name:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Platform:</strong> <a href="https://fornixai.tech" target="_blank">fornixai.tech</a></p>
            </div>
            
            <div class="highlight">
              <p><strong>Why you're receiving this:</strong><br>
              ${userName} has recently joined our platform. You can also join us to get direct job interviews and freelance project alerst based on your profile</p>
            </div>
            
            <p><strong>Who we are?</strong></p>
            <ul>
              <li>Fornix AI sends you job and projects alerts, tailored to your skills and experience.You don't have to apply to every other job.</li>
              <li>We match you with startups based on your profile and skills</li>
              <li>Bypass traditional ATS filters and let your skills speak directly to opportunities. </li>
            </ul>
            
            <p><strong>No immediate action is required</strong> - this is simply a courtesy notification. You can register on our platform , Get Discovered by startups around the World, work with them, grow your skills, expand your network, and build a better version of yourself.</p>
            
          
            
            <p>If you have any questions about this notification or would like to learn more about Fornix, please don't hesitate to visit our page <a href="https://fornixai.tech" target="_blank">fornixai.tech</a>.</p>
            
          
            
            <p>Best regards,<br>
            <strong>The Fornix Team</strong></p>
          </div>
          
          <div class="footer">
            <p>This email was sent by <strong>Fornix</strong> on behalf of ${userName}</p>
            <p>If you believe you received this email in error, please contact us at support@fornixai.tech</p>
            <p>© 2025 Fornix. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
Hello ${referralName},

You've been listed as a referral contact by ${userName} (${userEmail}) on Fornix, a professional career platform.

This is a courtesy notification that ${userName} has identified you as someone who could potentially provide valuable insights or assistance in their job search journey.

No immediate action is required - this is simply to inform you that you may be contacted directly regarding potential opportunities or professional advice.

About the candidate:
- Name: ${userName}
- Email: ${userEmail}
- Platform: Fornix

About Fornix:
Fornix is a professional career platform that helps talented individuals connect with opportunities and build meaningful professional relationships.

If you have any questions, please contact our support team at support@fornixai.tech.

Best regards,
The Fornix Team

This email was sent on behalf of ${userName}. If you believe you received this email in error, please contact us at support@fornixai.tech.
    `;

    // Mail options
    const mailOptions = {
      from: '"Fornix - Career Platform" <support@fornixai.tech>',
      to: referralEmail,
      subject: `Professional Referral Notification - ${userName} has listed you as a reference`,
      text: textContent,
      html: htmlContent,
      replyTo: userEmail // Allow referral to reply directly to the candidate
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Referral email sent:', info.messageId);
    
    res.status(200).json({ 
      success: true, 
      message: 'Referral email sent successfully',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Error sending referral email:', error);
    res.status(500).json({ 
      error: 'Failed to send referral email', 
      details: error.message 
    });
  }
}