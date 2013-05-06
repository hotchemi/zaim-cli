zaim-cli [![NPM version](https://badge.fury.io/js/zaim-cli.png)](http://badge.fury.io/js/zaim-cli)
=======

CLI based Zaim client.

##Install
Install from npm with global option:

    $ npm install -g zaim-cli

##Uninstall
    $ npm uninstall -g zaim-cli

##Usage
```sh
$ zaim

┌─┐┌─┐┌┐┌──┐
├─│├─│├┤││││
│─┤│││││││││
└─┘└─┘└┘└┴┴┘
Zaim CLI v0.0.15

Usage: zaim [options...] <value>

Options:
Show user information
    -u, --user
Create new [pay] or [income]
    -n, --new <value>
Show the list of currencies
    -m, --money
Show the list of payment categories
    -p, --pay
Show the list of income categories
    -i, --income
Show the list of payment genres
    -g, --genres
Show the list of currencies
    -c, --currencies
Reset access token and secret
    -r, --reset
Show version information
    -v, --version
Show help this message
    -h, --help
```

## ToDo
* moneyをオプション付きで取得できるように
* create <pay or income>を細かいオプション付けられるように

## Dependencies
* [zaim.js](https://npmjs.org/package/zaim)

## Release Note
* 2013/05/06 0.0.15 release.