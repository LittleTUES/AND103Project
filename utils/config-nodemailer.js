const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'tientqps27928@fpt.edu.vn',
        pass: 'mqrtasxhqeqktbwr'
    }
});

module.exports = { transporter };
