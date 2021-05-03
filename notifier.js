let nodemailer = require('nodemailer');

let nodemailerTransporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: String(process.env.EMAIL),
        pass: String(process.env.APPLICATION_PASSWORD)
    }
});

function createTemplate(slotDetails, date){
    let message = `Hi, 
    <br/>
    Vaccine is available on <strong> ${date} </strong> in the following centers: 
    <br/><br/>
    `
    console.log("slotdetails:",slotDetails)
    for(const slot of slotDetails){
        console.log("slotitem:",slot)
        let slotBody = `<strong> Center Name: ${slot.name} </strong> <br/>
        Location: ${slot.block_name}, ${slot.state_name}, ${slot.pincode} <br/>
        From ${slot.from} to ${slot.to} <br/>
        Fee Type: ${slot.fee_type} <br/>
        Fee: ${slot.fee} rupees <br/>
        Available Capacity: ${slot.available_capacity} doses available <br/>
        Vaccine: ${slot.vaccine} <br/>
        Slots Available: <br/>`
        console.log("timeslots:",slot.slots)
        // for(const x of slot.slots){
        //     slotBody = `${slotBody} ${x} <br/>`
        // }
        slotBody = `${slotBody} <br/><br/>`
        message = `${message} ${slotBody}`
    }

    return message
}


exports.sendEmail = function (email, subjectLine, slotDetails, date, callback) {
    let message = createTemplate(slotDetails, date)

    let options = {
        from: String('Vaccine Checker ' + process.env.EMAIL),
        to: email,
        subject: subjectLine,
        html: message
    };
    nodemailerTransporter.sendMail(options, (error, info) => {
        if (error) {
            return callback(error);
        }
        callback(error, info);
    });
};
