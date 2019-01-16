'use strict';
const nodemailer = require('nodemailer');
const pug = require('pug');


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

exports.sendNotification = function(mailOptions,cb) {

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
    transporter.sendMail(mailOptions, cb);

};

/**
 * Compile a template file as email body
 *
 * @param template pug file
 * @param locals template compilation locals
 * @param options subject, from,to
 * @param cb
 */
exports.sendTemplateNotification = function(template,locals,options,cb) {
    const compiledFunction = pug.compileFile(template);
    options['html'] = compiledFunction(locals);

    // todo optimization, render with cache https://pugjs.org/api/getting-started.html

    this.sendNotification(options,cb);


};
