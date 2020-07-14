const fs = require('fs');

const write = (filename, data) => {
    fs.appendFileSync(filename, data);
}

const clear = (filename) => {
    fs.writeFileSync(filename, "");
}

const writeAssets = () => {

    const packageStr = require("./assets/package.js");
    fs.writeFileSync('./output/package.json', JSON.stringify(packageStr, null, 1));

    const indexStr = require("./assets/index.js");
    fs.writeFileSync('./output/index.js', indexStr);

    const dockerStr = require("./assets/Dockerfile.js");
    fs.writeFileSync('./output/Dockerfile', dockerStr);

    fs.copyFileSync('./src/assets/requestService.js', "./output/requestService.js");
}

module.exports = {
    write,
    clear,
    writeAssets
}