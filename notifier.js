let nodemailer = require('nodemailer');

let nodemailerTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.APPLICATION_PASSWORD)
    }
});


exports.sendEmail = function (to, subject, html, textContent, callback) {
    let options = {
        from: String('Vaccine Checker ' + process.env.EMAIL),
        to,
        subject,
        text: 'Vaccine available. Details: \n\n' + textContent,
        html,
    };
    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        }
        callback(error, info);
    });
};
