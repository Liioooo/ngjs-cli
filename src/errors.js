const chalk = require('chalk');

class ErrorPrintableMessage extends Error{

    constructor(message = undefined) {
        super();
        if(message !== undefined) {
            this.message = message;
            this.stack = (new Error(this.message)).stack;
            this.name = 'ErrorPrintableMessage';
        }
    }

    printError() {
        console.log(chalk.default.red('   ' + this.message));
    }
}

class NotAProjectDirError extends ErrorPrintableMessage {

    constructor() {
        super();
        this.message = 'Error: The current directory is not a AngularJS project!';
        this.stack = (new Error(this.message)).stack;
        this.name = 'NotAProjectDirError';
    }
}

class InvalidNameErrorLNH extends ErrorPrintableMessage {

    constructor() {
        super();
        this.message = 'Error: Name is invalid: It has to start with a lower case letter and contain only letters, numbers and -.';
        this.stack = (new Error(this.message)).stack;
        this.name = 'InvalidNameErrorLNH';
    }
}

class InvalidNameErrorUC extends ErrorPrintableMessage {

    constructor() {
        super();
        this.message = 'Error: Name is invalid: It has to start with a upper case letter and contain only letters and numbers.';
        this.stack = (new Error(this.message)).stack;
        this.name = 'InvalidNameErrorUC';
    }
}

class CurrentDirNotAngularJS extends ErrorPrintableMessage {

    constructor() {
        super();
        this.message = 'Error: The current directory is not a AngularJS project!';
        this.stack = (new Error(this.message)).stack;
        this.name = 'CurrentDirNotAngularJS';
    }
}

function printWarning(message) {
    console.log(chalk.default.yellow('   ' + message));
}

module.exports = {ErrorPrintableMessage, NotAProjectDirError, InvalidNameErrorLNH, CurrentDirNotAngularJS, printWarning, InvalidNameErrorUC};