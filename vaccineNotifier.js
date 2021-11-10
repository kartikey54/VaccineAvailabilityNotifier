require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const notifier = require('./notifier');
/**
 Step 1) Enable application access on your gmail with steps given here:
 https://support.google.com/accounts/answer/185833?p=InvalidSecondFactor&visit_id=637554658548216477-2576856839&rd=1

 Step 2) Enter the details in the file .env, present in the same folder

 Step 3) On your terminal run: npm i && pm2 start vaccineNotifier.js

 To close the app, run: pm2 stop vaccineNotifier.js && pm2 delete vaccineNotifier.js
 */

const PINCODES = JSON.parse(process.env.PINCODE)
const EMAIL = process.env.EMAIL
const AGE = process.env.AGE

async function main(){
    try {
        cron.schedule('* * * * *', async () => {
            await checkAvailability();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

function getDatePincodeParamArray() {
    let datesArray = fetchNext10Days();
    let pinCodes = PINCODES;
    return datesArray.map(date => {
        return pinCodes.map(pinCode => [date, pinCode]);
    });
}

async function checkAvailability() {
    let datePincodeParam = getDatePincodeParamArray();
    datePincodeParam = datePincodeParam.reduce((acc, val) => acc.concat(val), []);
    console.log('Getting details for ', datePincodeParam);

    const allSlots = datePincodeParam.map(async datePincode => {
        const slots = await getSlotsForDate(datePincode);
        return slots;
    })
    const allSlotsDetails = await Promise.all(allSlots);
    let allValidSlots = allSlotsDetails.map(slots => {
        let sessions = slots.data.sessions;
        const availableSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0);
        if (availableSlots.length) {
            return availableSlots;
        }
    });

    allValidSlots = allValidSlots.filter(function( element ) {
        return element !== undefined;
    });

    if (allValidSlots.length > 0) {
        await notifyMe(allValidSlots);
    } else {
        console.log('Vaccine not available', allValidSlots);
    }
}

function getSlotsForDate(datePincode) {
    const date = datePincode[0];
    const pinCode = datePincode[1];
    let config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pinCode + '&date=' + date,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN'
        }
    };

    return axios(config);
}

function buildEmailTable(allValidSlots) {
    let table = '<table border="1" cellpadding="2" cellspacing="2">';

    table += '<tr>';
    table += '<th>' + 'Pincode' + '</th>';
    table += '<th>' + 'Name' + '</th>';
    table += '<th>' + 'Address' + '</th>';
    table += '<th>' + 'District' + '</th>';
    table += '<th>' + 'From' + '</th>';
    table += '<th>' + 'Date' + '</th>';
    table += '<th>' + 'To' + '</th>';
    table += '<th>' + 'Fee' + '</th>';
    table += '<th>' + 'Available Capacity' + '</th>';
    table += '<th>' + 'Min Age Limit' + '</th>';
    table += '<th>' + 'Vaccine' + '</th>';
    table += '<th>' + 'Slots' + '</th>';
    table += '</tr>';

    allValidSlots.forEach(validSlots => {
        validSlots.forEach(validSlot => {
            console.log('validSlot', validSlot);
            table += '<tr>';
            table += '<td>' + validSlot.pincode + '</td>';
            table += '<td>' + validSlot.name + '</td>';
            table += '<a href="' + 'https://www.google.com/maps/search/?api=1&query=' + validSlot.lat + ',' + validSlot.long +'">' + validSlot.address + '</a></td>';
            table += '<td>' + validSlot.district_name + '</td>';
            table += '<td>' + validSlot.date + '</td>';
            table += '<td>' + validSlot.from + '</td>';
            table += '<td>' + validSlot.to + '</td>';
            table += '<td>Rs. ' + validSlot.fee + '</td>';
            table += '<td>' + validSlot.available_capacity + '</td>';
            table += '<td>' + validSlot.min_age_limit + '</td>';
            table += '<td>' + validSlot.vaccine + '</td>';
            table += '<td>' + JSON.stringify(validSlot.slots) + '</td>';
            table += '</tr>';
        });
    });
    table += '</table>';
    return table;
}

async function notifyMe(validSlots){
    let htmlContent = buildEmailTable(validSlots);
    let textContent = JSON.stringify(validSlots, null, '\t');
    notifier.sendEmail(EMAIL, 'VACCINE AVAILABLE', htmlContent, textContent,(err, result) => {
        if(err) {
            console.error({err});
        }
    })
};

function fetchNext10Days(){
    let dates = [];
    let today = moment();
    for(let i = 0 ; i < 10; i ++ ){
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}


main()
    .then(() => {console.log('Vaccine availability checker started.');});
