'use strict';

/* jshint node:true */

var fs = require('fs'),
    path = require('path'),
    // I'm lazy, async is good.
    async = require('async'),
    files = process.argv.slice(2),
    list = {};

// Magic things is always bestest.
var pre = '// locale : '.length;

if (!files) {
  throw new Error('Oh noes, seems you have missed giving me something to work on.');
}

async.each(files, function(f, cb) {
  fs.readFile(f, {encoding: 'utf8'}, function (err, data) {
    if (err) {
      cb(err);
    }

    var base = path.basename(f, '.js'),
        lines = data.split('\n'),
        line = lines[1] || null;

    if (!line) {
      cb(new Error('Some of these lines are not like the others.'));
    }

    var idx = line.indexOf('(');
    if (idx === -1) {
      idx = line.length;
    }

    var name = line.substr(pre, idx - pre - 1);

    list[base] = name;

    cb();
  });
}, function (err) {
  if (err) {
    throw err;
  }

  console.log(JSON.stringify(list, true, '  ').replace(/\"/g, '\''));
});
