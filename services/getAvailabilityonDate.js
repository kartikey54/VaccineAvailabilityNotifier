const axios=require('axios');
const request=require('request');
getAvailability = async  (PINCODE,DATE,QUANTITY, AGE) => {
    const config = {
        method: 'get',
        url: 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=' + PINCODE + '&date=' + DATE,
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'hi_IN',
            "Access-Control-Allow-Origin": "*",
            'Host': 'cdn-api.co-vin.in',
            'User-Agent':'Axios 0.21.1'
        }
    };
     try {
        const slots=await axios(config);
        const sessions = slots.data.sessions;
        const validSlots = sessions.filter(slot => slot.min_age_limit <= AGE &&  slot.available_capacity >= QUANTITY)
        return {status:'success',data:{date:DATE, validSlots: validSlots}};
    }
    catch(err) {
        console.log(err);
        return {status:'error'}
    }
}
module.exports= getAvailability;