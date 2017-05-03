const express = require('express');
const config = require('./config');
const app = express();

app.use(express.static(__dirname + '/views'));
app.set ('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('hello world');
});

app.get('/test', (req, res) => {
	res.render('test');
})

app.listen(config.port);
