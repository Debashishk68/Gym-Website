const nodemailer = require("nodemailer");


async function mailSender(email,otp) {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
  });
  
  
  try {
  
      
      const info = await transporter.sendMail({
        from: '"Ab fitness Dev Team" <no-reply@dev.com>', 
        to: email,
        subject: "Your Single Use Code", 
        text: "Hello world?", 
        html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
              background-color: #f4f4f4;
            }
            .email-container {
              max-width: 600px;
              margin: 20px auto;
              background-color: #ffffff;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .email-header {
              background-color: #4a90e2;
              color: #ffffff;
              text-align: center;
              padding: 20px;
            }
            .email-header h1 {
              margin: 0;
              font-size: 24px;
            }
            .email-body {
              padding: 20px;
              color: #333333;
            }
            .otp-code {
              font-size: 24px;
              font-weight: bold;
              text-align: center;
              color: #4a90e2;
              margin: 20px 0;
            }
            .email-footer {
              text-align: center;
              background-color: #f4f4f4;
              padding: 15px;
              font-size: 12px;
              color: #777777;
            }
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #4a90e2;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 10px;
              text-align: center;
            }
            .button:hover {
              background-color: #3a78c2;
            }
          </style>
        </head>
        <body>
          <div class="email-container">
            <!-- Header Section -->
            <div class="email-header">
              <h1>Verification Code</h1>
            </div>
            <!-- Body Section -->
            <div class="email-body">
              <p>Hello,</p>
              <p>Thank you for using our service. Please use the following OTP to complete your verification:</p>
              <div class="otp-code">${otp}</div>
              <p>If you did not request this email, please ignore it.</p>
              <p>
                <a href="${process.env.FRONTEND_URL}" class="button">Visit Our Website</a>
              </p>
            </div>
            <!-- Footer Section -->
            <div class="email-footer">
              <p>&copy; 2025 Ab Fitness. All rights reserved.</p>
              <p>
                This is an automated email; please do not reply.
                For support, visit our <a href="https://example.com/support" style="color: #4a90e2; text-decoration: none;">Support Center</a>.
              </p>
            </div>
          </div>
        </body>
        </html>
      `, 
    });
        
     
      // console.log("Message sent: %s", info.messageId);
      return true;
    
    
  } catch (error) {
    console.log(error);
    return false;
  }
  
}

module.exports=mailSender;