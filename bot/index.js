const express = require('express');
const bodyParser = require('body-parser');
const wit = require('node-wit').Wit;
const config = require('./config');
const witToken = config.witai.serverAccessToken;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.set ('view engine', 'ejs');

app.get('/bot/talk', (req, res) => {
    res.render('test');
})

app.post('/bot/talk', (req, res) => {
    const text = req.body.text;
    res.send('you sent "' + text + '".');

    const client = new wit({accessToken: witToken});
    client.message(text, {})
        .then((data) => {
        console.log('wit.ai response: ' + JSON.stringify(data));
    })
    .catch(console.error);
})

app.listen(config.port);
