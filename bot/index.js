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

const responseFunctions = {
    'search': search,
    'greeting': greeting,
    'unknown': unknown
}

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
    const prevSearchTerm = _.get(req, 'body.searchTerm', '');
    const searchTerm = text + ' ' + prevSearchTerm;
    let token = _.get(req.cookies, 'urbnAuthToken');
    
    const client = new wit({accessToken: witToken});
    const witAIData = await client.message(searchTerm, {});
    const responseType = determineResponseType(witAIData);

    if (!token) {
        tokenResponse = await tokenClient.getGuestToken();
    } else {
        tokenResponse = token;
    }
    console.log('token response ', JSON.stringify(tokenResponse, null, 2));
    token = _.get(tokenResponse, 'authToken');
    res.send(await responseFunctions[responseType](witAIData,res,token,text));     
});

function determineResponseType(witAIData) {
    if(_.get(witAIData, 'entities.greetings')) {
        return 'greeting';
    } else if(_.get(witAIData, 'entities.local_search_query')) {
        return 'search';
    } else {
        return 'unknown';
    }
}

async function greeting(witAIData) {
    return generateClientResponse('Hello, what are you looking for today?');
}

async function search(witAIData, res, token, searchValue) {

    let urbnQueryItems = [];
    let searchQuery = _.get(witAIData, 'entities.local_search_query');

    searchQuery.forEach((item) =>{
        urbnQueryItems.push(item.value);
    })

    const searchTerm = _.get(witAIData, 'entities.local_search_query.0.value')
    if(_.get(witAIData, 'entities.intent', false)) {
        let catalogSearchResults;
        let returnedProducts;

        try{
            catalogSearchResults = await catalogSearch(witAIData,res,token,searchTerm);
            let jsonResult = JSON.parse(catalogSearchResults);
            let records = jsonResult.records;

            records.forEach((record) => {
                recordMeta = _.get(record, 'allMeta.tile.product');
                returnedProducts.push(recordMeta);
            })
        } catch(event) {
            console.log(event);
        }
        return generateClientResponse('Here are some products', searchTerm, catalogSearchResults, witAIData)
    }
    else {
        return generateClientResponse('Please enter a color', searchTerm, {}, witAIData);
    }
}

async function unknown(witAIData, res, token, searchValue) {
    return generateClientResponse("I'm sorry.  I don't understand.  Can you simplify your response?");
}

async function refinement(witAIData, res, token, searchValue) {
    return generateClientResponse('Heres the product in ')
}

function generateClientResponse(textResponse = '', searchValue = '', additionalData = {}, witAIData = {}) {
    return {
        textResponse,
        searchValue,
        additionalData,
        witAIData
    }
}

async function catalogSearch(data,res,token,searchTerm) {
    res.cookie('urbnAuthToken', token);
    return await catalogClient.search(searchTerm, token);
}

app.listen(config.port);
