const express = require('express');
const bodyParser = require('body-parser');
const wit = require('node-wit').Wit;
const config = require('./config');
const witToken = config.witai.serverAccessToken;
const app = express();
const _ = require('lodash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.set ('view engine', 'ejs');

app.get('/bot/talk', (req, res) => {
    res.render('test');
});

app.post('/bot/talk', (req, res) => {
    const text = req.body.text;

    const client = new wit({accessToken: witToken});
    client.message(text, {})
        .then((data) => {
            res.send(search(data, res));
        })
        .catch(console.error);
});

function search(data, res) {
    if(_.get(data, 'entities.intent', false)) {
        return data;
    }
    else {
        return res.render('color');
    }
}

app.listen(config.port);
