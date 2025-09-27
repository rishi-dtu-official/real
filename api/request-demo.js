const nodemailer = require('nodemailer');

// Configure nodemailer with Titan Email SMTP
const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.titan.email',
  port: process.env.SMTP_PORT || 465,
  secure: true, // SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// In-memory rate limiting store (in production, use Redis or database)
const requestStore = new Map();

// Rate limiting configuration
const RATE_LIMIT = {
  windowMs: 15 * 60 * 1000, // 15 minutes
  maxRequests: 3, // Max 3 requests per IP per 15 minutes
  maxEmailRequests: 5 // Max 5 requests per email per hour
};

// Rate limiting function
const isRateLimited = (ip, email) => {
  const now = Date.now();
  const ipKey = `ip:${ip}`;
  const emailKey = `email:${email}`;
  
  // Check IP rate limit
  const ipRequests = requestStore.get(ipKey) || [];
  const recentIpRequests = ipRequests.filter(time => now - time < RATE_LIMIT.windowMs);
  
  if (recentIpRequests.length >= RATE_LIMIT.maxRequests) {
    return { limited: true, reason: 'Too many requests from this IP. Please try again later.' };
  }
  
  // Check email rate limit (1 hour window)
  const emailRequests = requestStore.get(emailKey) || [];
  const recentEmailRequests = emailRequests.filter(time => now - time < 60 * 60 * 1000);
  
  if (recentEmailRequests.length >= RATE_LIMIT.maxEmailRequests) {
    return { limited: true, reason: 'This email has already requested multiple demos. Please contact us directly.' };
  }
  
  // Update rate limit stores
  recentIpRequests.push(now);
  requestStore.set(ipKey, recentIpRequests);
  
  recentEmailRequests.push(now);
  requestStore.set(emailKey, recentEmailRequests);
  
  return { limited: false };
};

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  for (const [key, requests] of requestStore.entries()) {
    const recentRequests = requests.filter(time => now - time < oneHour);
    if (recentRequests.length === 0) {
      requestStore.delete(key);
    } else {
      requestStore.set(key, recentRequests);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    // Get client IP
    const clientIp = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress || 
                     req.socket.remoteAddress ||
                     '127.0.0.1';

    // Validate email
    if (!email || !email.includes('@') || email.length > 254) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

    // Check rate limiting
    const rateLimitCheck = isRateLimited(clientIp, email);
    if (rateLimitCheck.limited) {
      return res.status(429).json({ error: rateLimitCheck.reason });
    }

    // Email content for demo request
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demo Request - Fornix</title>
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
            border-bottom: 2px solid #06b6d4;
            padding-bottom: 20px;
          }
          .logo {
            display: inline-block;
            background: #06b6d4;
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
            color: #06b6d4;
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
          .demo-badge {
            background: #06b6d4;
            color: white;
            padding: 6px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
          }
          .info-section {
            background: #f0f9ff;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
            border-left: 4px solid #06b6d4;
          }
          .client-info {
            background: #fef3c7;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #f59e0b;
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
            <div class="logo">F</div>
            <h1 class="title">Fornix</h1>
            <p class="subtitle">New Demo Request Received</p>
            <div class="demo-badge">🎯 DEMO REQUEST</div>
          </div>
          
          <div class="content">
            <h2 style="color: #06b6d4; margin-top: 0;">📋 Demo Request Details</h2>
            
            <div class="client-info">
              <h3 style="margin-top: 0; color: #92400e;">👤 Contact Information</h3>
              <p><strong>Email:</strong> <a href="mailto:${email}" style="color: #06b6d4;">${email}</a></p>
              <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
              <p><strong>Source:</strong> Landing Page Contact Form</p>
            </div>
            
            <div class="info-section">
              <h3 style="color: #0369a1; margin-top: 0;">📞 Next Steps</h3>
              <p><strong>Immediate Actions Required:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Contact the prospect within 24 hours</li>
                <li>Schedule a personalized demo session</li>
                <li>Prepare demo materials and case studies</li>
                <li>Send calendar invite with demo link</li>
              </ul>
            </div>
            
            <div class="info-section">
              <h3 style="color: #0369a1; margin-top: 0;">💡 Demo Preparation Tips</h3>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Research the prospect's company and industry</li>
                <li>Prepare relevant use cases and examples</li>
                <li>Have pricing information ready</li>
                <li>Prepare follow-up materials</li>
              </ul>
            </div>
            
            <div style="background: #dcfce7; padding: 15px; border-radius: 8px; text-align: center; margin: 20px 0;">
              <p style="margin: 0;"><strong>⏰ Timeline:</strong> Please respond within 24 hours to maintain lead quality</p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Fornix Lead Generation System</strong></p>
            <p>This demo request was submitted on ${new Date().toLocaleString()}</p>
            <p>Reply directly to the prospect at: <a href="mailto:${email}" style="color: #06b6d4;">${email}</a></p>
            <p>© 2025 Fornix. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Demo Request - Fornix Platform

Contact Information:
- Email: ${email}
- Request Time: ${new Date().toLocaleString()}
- Source: Landing Page Contact Form

Next Steps:
- Contact prospect within 24 hours
- Schedule personalized demo session
- Prepare demo materials and case studies
- Send calendar invite with demo link

Demo Preparation:
- Research prospect's company and industry
- Prepare relevant use cases
- Have pricing information ready
- Prepare follow-up materials

Reply directly to: ${email}

---
Fornix Lead Generation System
For questions, contact: contactus@fornixai.tech
    `;

    // Mail options
    const mailOptions = {
      from: '"Fornix - Demo Requests" <contactus@fornixai.tech>',
      to: 'contactus@fornixai.tech',
      subject: `🎯 New Demo Request from ${email}`,
      text: textContent,
      html: htmlContent,
      replyTo: email
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Demo request email sent:', info.messageId);
    
    // Send confirmation email to the prospect
    const confirmationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Demo Request Confirmation - Fornix</title>
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
            background: #06b6d4;
            color: white;
            width: 50px;
            height: 50px;
            border-radius: 12px;
            font-size: 24px;
            font-weight: bold;
            line-height: 50px;
            margin-bottom: 10px;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .title {
            color: #06b6d4;
            font-size: 28px;
            font-weight: bold;
          }
          .highlight-box {
            background: #f0f9ff;
            border-left: 4px solid #06b6d4;
            padding: 20px;
            margin: 20px 0;
            border-radius: 0 8px 8px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">F</div>
            <div class="success-icon">🎯</div>
            <h1 class="title">Demo Request Received!</h1>
          </div>
          
          <p>Thank you for your interest in Fornix!</p>
          
          <p>We've received your demo request and are excited to show you how Fornix can help streamline your hiring process and connect you with top talent.</p>
          
          <div class="highlight-box">
            <h3 style="margin-top: 0; color: #06b6d4;">What happens next?</h3>
            <ul>
              <li>Our team will review your request within 2 hours</li>
              <li>We'll reach out to schedule a personalized demo at your convenience</li>
              <li>You'll receive a calendar invite with demo details</li>
              <li>We'll prepare relevant examples based on your industry</li>
            </ul>
          </div>
          
          <p>During the demo, we'll show you:</p>
          <ul>
            <li>How our AI matching works</li>
            <li>Our talent screening process</li>
            <li>Success stories from similar companies</li>
            <li>Pricing and implementation timeline</li>
          </ul>
          
          <p>If you have any urgent questions or need to reach us immediately, feel free to reply to this email or contact us at contactus@fornixai.tech.</p>
          
          <p>Looking forward to connecting with you!</p>
          
          <p>Best regards,<br>
          <strong>The Fornix Team</strong></p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Fornix - Connecting Great Talent with Great Opportunities</p>
            <p>contactus@fornixai.tech</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to prospect
    const confirmationOptions = {
      from: '"Fornix Team" <contactus@fornixai.tech>',
      to: email,
      subject: '🎯 Your Fornix Demo Request - We\'ll be in touch soon!',
      html: confirmationHtml
    };

    await transporter.sendMail(confirmationOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Demo request submitted successfully' 
    });

  } catch (error) {
    console.error('Error processing demo request:', error);
    res.status(500).json({ 
      error: 'Failed to submit demo request. Please try again.' 
    });
  }
}