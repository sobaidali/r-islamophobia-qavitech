/*
* This service retrieves access token from 
* microsoft and then instantiates the dynamics web-api 
* service
*/

const adal = require('adal-node');
const DynamicsWebApi = require("dynamics-web-api");


const DynamicsConnector = (tenantId, resource, clientId, username, password) => {


    this.acquireTokens = (dynamicsCallback) => {
        console.log('token');

        const adalCallback = (error, token) => {

            if (!error) {
                //call DynamicsWebApi callback only when a token has been retrieved
                dynamicsCallback(token);
                console.log('token:', token)
            }
            else {
                console.log('Token has not been retrieved. Error: ' + error.stack);
            }

        }

        this.adalContext.acquireTokenWithUsernamePassword(this.resource, this.username, this.password, this.clientId, adalCallback);
    }

    this.authorityUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/token`;
    this.resource = `https://${resource}/`;
    this.apiUrl = resource;
    this.clientId = clientId;
    this.username = username;
    this.password = password;


    //create DynamicsWebApi object
    this.dynamicsWebApi = new DynamicsWebApi({
        webApiUrl: `https://${this.apiUrl}/api/data/v9.0/`,
        onTokenRefresh: this.acquireTokens
    });

    this.adalContext = new adal.AuthenticationContext(this.authorityUrl);

    return this;


}

module.exports = DynamicsConnector;