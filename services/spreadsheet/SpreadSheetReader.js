/**
 * Created by Vivek Aditya on 19/12/16.
 */

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials '../sheets.token.json'
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
var TOKEN_PATH = './sheets.token.json';

module.exports.readSheet = function (sheetId,range,callback) {
    var content
    try{
        content = fs.readFileSync('./client_secret.json', 'utf8');
        authorize(JSON.parse(content), function (auth) {
            var sheets = google.sheets('v4');
            sheets.spreadsheets.values.get({
                auth: auth,
                spreadsheetId: sheetId,
                range: range,
            }, function(err, response) {
                if (err) {
                    console.log('The Spread sheet API returned an error: ' + err);
                    return;
                }
                var data = {};
                var rows = response.values;
                if (rows.length == 0) {
                    console.log('No data found.');
                } else {
                    for (var i = 0; i < rows.length; i++) {
                        var row = rows[i];
                        var key = row.shift();
                        row = row.filter(Boolean)
                        data[key] = row;
                    }
                }
                callback(data);
            });
        });
    }catch(err){
        console.log(err)
        throw err;
    }
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    var clientSecret = credentials.installed.client_secret;
    var clientId = credentials.installed.client_id;
    var redirectUrl = credentials.installed.redirect_uris[0];
    var auth = new googleAuth();
    var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
    // Check if we have previously stored a token.
    var token;
    try{
        token = fs.readFileSync(TOKEN_PATH,'utf8');
        oauth2Client.credentials = JSON.parse(token);
        callback(oauth2Client);
    }catch(err) {
        getNewToken(oauth2Client, callback);
    }
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
    var authUrl = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES
    });
    console.log('Authorize this app by visiting this url: ', authUrl);
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    rl.question('Enter the code from that page here: ', function(code) {
        rl.close();
        oauth2Client.getToken(code, function(err, token) {
            if (err) {
                console.log('Error while trying to retrieve access token', err);
                return;
            }
            oauth2Client.credentials = token;
            storeToken(token);
            callback(oauth2Client);
        });
    });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
    try {
        fs.mkdirSync(TOKEN_DIR);
    } catch (err) {
        if (err.code != 'EEXIST') {
            throw err;
        }
    }
    fs.writeFile(TOKEN_PATH, JSON.stringify(token));
    console.log('Token stored to ' + TOKEN_PATH);
}