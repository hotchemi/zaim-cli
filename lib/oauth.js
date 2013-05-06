/**
 * Module dependencies.
 */
var colors = require('colors'),
  fs = require('fs'),
  Zaim = require('zaim'),
  commander = require('commander'),
  configFile = require('../config/zaim.config'),
  tokenFile = configFile.token_file,
  puts = console.log;

/**
 * Execute OAuth.
 *
 * @param callback
 */
function authenticate(callback) {
  var zaim = new Zaim({
    consumerKey: configFile.consumer_key,
    consumerSecret: configFile.consumer_secret,
    callback: configFile.callback
  });

  puts('You are not logged in, open printed URL and input displayed oauth_verifier.'.yellow);

  zaim.getAuthorizationUrl(function(url) {
    puts(url.cyan);
    commander.prompt('Input oauth_verifier: ', function(pin) {
      zaim.getOAuthAccessToken(pin, function(err, token, secret) {
        if (err) {
          throw err;
        }
        callback(err, token, secret);
      });
    });
  });
}

/**
 * Execute OAuth and return zaim instance.
 *
 * @param callback
 */
module.exports.createZaimInstance = function(callback) {

  fs.readFile(tokenFile, 'utf8', function(err, data) {
    if (err) {
      authenticate(function(err, token, secret) {

        var jsonString = JSON.stringify({
          access_token: token,
          access_token_secret: secret
        }, null, 2);

        fs.writeFile(tokenFile, jsonString, 'utf8', function(err) {
          puts('\nLogin Success! access token and secret saved.'.yellow);

          callback(err, new Zaim({
            consumerKey: configFile.consumer_key,
            consumerSecret: configFile.consumer_secret,
            accessToken: token,
            accessTokenSecret: secret
          }));
        });
      });
      return;
    }

    var token = JSON.parse(data);
    callback(null, new Zaim({
      consumerKey: configFile.consumer_key,
      consumerSecret: configFile.consumer_secret,
      accessToken: token.access_token,
      accessTokenSecret: token.access_token_secret
    }));
  });
};