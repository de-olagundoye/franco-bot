const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const wit = require('node-wit').Wit;
const config = require('./config');
const TokenClient = require('./a15Clients').TokenClient;
const CatalogClient = require('./a15Clients').CatalogClient;

const witToken = config.witai.serverAccessToken;
const tokenClient = new TokenClient(`${config.baseURL}${config.a15.urls.token}`);
const catalogClient = new CatalogClient(`${config.baseURL}${config.a15.urls.catalog}`);

const app = express();

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/views'));
app.set ('view engine', 'ejs');

app.get('/bot/talk', async (req, res) => {
    res.render('test');
});

app.post('/bot/talk', async (req, res) => {
    const text = req.body.text;
    let token = _.get(req.cookies, 'urbnAuthToken');
    
    const client = new wit({accessToken: witToken});
    const witAIData = await client.message(text, {});
    if (!token) {
        tokenResponse = await tokenClient.getGuestToken();
    } else {
        tokenResponse = token;
    }
    console.log('token response ', JSON.stringify(tokenResponse, null, 2));
    token = _.get(tokenResponse, 'authToken');
    res.send(await search(witAIData,res,token,text));     
});

async function search(witAIData, res, token, searchValue) {
    if(_.get(witAIData, 'entities.intent', false)) {
        let catalogSearchResults;
        try{
            catalogSearchResults = await catalogSearch(witAIData,res,token,searchValue);
        } catch(event) {
            console.log(event);
        }
        return generateClientResponse('Here are some products', searchValue, catalogSearchResults, witAIData)
    }
    else {
        return generateClientResponse('Please enter a color', {}, searchValue, witAIData);
    }
}

function generateClientResponse(textResponse = '', searchValue = '', additionalData = {}, witAIData = {}) {
    return {
        textResponse,
        searchValue,
        additionalData,
        witAIData
    }
}

async function catalogSearch(data,res,token,text) {
    res.cookie('urbnAuthToken', token);
    return await catalogClient.search(text, token);
}

app.listen(config.port);

// .then((data) => {
//             const witResponseData = data;
//             console.log('wit.ai response: ' + JSON.stringify(witResponseData));

//             if (!token) {
//                 return tokenClient.getGuestToken();
//             } else {
//                 return token;
//             }
//         })
//         .then((tokenResponse) => {
//             console.log('token response ', JSON.stringify(tokenResponse, null, 2));
//             const token = _.get(tokenResponse, 'authToken');

//             res.cookie('urbnAuthToken', token);
//             return catalogClient.search(text, token);
//         })
//         .then((searchResults) => {
//             const resultsAsString = JSON.stringify(searchResults, null, 2);
//             console.log('search results ', resultsAsString);
//             res.render('test');
//         })
//         .catch(console.error);
