const sendEmail  = require('./sendEmail');

function createTemplate(slotDetails, date){
    let message = `Hi, 
    <br/>
    Vaccine is available on <strong> ${date} </strong> in the following center(s): 
    <br/><br/>
    `
    for(const slot of slotDetails){
        let slotBody = `<strong> Center Name: ${slot.name} </strong> <br/>
        Location: ${slot.block_name}, ${slot.state_name}, ${slot.pincode} <br/>
        From ${slot.from} to ${slot.to} <br/>
        Fee Type: ${slot.fee_type} <br/>
        Fee: ${slot.fee} rupees <br/>
        Available Capacity: ${slot.available_capacity} dose(s) available <br/>
        Vaccine: ${slot.vaccine} <br/>
        Slots Available: <br/>`
        for(const x of slot.slots){
            slotBody = `${slotBody} ${x} <br/>`
        }
        slotBody = `${slotBody} <br/><br/>`
        message = `${message} ${slotBody}`
    }

    return message
}


exports.notifyUser = function (email, subjectLine, slotDetails, date, callback) {
    let message = createTemplate(slotDetails, date)
    sendEmail.sendEmail(email, subjectLine, message)
};
