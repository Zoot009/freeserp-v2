import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
  const { name, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: `"FreeSERP Contact" <${process.env.SMTP_USER}>`,
    to: "support@freeserp.com",
    replyTo: email,
    subject: `Contact Form: ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    html: `
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <br/>
      <p>${message.replace(/\n/g, "<br/>")}</p>
    `,
  });

  return NextResponse.json({ ok: true });
}
