import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a test account or replace with real credentials.
export const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    pool: true, // Enable connection pooling
    maxConnections: 5, // Số connection đồng thời
    maxMessages: 100, // Số message per connection
    rateLimit: 14, // Messages per second (Gmail limit)
    auth: {
        user: process.env.ADDRESS_EMAIL,
        pass: process.env.PASSWORD_EMAIL,
    },
    tls: {
        ciphers: 'SSLv3', // Tăng tốc TLS handshake
    },
});
