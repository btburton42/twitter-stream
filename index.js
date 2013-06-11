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
  consumer_key: '7jwv7yRsa6EBl8NphDq3LQ',
  consumer_secret: 'fILH404rgPXwES06AOyp1FtVGQm1fvU6NVygoXvLuU',
  access_token_key: '15829179-O42nyuRC54CLOKE81DJQBLIr6zQDc8RVIv0Dp3lNs',
  access_token_secret: 'VCZIBEfJ7ANXXIwSuu4bE9OPsQbZSPN7s1DKt258'
});


// var twee = io.of('tweet');
var watches = [];

var io = require('socket.io').listen(app.listen(port));

//remove annoying debug data msg.
io.set('log level', 1); 

io.sockets.on('connection', function(socket){

  socket.on('send', function(field){
    io.sockets.emit('topic', field);
    watches.push(field.topic);
    console.log(watches.length);
    console.log('outside ' + watches);

    if (watches != ""){
      twit.stream('statuses/filter', { track: watches }, function(stream) {
        console.log('inside ' + watches);
        stream.on('data', function (data) {
            io.sockets.emit('tweet', data, watches);
            // console.log('.');
            // console.log(watches.length);
            // console.log(watches + ' ' + watches.length);
        });
      });
    }
  });

  socket.on('remove', function(field){
    var idx = watches.indexOf(field.topic); 
    if(idx!=-1) {
      watches.splice(idx, 1);
    }
    if (watches != ""){
    twit.stream('statuses/filter', { track: watches }, function(stream) {
      console.log('2nd inside ' + watches);
      stream.on('data', function (data) {
        io.sockets.emit('tweet', data, watches);
      });
    });
    } else {
      io.sockets.emit('tweet', [], []);
    }
  });

});




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
