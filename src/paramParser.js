module.exports = {
    parse,
}

function parse({ url }) {
    let params = url.substring(url.indexOf('?') + 1).split('&');
    params = params.map(p => p.split('=')).filter(p => p.length === 2);
    let obj = params.reduce((acc, p) => {
        acc[p[0]] = typeOf(p[1]);
        return acc;
    }, {})
    return obj;
}


function typeOf(value) {
    return "String"
}