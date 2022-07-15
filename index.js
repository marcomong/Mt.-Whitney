const axios = require('axios'); // package to make the request

const getAvailability = async () => { // make the request
    return new Promise(async (resolve, reject) => {
        const result = await axios.get('https://www.recreation.gov/api/permits/233260/divisions/166/availability?start_date=2022-01-01T00:00:00.000Z&end_date=2023-04-30T00:00:00.000Z&commercial_acct=false');
        const body = result.data.payload.date_availability
        resolve(body);
    })
}

const isAvailable = (availabilities, dateTrashold) => {
    let datesWithAvaialbility = [];
    for (const [dateString, value] of Object.entries(availabilities)) {
        const dateParsed = new Date(dateString);
        if (dateParsed < dateTrashold) continue; // don't care about the past

        if (value.remaining > 0) { // check if has availability
            datesWithAvaialbility.push({
                date: dateParsed,
                remaining: value.remaining
            })
        }
    }

    if (datesWithAvaialbility.length > 0) { // show in the log the result
        console.log(datesWithAvaialbility);
    } else {
        console.log('no dates found.....')
    }
}

const checkAvailability = async () => {
    const availabilities = await getAvailability();
    isAvailable(availabilities, new Date())
}

setInterval(checkAvailability, 1000) // 1s