/** 
 * @module helpers/sendEmail
 * */   
var nodemailer = require('nodemailer');
/**
 * Sends an email to user
 * @param {string} to user's email
 * @param {string} subject email's subject
 * @param {string} content conent for email
 */
module.exports = async function (to,subject,content){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.gmail_sender_account,
            pass: process.env.gmail_sender_pass
        }
    });

    var mailOptions = {
        from: process.env.gmail_sender_account,
        to: to,
        subject: subject,
        html: content
    };
    console.log(mailOptions);
    return await transporter.sendMail(mailOptions )  ; 
};
