import { transporter } from "@/lib/nodemailer";
import { SendMailOptions } from "nodemailer";

const generateEmailContent = (content: string) => {
  return {
    text: content,
    html: `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Email</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Stix+Two+Text:wght@400;700&display=swap');
            body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              color: #333;
              padding: 20px;
              margin: 0;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background-color: #fff;
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              font-family: 'Stix Two Text', serif;
            }
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 20px;
            }
            .header .logo {
              font-size: 2rem;
              font-weight: bold;
              color: #007bff;
              margin-right: 10px;
              cursor: pointer;
              transition: color 0.3s;
            }
            .header .logo:hover {
              color: #0056b3;
            }
            .content {
              font-size: 1rem;
              color: #333;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">Pointer</div>
            </div>
            <div class="content">
              ${content}
            </div>
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
    const { email, subject, content } = data;

    if (!email || !subject || !content) {
      return new Response(JSON.stringify({ message: "Bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const mailOptions: SendMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      ...generateEmailContent(content),
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Failed to send email:", err);
    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
