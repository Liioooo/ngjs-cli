#!/usr/bin/env node
const parser = require('./parseCommand');
const HelpProvidor = require('./HelpProvidor');
const minimist = require('minimist');

let args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version',
        r: 'routing'
    }
});

if(args._.length === 0) {
    if(args['version']) {
        let pjson = require('../package.json');
        console.log(pjson.version);
    } else {
        HelpProvidor.printEntireHelp();
    }
} else {
    parser.parseCommand(args);
}