let nodemailer = require('nodemailer');
let mailConfig = process.env.EMAIL_HOST ? {
    host: String(process.env.EMAIL_HOST),  
    secure: true,
    secureConnection: false,
    port: 465,
    debug:true,
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.APPLICATION_PASSWORD)
    }
} :  {
    service: 'Gmail',
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.APPLICATION_PASSWORD)
    }
}
console.log(mailConfig);

let nodemailerTransporter = nodemailer.createTransport(mailConfig);


exports.sendEmail = function (email, subjectLine, slotDetails, callback) {
    let options = {
        from: String('Vaccine Checker ' + process.env.EMAIL),
        to: email,
        subject: subjectLine,
        text: 'Vaccine available. Details: \n\n' + slotDetails
    };
    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        }
        callback(error, info);
    });
};
