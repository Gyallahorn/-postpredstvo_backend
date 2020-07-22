const nodemailer = require("nodemailer");
module.exports = {
    sendMail: (email) => {

        const random = Math.random() * (999999 - 100000) + 100000


        console.log("sending mail");
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'postpredstvoykt@gmail.com',
                pass: 'Supereasypassword'
            }
        });
        const info = {
            from: "postpredstvoykt@gmail.com",
            to: email,
            subject: "Код потверждения",
            text: random.toString,

        }
        transporter.sendMail(info, function (error, info) {
            if (error) {
                console.log(error);
            }
            else {
                console.log('Email sent' + info.response);
            }
        })
    }
}