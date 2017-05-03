const express = require('express');
const config = require('./config');

const app = express();

app.get('/', (request, response) => {
    response.send('hello world');
});

app.listen(config.port);
