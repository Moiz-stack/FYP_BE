const Contact = require('../models/Contact');
const nodemailer = require('nodemailer');

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

exports.submitContact = async (req, res) => {
    try {
        const { name, email, comment } = req.body;

        // Validate required fields
        if (!name || !email || !comment) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Save contact message to database
        const contact = await Contact.create({ name, email, comment });

        // Prepare email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: process.env.ADMIN_EMAIL || process.env.EMAIL_USER,
            subject: 'New Contact Form Submission',
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Comment:</strong></p>
                <p>${comment}</p>
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);

        res.status(201).json({
            message: 'Thank you for your message. We will get back to you soon!'
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            message: 'Error submitting contact form',
            error: error.message
        });
    }
}; 