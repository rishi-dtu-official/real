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
    const { personName, organisation, jobPosition, description, contactEmail, phone } = req.body;

    // Validate required fields
    if (!personName || !organisation || !jobPosition || !description || !contactEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Email content for the hiring request
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Hiring Request - Fornix</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
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
            border-bottom: 2px solid #10b981;
            padding-bottom: 20px;
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
          .section {
            margin: 25px 0;
            padding: 20px;
            background: #f8fafc;
            border-radius: 8px;
            border-left: 4px solid #10b981;
          }
          .field {
            margin: 15px 0;
          }
          .field-label {
            font-weight: bold;
            color: #374151;
            display: block;
            margin-bottom: 5px;
          }
          .field-value {
            color: #1f2937;
            background: white;
            padding: 10px;
            border-radius: 6px;
            border: 1px solid #e5e7eb;
          }
          .description-box {
            background: white;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #e5e7eb;
            white-space: pre-wrap;
            font-family: inherit;
          }
          .priority-badge {
            background: #ef4444;
            color: white;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 20px;
          }
          .contact-info {
            background: #ecfdf5;
            padding: 20px;
            border-radius: 8px;
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
          .cta-section {
            background: #f0fdf4;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">F</div>
            <h1 class="title">Fornix</h1>
            <p class="subtitle">New Hiring Request Received</p>
            <div class="priority-badge">🚨 NEW REQUEST</div>
          </div>
          
          <div class="content">
            <div class="cta-section">
              <h2 style="color: #10b981; margin-top: 0;">📋 Hiring Request Details</h2>
              <p>A new employer has submitted a hiring request through the Fornix platform. Please review the details below and follow up accordingly.</p>
            </div>
            
            <div class="section">
              <h3 style="color: #374151; margin-top: 0;">👤 Contact Information</h3>
              
              <div class="field">
                <span class="field-label">Contact Person:</span>
                <div class="field-value">${personName}</div>
              </div>
              
              <div class="field">
                <span class="field-label">Organization:</span>
                <div class="field-value">${organisation}</div>
              </div>
              
              <div class="field">
                <span class="field-label">Email:</span>
                <div class="field-value">
                  <a href="mailto:${contactEmail}" style="color: #10b981; text-decoration: none;">${contactEmail}</a>
                </div>
              </div>
              
              ${phone ? `
              <div class="field">
                <span class="field-label">Phone:</span>
                <div class="field-value">
                  <a href="tel:${phone}" style="color: #10b981; text-decoration: none;">${phone}</a>
                </div>
              </div>
              ` : ''}
            </div>
            
            <div class="section">
              <h3 style="color: #374151; margin-top: 0;">💼 Job Details</h3>
              
              <div class="field">
                <span class="field-label">Position:</span>
                <div class="field-value">${jobPosition}</div>
              </div>
              
              <div class="field">
                <span class="field-label">Job Description & Requirements:</span>
                <div class="description-box">${description}</div>
              </div>
            </div>
            
            <div class="contact-info">
              <h3 style="color: #10b981; margin-top: 0;">📞 Next Steps</h3>
              <p><strong>Immediate Actions Required:</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>Review the job requirements carefully</li>
                <li>Contact ${personName} at ${contactEmail} within 24 hours</li>
                <li>Search for matching candidates in the database</li>
                <li>Prepare candidate profiles for presentation</li>
              </ul>
            </div>
            
            <div class="cta-section">
              <p><strong>⏰ Timeline:</strong> Please respond to this request within 24 hours to maintain our service quality standards.</p>
              <p><strong>📧 Reply directly to:</strong> <a href="mailto:${contactEmail}" style="color: #10b981;">${contactEmail}</a></p>
            </div>
          </div>
          
          <div class="footer">
            <p><strong>Fornix Hiring Platform</strong></p>
            <p>This request was submitted on ${new Date().toLocaleString()}</p>
            <p>For questions about this request, contact our support team at support@fornixai.tech</p>
            <p>© 2025 Fornix. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const textContent = `
New Hiring Request - Fornix Platform

Contact Information:
- Name: ${personName}
- Organization: ${organisation}
- Email: ${contactEmail}
${phone ? `- Phone: ${phone}` : ''}

Job Details:
- Position: ${jobPosition}
- Description: ${description}

Next Steps:
- Contact ${personName} at ${contactEmail} within 24 hours
- Search for matching candidates
- Prepare candidate profiles

This request was submitted on ${new Date().toLocaleString()}.

---
Fornix Hiring Platform
For questions, contact: support@fornixai.tech
    `;

    // Mail options
    const mailOptions = {
      from: '"Fornix - Hiring Platform" <support@fornixai.tech>',
      to: 'rishirajprajapati22@gmail.com',
      cc: 'support@fornixai.tech', // Copy to company email
      subject: `🚨 New Hiring Request: ${jobPosition} at ${organisation}`,
      text: textContent,
      html: htmlContent,
      replyTo: contactEmail // Allow direct reply to the employer
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Hiring request email sent:', info.messageId);
    
    // Send confirmation email to the employer
    const confirmationHtml = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Request Confirmation - Fornix</title>
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
          .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          .title {
            color: #10b981;
            font-size: 28px;
            font-weight: bold;
          }
          .highlight-box {
            background: #f0fdf4;
            border-left: 4px solid #10b981;
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
            <div class="success-icon">✅</div>
            <h1 class="title">Request Received!</h1>
          </div>
          
          <p>Hi ${personName},</p>
          
          <p>Thank you for submitting your hiring request for the <strong>${jobPosition}</strong> position at <strong>${organisation}</strong>.</p>
          
          <div class="highlight-box">
            <h3 style="margin-top: 0; color: #10b981;">What happens next?</h3>
            <ul>
              <li>Our team will review your requirements within 2 hours</li>
              <li>We'll search our database for the best matching candidates</li>
              <li>You'll receive candidate profiles within 24 hours</li>
              <li>We'll schedule interviews with your top choices</li>
            </ul>
          </div>
          
          <p>We're committed to finding you the perfect talent match. If you have any questions or need to update your requirements, feel free to reply to this email.</p>
          
          <p>Best regards,<br>
          <strong>The Fornix Team</strong></p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 14px;">
            <p>Fornix - Connecting Great Talent with Great Opportunities</p>
            <p>support@fornixai.tech</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send confirmation email to employer
    const confirmationOptions = {
      from: '"Fornix Team" <support@fornixai.tech>',
      to: contactEmail,
      subject: `✅ Your Hiring Request for ${jobPosition} has been received`,
      html: confirmationHtml
    };

    await transporter.sendMail(confirmationOptions);
    
    res.status(200).json({ 
      success: true, 
      message: 'Hiring request submitted successfully',
      messageId: info.messageId 
    });

  } catch (error) {
    console.error('Error sending hiring request email:', error);
    
    // More specific error handling
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        error: 'SMTP Authentication failed', 
        details: 'Invalid email credentials' 
      });
    }
    
    if (error.code === 'ECONNECTION') {
      return res.status(500).json({ 
        error: 'SMTP Connection failed', 
        details: 'Cannot connect to email server' 
      });
    }
    
    res.status(500).json({ 
      error: 'Failed to submit hiring request', 
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
}