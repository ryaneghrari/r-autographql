const buildType = ({ name, types, str }) => {

    name = capitalize(name);

    let nonRootTypes = types.filter(t => !t.root);

    if (nonRootTypes.length === 0) {
        //dont create a type for the temp root
        //continue building type string if there are children
    }
    else {
        str +=
            `type ${name} {`

        nonRootTypes.forEach(t => {

            if (t.isLeaf) {
                str += `\n  ${t.field}: ${t.type}`
            }
            else if (t.isArray) {
                str += `\n  ${t.field}: [ ${capitalize(singular(t.field))} ]`
            }
            else {
                str += `\n  ${t.field}: ${capitalize(singular(t.field))}`
            }
        })

        str += `
}
`
    }

    let branches = types.filter(t => !t.isLeaf)
    branches.map(t => {
        str += `\n` + buildType({
            name: capitalize(singular(t.field)),
            types: t.children,
            str: ''
        })
    })

    return str;
}

const buildQuery = ({ types }) => {
    let branches = getBranches(types);

    let str =
        `extend type Query {`

    branches.forEach(b => {

        if (b.isArray) {
            str += `\n  ${b.field.toLowerCase()}${b.params ? buildQueryParams(b.params) : ''}: [ ${capitalize(singular(b.field))} ]`
        }
        else {
            str += `\n  ${b.field.toLowerCase()}${b.params ? buildQueryParams(b.params) : ''}: ${capitalize(singular(b.field))}`
        }

    })

    str += `
}
`

    return str;
}


const buildResolvers = ({ resources }) => {

    let imports = `const RequestService = require('./requestService.js');`;

    let defs = resources.reduce((acc, r) => {
        return acc +=
            `
async function ${r.name}(root, { ${r.params ? Object.keys(r.params).join(',') : ''} }, context){
  let resp = await ${r.requestService || 'RequestService.GET'}({
    url: ${parametrizeUrl(r.url)}${r.headers ? `,
    headers: ${JSON.stringify(r.headers, null, 1)}` : ''}
  })
  return ${r.data_field ? 'resp.' + r.data_field : 'resp'};
}
`
    }, '')

    let exportStr = resources.reduce((acc, r) => {
        return acc += `${r.name},
    `;
    }, '')

    return `${imports}
  ${defs}
module.exports = {
  Query: {
    ${exportStr}
  }
}
  `
}

module.exports = {
    buildType,
    buildQuery,
    buildResolvers
}


function parametrizeUrl(url) {
    let paramStr = (url.indexOf('?') > 0) ? url.substring(url.indexOf('?') + 1) : '';
    let bareUrl = url.substring(0, url.length - paramStr.length);
    let params = paramStr.split('&');
    params = params.map(p => p.split('=')[0]).filter(p => p != '')
    let formattedParams = params.map(p => `${p}=\${${p}}`);
    let parametrizedUrl = `\`${bareUrl}${formattedParams}\``;
    return parametrizedUrl
}

function buildQueryParams(params) {
    let entries = Object.entries(params);
    let commaList = entries.map(e => `${e[0]}:${e[1]}`).join(',');
    console.log(commaList)
    if (commaList.length > 0) {
        return `(${commaList})`;
    }
    else {
        return ``;
    }
}

function getBranches(arr) {
    return arr.reduce((acc, type) => {
        if (!type.isLeaf) {
            acc = [...acc, type, ...getBranches(type.children)];
        }
        return acc;
    }, [])
}

function singular(w) {
    if (w[w.length - 1] === 's') {
        return w.slice(0, w.length - 1);
    }
    else {
        return w;
    }
}

function capitalize(w) {
    w = w.toLowerCase();
    return w[0].toUpperCase() + w.slice(1, w.length);
}