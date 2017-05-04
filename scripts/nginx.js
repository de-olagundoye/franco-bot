const child_process = require('child_process');
const path = require('path');
const _ = require('lodash');

const projectRoot = path.resolve(`${__dirname}/..`);
const nginxConfigFile = path.join(projectRoot, 'nginx/botserver.conf');

function showHelp() {
    console.log('Must specify start or stop');
}

function startNginx() {

}

function stopNginx() {

}

function processCommandlineArgs(args) {
    if (args.length <= 0) {
        console.error('need an argument (start|stop)');
        process.exit(1);
    }

    const command = args[0];
    
    switch (command) {
        case 'start':
            startNginx();
            break;

        case 'stop':
            stopNginx();
            break;

        default:
            showHelp();
            break;
    }
}
