import { transporter } from "@/lib/nodemailer";
import { SendMailOptions } from "nodemailer";


const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
};

const generateEmailContent = (verificationCode: string) => {
  return {
    text: `Your verification code is: ${verificationCode}`,
    html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email Verification</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .code {
              font-size: 24px;
              font-weight: bold;
              color: #007BFF;
            }
            .message {
              margin-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h2>Email Verification</h2>
            <p>Please use the following code to verify your email address:</p>
            <p class="code">${verificationCode}</p>
            <p class="message">If you did not request this code, you can safely ignore this email.</p>
          </div>
        </body>
      </html>`,
  };
};

export async function POST(req: Request) {

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ message: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const data = await req.json();
    const { email } = data;

    if (!email) {
      return new Response(JSON.stringify({ message: "Bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Generate a verification code
    const verificationCode = generateVerificationCode();

    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
    };

    // Send verification code via email
    await transporter.sendMail({
      ...mailOptions,
      ...generateEmailContent(verificationCode),
      subject: "Your Verification Code",
    });

    return new Response(JSON.stringify({ success: true, verificationCode }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to send verification email:", err);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
