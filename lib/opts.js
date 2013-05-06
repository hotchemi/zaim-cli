var puts        = console.log
  , values      = {}
  , args        = {}
  , argv        = []
  , errors      = []
  , descriptors = {opts:[], args:[]};

require('colors');

exports.add = function (options, namespace) {
  for (var i=0; i<options.length; i++) {
    options[i].namespace = namespace;
    descriptors.opts.push(options[i]);
  }
};

exports.parse = function (options, params) {

  if (params === true) {
    params = [];
  } else if (!params) {
    params = [];
  } else {
    for (var i=0; i<params.length; i++) {
      descriptors.args.push(params[i]);
    }
  }

  for (var i=0; i<options.length; i++) {
    descriptors.opts.unshift(options[i]);
  }
  options = descriptors.opts;

  var checkDup = function (opt, type) {
    var prefix = (type == 'short')? '-': '--';
    var name = opt[type];
    if (!opts[prefix + name]) {
      opts[prefix + name] = opt;
    } else {
      if (opt.namespace && !opts[prefix + opt.namespace + '.' + name]) {
        opts[prefix + opt.namespace + '.' + name] = opt;
        for (var i=0; i<descriptors.opts.length; i++) {
          var desc = descriptors.opts[i];
          if (desc.namespace == opt.namespace) {
            if (type == 'long' && desc.long == opt.long) {
                descriptors.opts[i].long = opt.namespace + '.' + opt.long;
            } else if (type == 'short') {
              delete descriptors.opts[i].short;
            }
          }
        }
      } else {
        puts('Conflicting flags: ' + prefix + name + '\n');
        puts(helpString());
        process.exit(1);
      }
    }
  };

  var opts = {};
  for (var i=0; i<options.length; i++) {
    if (options[i].short) checkDup(options[i], 'short');
    if (options[i].long) checkDup(options[i], 'long');
  }

  for (var i=2; i<process.argv.length; i++) {
    var inp = process.argv[i];
    if (opts[inp]) {
      // found a match, process it.
      var opt = opts[inp];
      if (!opt.value) {
        if (opt.callback) opt.callback(true);
        if (opt.short) values[opt.short] = true;
        if (opt.long) values[opt.long] = true;
      } else {
        var next = process.argv[i+1];
        if (!next || opts[next]) {
          var flag = opt.short || opt.long;
          errors.push('Missing value for option: '.red + flag.red);
          if (opt.short) values[opt.short] = true;
          if (opt.long) values[opt.long] = true;
        } else {
          if (opt.callback) opt.callback(next);
          if (opt.short) values[opt.short] = next;
          if (opt.long) values[opt.long] = next;
          i++;
        }
      }
    } else {
      if (inp[0] == '-') {
        puts('Unknown option: ' + inp.red);
        if (opts['--help']) puts('Try ' + '--help'.yellow);
        process.exit(1);
      } else {
        argv.push(inp);
        var arg = params.shift();
        if (arg) {
          args[arg.name] = inp;
          if (arg.callback) arg.callback(inp);
        }
      }
    }
  }
  for (var i=0; i<options.length; i++) {
    var flag = options[i].short || options[i].long;
    if (options[i].required && !exports.get(flag)) {
      errors.push('Missing required option: ' + flag);
    }
  }
  for (var i=0; i<params.length; i++) {
    if (params[i].required && !args[params[i].name]) {
      errors.push('Missing required argument: ' + params[i].name);
    }
  }
  if (errors.length) {
    for (var i=0; i<errors.length; i++) puts(errors[i]);
    puts('Try ' + '--help'.yellow);
    process.exit(1);
  }
};

exports.get = function (opt) {
  return values[opt] || values['-' + opt] || values['--' + opt];
};

exports.args = function () {
  return argv;
};

exports.arg = function (name) {
  return args[name];
};

exports.help = function () {
  puts(helpString());
  process.exit(0);
};

var helpString = function () {
  var str = 'Usage: zaim';
  if (descriptors.opts.length) str += ' [options...] <value>\n\n';
  str += 'Options:';
  if (descriptors.args.length) {
    for (var i=0; i<descriptors.args.length; i++) {
      if (descriptors.args[i].required) {
        str += ' ' + descriptors.args[i].name;
      } else {
        str += ' [' + descriptors.args[i].name + ']';
      }
    }
  }
  str += '\n';
  for (var i=0; i<descriptors.opts.length; i++) {
    var opt = descriptors.opts[i];
    if (opt.description) str += (opt.description).yellow + '\n';
    var line = '';
    if (opt.short && !opt.long) line += '-' + opt.short;
    else if (opt.long && !opt.short) line += '--' + opt.long;
    else line += '-' + opt.short + ', --' + opt.long;
    if (opt.value) line += ' <value>';
    if (opt.required) line += ' (required)';
    str += '    ' + line + '\n';
  }
  return str;
};