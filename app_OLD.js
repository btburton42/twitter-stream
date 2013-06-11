var app = require('http').createServer(handler),
    io = require('socket.io').listen(app),
    fs = require('fs'),
    sys = require('sys'),
    twitter = require('twitter');

app.listen(1337);

var twit = new twitter({
  consumer_key: '7jwv7yRsa6EBl8NphDq3LQ',
  consumer_secret: 'fILH404rgPXwES06AOyp1FtVGQm1fvU6NVygoXvLuU',
  access_token_key: '15829179-O42nyuRC54CLOKE81DJQBLIr6zQDc8RVIv0Dp3lNs',
  access_token_secret: 'VCZIBEfJ7ANXXIwSuu4bE9OPsQbZSPN7s1DKt258'
});

function handler (req, res) {
  fs.readFile(__dirname + '/index.html',
  function (err, data) {
    if (err) {
      res.writeHead(500);
      return res.end('Error loading index.html');
    }

    res.writeHead(200);
    res.end(data);
  });
}


var twee = io.of('tweet');
var watches = ['fiction'];


twit.stream('statuses/filter', { track: watches }, function(stream) {
  stream.on('data', function (data, pic, screen_name, user, text) {
    io.sockets.emit('tweet', data.user.profile_image_url, data.user.screen_name, data.user.name, data.text);
    console.log('.');
  });
});


(function() {
  $('#adder').click(function(){
    console.log('')
    watches.push(document.getElementById("input#track").value);
    console.log(watches);
  $('input#track').value = "";
  });

});
