/**
 * Module dependencies.
 */
var opts = require('./opts'),
  colors = require('colors'),
  oauth = require('./oauth'),
  readline = require('readline').createInterface(process.stdin, process.stdout),
  fs = require('fs'),
  writeHelper = require('./writeHelper');

var VERSION = 'Zaim CLI v0.0.1',
  tokenFile = require('../config/zaim.config').token_file,
  puts = console.log,
  exit = process.exit;

/**
 * Command line option.
 */
var options = [
  {
    short: 'h',
    long: 'help',
    description: 'Show help this message',
    callback: function() {
      writeHelper.writeTitle();
      exit();
    }
  },
  {
    short: 'v',
    long: 'version',
    description: 'Show version information',
    callback: function() {
      puts(VERSION.yellow);
      exit();
    }
  },
  {
    short: 'r',
    long: 'reset',
    description: 'Reset access token and secret',
    callback: function() {
      readline.question("Reset access token and secret? (y/n) ".yellow, function(answer) {
        if (answer === 'y') {
          fs.unlink(tokenFile, function (err) {
            puts(err ? 'reset failed.'.red : 'reset success.'.yellow);
            readline.close();
            exit();
          });
        } else {
          readline.close();
          exit();
        }
      });
    }
  },
  {
    short: 'c',
    long: 'currencies',
    description: 'Show the list of currencies',
    callback: function() {
      oauth.createZaimInstance(function(err, zaim) {
        zaim.getCurrencies(function(data, err) {
          writeHelper.formatForArray(data.currencies);
          exit();
        });
      })
    }
  },
  {
    short: 'g',
    long: 'genres',
    description: 'Show the list of payment genres',
    callback: function() {
      oauth.createZaimInstance(function(err, zaim) {
        zaim.getPayGenres({lang: 'ja'}, function(data, err) {
          writeHelper.formatForArray(data.genres);
          exit();
        });
      })
    }
  },
  {
    short: 'i',
    long: 'income',
    description: 'Show the list of income categories',
    callback: function() {
      oauth.createZaimInstance(function(err, zaim) {
        zaim.getIncomeCategories({lang: 'ja'}, function(data, err) {
          writeHelper.formatForArray(data.categories);
          exit();
        });
      })
    }
  },
  {
    short: 'p',
    long: 'pay',
    description: 'Show the list of payment categories',
    callback: function(value) {
      oauth.createZaimInstance(function(err, zaim) {
        zaim.getPayCategories({lang: 'ja'}, function(data, err) {
          writeHelper.formatForArray(data.categories);
          exit();
        });
      })
    }
  },
  {
    short: 'm',
    long: 'money',
    description: 'Show the list of currencies',
    callback: function() {
      oauth.createZaimInstance(function(err, zaim) {
        zaim.getMoney(function(data, err) {
          writeHelper.formatForMoney(data.money);
          exit();
        });
      })
    }
  },
  {
    short: 'n',
    long: 'new',
    description: 'Create new [pay] or [income]',
    value: true,
    callback: function(value) {
      oauth.createZaimInstance(function(err, zaim) {

        if (value === 'pay') {
          zaim.getPayCategories({lang: 'ja'}, function(data, err) {
            writeHelper.formatForArray(data.categories);
            readline.question("category_id : ", function(category_id) {
              zaim.getPayGenres({lang: 'ja'}, function(data, err) {
                writeHelper.formatForArray(data.genres);
                readline.question("genre_id : ", function(genre_id) {
                  readline.question("price : ", function(price) {
                    zaim.createPay({
                        category_id: category_id,
                        genre_id: genre_id,
                        price: -price
                      },
                      function(data, err) {
                        if (err) {
                          puts(err);
                          puts(data);
                        }
                        puts("pay post success!".cyan);
                        readline.close();
                        exit();
                      });
                  });
                });
              });
            });
          });
        } else if (value ==="income") {
          zaim.getPayCategories({lang: 'ja'}, function(data, err) {
            writeHelper.formatForArray(data.categories);
            readline.question("category_id : ", function(category_id) {
              readline.question("price : ", function(price) {
                zaim.createIncome({
                    category_id: category_id,
                    price: +price
                  },
                  function(data, err) {
                    if (err) {
                      throw err;
                    }
                    puts("income post success!".cyan);
                    readline.close();
                    exit();
                  });
              });
            });
          });
        } else {
          puts("Invalid value, put 'pay' or 'income'.".red);
          exit();
        }
      });
    }
  },
  {
    short: 'u',
    long: 'user',
    description: 'Show user information',
    callback: function() {
      oauth.createZaimInstance(function(err, zaim) {
        zaim.getCredentials(function(data, err) {
          writeHelper.formatForObj(data.user);
          exit();
        });
      })
    }
  }
];

opts.parse(options, true);
if (process.argv.length === 2) {
  writeHelper.writeTitle();
  exit();
}