const fetch = require('node-fetch');
const https = require('https');
const agent = new https.Agent({
    rejectUnauthorized: false,
    strictSSL: false,
})

module.exports = {
    GET,
    POST
}

async function GET({ url, headers }) {

    const options = {
        method: "get",
        agent: agent,
        headers
    }

    let response = await fetch(url, options)
    return await response.json();
}

async function POST({ url, data, headers }) {
    const options = {
        method: "post",
        body: JSON.stringify(data),
        json: true,
        agent: agent,
        headers: headers
    }

    let response = await fetch(url, options)
    return await response.json();
}