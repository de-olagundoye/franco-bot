const child_process = require('child_process');
const path = require('path');

const projectRoot = path.resolve(`${__dirname}/..`);
const nginxConfigFile = path.join(projectRoot, 'nginx/botserver.conf');

function showHelp() {
    console.log('Must specify start or stop');
}

function startNginx() {
    child_process.exec(`sudo nginx -c ${nginxConfigFile}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Could not start nginx: ${err}`);
            process.exit(2);
        }
    });
}

function stopNginx() {
    child_process.exec('sudo nginx -s stop', (err, stdout, stderr) => {
        if (err) {
            console.error(`Could not stop nginx: ${err}`);
            process.exit(3);
        }
    });
}

function processCommandlineArgs(args) {
    if (args.length <= 0) {
        console.error('need an argument (start|stop)');
        process.exit(1);
    }

    const command = args[args.length - 1];
    
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

processCommandlineArgs(process.argv);

