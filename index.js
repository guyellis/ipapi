var async = require('async');
var express = require('express');
var fs = require('fs');
var MMDBReader = require('mmdb-reader');
var path = require('path');
var request = require('request');
var zlib = require('zlib');
var validator = require('validator');

var cityUrl = 'http://geolite.maxmind.com/download/geoip/database/GeoLite2-City.mmdb.gz';
var dbFile = path.join(__dirname, 'db/GeoLite2-City.mmdb');
var reader;

var app = express();

app.get('/ip', function (req, res) {
  console.log('Invalid request:', req.path);
  return res.status(404).send({
    error: 'Missing IP address. Usage example: /ip/8.8.8.8'
  });
});

app.get('/ip/:v4', function (req, res) {
  var v4 = req.params.v4;
  if(!validator.isIP(v4, 4)) {
    return res.status(404).send({
      error: 'Not a valid v4 IP address: ' + v4
    });
  }
  console.log(Date(), '=>', v4);
  res.send(reader.lookup(v4));
});


// 1. Create "db" directory if it doesn't exist.
function createDbDir(callback) {
  var dir = path.join(__dirname, 'db');
  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
    console.log('Made dir:', dir);
  } else {
    console.log('Dir exists:', dir);
  }
  return callback();
}

// 2. Download DB file if not exist
function downloadDB(callback) {
  if (!fs.existsSync(dbFile)) {
    process.stdout.write('Downloading DB');
    var dotWriter = setInterval(function(){
      process.stdout.write('.');
    }, 1000);
    request.get({
      url: cityUrl,
      encoding: null
    }, function(err, response, body){
      clearInterval(dotWriter);
      if(err) { return callback(err); }
      console.log('\nDownloaded DB');
      console.log('Unzipping DB');
      zlib.gunzip(body, function(err, dezipped){
        if(err) { return callback(err); }
        fs.writeFile(dbFile, dezipped, function(err) {
          console.log('Unzipped DB');
          return callback(err);
        });
      });
    });
  } else {
    console.log('DB exists');
    return callback();
  }
}

// 3. Create MMDB reader
function createReader(callback) {
  reader = new MMDBReader(dbFile);
  console.log('DB reader created');
  callback();
}

async.waterfall([
  createDbDir,
  downloadDB,
  createReader
], function(err){
  if(err) {
    return console.log(err);
  }
  console.log('Listening on 3000');
  app.listen(3000);
});
