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

const PINCODE = process.env.PINCODE
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

async function checkAvailability() {

    let datesArray = await fetchNext10Days();
    datesArray.forEach(date => {
        getSlotsForDate(date);
    })
}

const getConfig = (pincode, date) => {
    return {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + pincode.trim() + '&date=' + date,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN'
        }
    };
}

async function getSlotsForDate(DATE) {
    const PINCODES_ARR = PINCODE.split(',');

    let promisesArr = PINCODES_ARR.map((pincode) => axios(getConfig(pincode, DATE))
      .then(function (slots) {
          let sessions = slots.data.sessions;
          let validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity > 0)
          console.log({date:DATE, pincode, validSlots: validSlots.length})
          if(validSlots.length > 0) {
              return notifyMe(validSlots);
          }
          return Promise.resolve();
      })
      .catch(function (error) {
          console.log(error);
          return Promise.reject();
      }));
    const results = await Promise.all(promisesArr.map(p => p.catch(e => e)));
    const invalidResults = results.filter(result => result instanceof Error);
    invalidResults.forEach(e => console.error(e));
}

async function

notifyMe(validSlots){
    let slotDetails = JSON.stringify(validSlots, null, '\t');
    notifier.sendEmail(EMAIL, 'VACCINE AVAILABLE', slotDetails, (err, result) => {
        if(err) {
            console.error({err});
        }
    })
};

async function fetchNext10Days(){
    let dates = [];
    let today = moment();
    for(let i = 0 ; i < 10 ; i ++ ){
        let dateString = today.format('DD-MM-YYYY')
        dates.push(dateString);
        today.add(1, 'day');
    }
    return dates;
}


main()
    .then(() => {console.log('Vaccine availability checker started.');});
