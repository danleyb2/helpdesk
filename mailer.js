'use strict';
const nodemailer = require('nodemailer');



// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
});

exports.sendNotification = function(mailOptions) {

// setup email data with unicode symbols
    /*
    let mailOptions = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        //to: 'danleyb2@gmail.com, baz@example.com', // list of receivers
        to: 'danleyb2@gmail.com', // list of receivers
        replyTo: 'notifications-434jjdjjd@danleyb2.online',
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };

    */

// send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);

    });

};
