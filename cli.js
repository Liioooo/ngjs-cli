#!/usr/bin/env node
const parser = require('./parseCommand');
const meow = require('meow');
const minimist = require('minimist');

const cli = meow(`
    Usage: ngjs-cli [command]
    
    Commands:
        gc, generate-component [name] Generates an AngularJS-Component
        gs, generate-service [name]   Generates an AngularJS-Service
    
    Options:
       -h, --help         print usage information
       -v, --version      show version info and exit
`);

let args = minimist(process.argv.slice(2), {
    alias: {
        h: 'help',
        v: 'version'
    }
});

if(cli.input[0]) {
    parser.parseCommand(cli.input, cli);
}
else if(args['version']) {
    cli.showVersion();
}
else if(args['help'] || args._.length === 0) {
    cli.showHelp(0);
}