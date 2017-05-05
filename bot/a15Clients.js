const request = require('request-promise-native');
const _ = require('lodash');

class TokenClient {
    constructor(url) {
        this.basePath = url;
    }

    getGuestToken() {
        const route = {
            method: 'POST',
            uri: `${this.basePath}/auth`,
            json: true
        };

        return request(route);
    }
}

class CatalogClient {
    constructor(url) {
        this.basePath = url;
    }

    search(searchText, token) {
        const poolId = 'US_DIRECT';
        const route = {
            uri: `${this.basePath}/pools/${poolId}/products/searches`,
            headers: {
                'X-Urbn-Auth-Token': _.get(token, 'authToken'),
                'X-Urbn-Language': 'en-US',
                'X-Urbn-Currency': 'USD',
                'X-Urbn-Channel': 'web'
            },
            qs: {
                q: searchText
            }
        };

        return request(route);
    }
}

module.exports = {
    TokenClient: TokenClient,
    CatalogClient: CatalogClient
};

