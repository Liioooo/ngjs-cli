module.exports = class Command {

    static get commandName() {
        throw new Error('commandName must be implemented!')
    }
    static get helpText() {
        throw new Error('getHelpText must be implemented!')
    }

    static get needsArgs() {
        throw new Error('needsArgs must be implemented!');
    }

    static run(args) {
        throw new Error('run must be implemented!')
    }
};