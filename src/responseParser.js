module.exports = {
    process
}

function process(resp) {
    let result = parse(Array.isArray(resp) ? resp[0] : resp);

    let branch = result.filter(r => !r.isLeaf);

    branch.forEach(b => {
        b.children = process(Array.isArray(resp[b.field]) ? resp[b.field][0] : resp[b.field]);
    });

    return result;
}

function parse(res, root) {

    let type = typeOf(res);

    if (type.type === 'object') {
        return Object.keys(res).reduce((acc, field) => {
            let type = typeOf(res[field]);
            acc.push({
                field: field,
                type: type.name,
                isLeaf: type.isLeaf,
                isArray: type.isArray
            })
            return acc;
        }, [])
    }
    else {
        return [
            {
                field: 'n/a',
                type: type.name,
                isLeaf: type.isLeaf,
                isArray: type.isArray
            }
        ]
    }
}

function typeOf(value) {
    if (value === null || value === undefined) {
        return { name: `NULL`, isLeaf: true, type: 'null', isArray: false }
    }
    else if (Array.isArray(value)) {
        if (value.length > 0) {
            return { name: `[${typeOf(value[0]).name}]`, isLeaf: false, type: 'array', isArray: true }
        }
        else {
            return { name: `[ *UNKNOWN due to empty array response* ]`, isLeaf: true, type: 'array', isArray: true }
        }

    }
    else if (typeof value === 'object') {
        return { name: 'Object', isLeaf: false, type: 'object', isArray: false }
    }
    else if (typeof value === 'number') {
        return { name: 'Int', isLeaf: true, type: 'number', isArray: false }
    }
    else if (typeof value === 'string') {
        return { name: 'String', isLeaf: true, type: 'string', isArray: false }
    }
    else if (value === true || value === false) {
        return { name: 'Boolean', isLeaf: true, type: 'boolean', isArray: false }
    }
}