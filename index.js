var express = require("express");
    app = express(),
    fs = require('fs'),
    sys = require('sys'),
    twitter = require('twitter'),
    sass = require('sass'),
    requirejs = require('requirejs'),
    port = 1337;


//jade
app.set('views', __dirname + '/tpl');
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.use(express.static(__dirname + '/scripts'));

// //requirejs
// requirejs.config({
//     baseUrl: 'scripts',
//     nodeRequire: require
// });


//routing
app.get("/", function(req, res){
  res.render("page");
});

//twitter

var twit = new twitter({
  consumer_key: 'CONSUMER_KEY',
  consumer_secret: 'CONSUMER_SECRET',
  access_token_key: 'ACCESS_TOKEN_KEY',
  access_token_secret: 'ACCESS_TOKEN_SECRET'
});

// var twee = io.of('tweet');
var watches = [];

var io = require('socket.io').listen(app.listen(port));

//remove annoying debug data msg.
// io.set('log level', 1); 

io.sockets.on('connection', function(socket){

  socket.on('send', function(field){
    io.sockets.emit('topic', field);
    if (field.topic) {
    watches.push(field.topic);
    }
    if (field.remTopic) {
      var idx = watches.indexOf(field.remTopic); 
      if(idx!=-1) {
        watches.splice(idx, 1);
      }  
    }
    console.log(watches.length);
    console.log('outside ' + watches);

    if (watches.length != 0){
      twit.stream('statuses/filter', { track: watches }, function(stream) {
        console.log('inside ' + watches);
        stream.on('data', function (data) {
            io.sockets.emit('tweet', data, watches);
            console.log('data ' + data);
            console.log("watches.length " + watches.length);
            // console.log('.');
            // console.log(watches.length);
            // console.log(watches + ' ' + watches.length);
        });
      });
    } else {
      console.log('*********************  empty *********************  ');
      data = [];
    }
  });

  // socket.on('remove', function(field){
  //   if (watches != ""){
  //   twit.stream('statuses/filter', { track: watches }, function(stream) {
  //     console.log('2nd inside ' + watches);
  //     stream.on('data', function (data) {
  //       io.sockets.emit('tweet', data, watches);
  //     });
  //   });
  //   } else {
  //     io.sockets.emit('tweet', [], []);
  //   }
  // });
});

console.log("connected on port " + port);




// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }

//     res.writeHead(200);
//     res.end(data);
//   });
// }
