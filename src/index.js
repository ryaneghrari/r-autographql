const RequestService = require('./request');
const StringBuilder = require('./StringBuilder');
const WriteService = require('./write');
const ResponseParser = require('./responseParser');
const ParamParser = require('./paramParser');
const Config = require('../config');
let resources = require('../resources');

process({ resources, type_outfile: Config.type_outfile, resolver_outfile: Config.resolver_outfile });

async function process({ resources, type_outfile, resolver_outfile }) {
    type_outfile = `./output/${type_outfile}`;
    resolver_outfile = `./output/${resolver_outfile}`;
    let def$ = resources.map(async (resource) => {
        let resp = await RequestService.GET({ url: resource.url, headers: resource.headers });
        if (resp) {
            let data = resource.data_field ? resp[resource.data_field] : resp;
            let name = resource.name; resource.params = ParamParser.parse({ url: resource.url });
            let temp = {}; temp[name] = data;
            let types = ResponseParser.process(temp); types[0].root = true;
            types[0].params = resource.params;
            let typeDefs = StringBuilder.buildType({ name: resource.name, types: types, str: '' }); 
            return { ...resource, typeDef: typeDefs, types: types }
        } 
        else { 
            return null; 
        }
    })  
    let resources_defs = await Promise.all(def$); resources_defs = resources_defs.filter(d => d); 
    let typeDefs = resources_defs.map(d => d.typeDef); 
    let types = resources_defs.map(d => d.types).reduce((acc, i) => [...acc, ...i], []); 

    WriteService.clear(type_outfile);
    WriteService.clear(resolver_outfile);
    WriteService.write(type_outfile, `const { gql } = require("apollo-server-express");
const typeDefs = gql\``); 

    typeDefs.map((d, i) => { console.log(`Wrote ${resources[i].name}`);
        WriteService.write(type_outfile, d) 
    });

    console.log(`to ${type_outfile}`);
    let queryDef = StringBuilder.buildQuery({ types: types });
    WriteService.write(type_outfile, queryDef);  

    WriteService.write(type_outfile, `\`  
module.exports = typeDefs;`); 
    let resolverDef = StringBuilder.buildResolvers({ resources })  
    WriteService.write(resolver_outfile, resolverDef); 
    console.log(`Wrote Resolvers to ${resolver_outfile}`); 
    WriteService.writeAssets(); 
    console.log(`Wrote Assets to ./output/`);
}