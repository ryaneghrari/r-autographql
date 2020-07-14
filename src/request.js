const fetch = require('node-fetch');

module.exports = {
    GET,
    POST
}

async function GET({ url, headers }) {
    const options = {
        method: "get",
        json: true,
        headers: headers
    }

    try {
        let response = await fetch(url, options)
        return await response.json();
    }
    catch (e) {
        console.log("Failed to grab: ", url, e)
    }

}

async function POST({ url, data, headers }) {
    const options = {
        method: "post",
        body: JSON.stringify(data),
        json: true,
        headers: headers
    }

    try {
        let response = await fetch(url, options)
        return await response.json();
    }
    catch (e) {
        console.log("Failed to grab: ", url)
    }

}