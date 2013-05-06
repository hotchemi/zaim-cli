/**
 * Module dependencies.
 */
var VERSION = 'Zaim CLI v0.0.15',
  opts = require('./opts'),
  colors = require('colors'),
  puts = console.log,
  exit = process.exit;

/**
 * Write title and help.
 */
module.exports.writeTitle = function() {
  puts("┌─┐┌─┐┌┐┌──┐".yellow);
  puts("├─│├─│├┤││││".yellow);
  puts("│─┤│││││││││".yellow);
  puts("└─┘└─┘└┘└┴┴┘".yellow);
  puts(VERSION.yellow);
  puts("");
  puts(opts.help());
};

/**
 * Convert first letter to uppercase.
 *
 * @param {string} text
 * @return {string} converted text
 */
module.exports.toFirstUpperCase = function(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * オブジェクトをコンソールに整形して出力｡
 */
module.exports.formatForObj = function(obj) {
  Object.keys(obj).forEach(function(key) {
    puts(key + " = " + obj[key].yellow);
  });
};

/**
 * オブジェクトの配列をコンソールに整形して出力｡
 */
module.exports.formatForArray = function(array) {
  array.forEach(function(value, i) {
    var result = "";
    Object.keys(array[i]).forEach(function(key) {
      result += key + " = " + array[i][key].yellow + " ";
    });
    puts(result);
  });
};

/**
 * 金額をコンソールに整形して出力｡
 */
module.exports.formatForMoney = function(array) {
  array.forEach(function(value, i) {
    var result = "";
    Object.keys(array[i]).forEach(function(key) {
      if (key !== 'user_id' && key !== 'created' && key !== 'currency_code'
        && key !== 'active' && key !== 'place_service')
      result += key + " = " + array[i][key].yellow + " ";
    });
    puts(result);
  });
};