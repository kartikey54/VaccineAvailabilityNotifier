require('dotenv').config()
const moment = require('moment');
const cron = require('node-cron');
const axios = require('axios');
const notifier = require('./notifier');
const findEntries = require('./find_entries.json');

console.log("Entries: " + JSON.stringify(findEntries));

async function main() {
    try {
        cron.schedule('*/2 * * * *', async () => {
            await checkAvailability();
        });
    } catch (e) {
        console.log('an error occured: ' + JSON.stringify(e, null, 2));
        throw e;
    }
}

async function checkAvailability() {

    let datesArray = await fetchNext10Days();

    findEntries.forEach(entry => {
        var findBy = entry.find_by;
        var findValue = entry.find_value;
        var age = entry.age;
        var toEmail = entry.to_email;
        console.log("Finding available slots for " + toEmail + " of age " + age + " by " + findBy + " " + findValue);

        datesArray.forEach(date => {
            getSlotsForDate(date, findBy, findValue, age, toEmail);
        });
    });
}

function getSlotsForDate(date, findBy, findValue, age, toEmail) {
    const URL_FIND_BY_PINCODE = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + findValue + '&date=' + date;
    const URL_FIND_BY_DISTRICT = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=' + findValue + '&date=' + date;
    var url = findBy === 'district' ? URL_FIND_BY_DISTRICT : URL_FIND_BY_PINCODE;

    let config = {
        method: 'get',
        url: url,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN'
        }
    };

    axios(config)
        .then(function (slots) {
            let sessions = slots.data.sessions;
            let validSlots = sessions.filter(slot => slot.min_age_limit <= age && slot.available_capacity > 0)
            console.log({ date: date, validSlots: validSlots.length })
            if (validSlots.length > 0) {
                notifyMe(validSlots, toEmail);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
}

async function

    notifyMe(validSlots, toEmail) {
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    notifier.sendEmail(toEmail, 'Vaccine available', slotDetails, (err, result) => {
        if (err) {
            console.error({ err });
        }
    })
};

async function fetchNext10Days() {
    let dates = [];
    let today = moment();
    for (let i = 0; i < 10; i++) {
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}


main()
    .then(() => { console.log('Vaccine availability checker started.'); });
