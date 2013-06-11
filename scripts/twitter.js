window.onload = function() {

  var topics = [];
  var topicButtons = document.getElementById("topic-buttons");
  var topicButtonInputs = document.getElementById("topic-buttons").childNodes;
  var addButton = document.getElementById("adder");
  var field = document.getElementById("field");
  var socket = io.connect('/');
  var tweets = document.getElementById('tweets');

  // socket.on('topic', function(field){
  //   if (field.topic) {
  //   topics.push(field.topic);
  //   console.log(topics);
  //     topicButtons.innerHTML = topicButtons.innerHTML + '|' + field.topic;
  //   } else {
  //   console.log("There is a problem: " + data);
  // }
  // })

  socket.on('tweet', function (data, watches) {
    //print tweets
    if ((watches != "") && (!data.disconnect)) {
      console.log(data);
    tweets.innerHTML = data.text + '<br>' + tweets.innerHTML;
    }

    //create button array
    if (topics.length != watches.length) {
      topics = [];
      topicButtons.innerHTML = "";
      topics = watches;
      console.log(watches);
      topics.forEach(function(topic){
        topicButtons.innerHTML = topicButtons.innerHTML + '<input type="button" class="topics" value="' + topic + '">';
      });
    }

  });

  // socket.on('tweet', function (data) {
  // tweets.innerHTML = tweets.innerHTML +'<br clear="all"><div class="tweet"><div class="name"><a href="http://twitter.com/' + screen_name + '" target="_blank""><img src="' + pic + '"></a></div><div class="data">' + data + '</div></div><br clear="all">';
  // });

  addButton.onclick = addTopic = function() {
    if (field.value != "") {
    var text = field.value;
    socket.emit('send', {topic: text});
    field.value = "";      
    }    
  };

  // $('#topic-buttons').click(function(event){
  //      var $source = $(event.target);
  //      console.log($source);
  // });
  $("#topic-buttons").on("click", "input", function(event){
    var removeVar = $(this).context.value;
    socket.emit('remove', {topic: removeVar});
  });



};

(function() {
  //jade 
  $( "#topicList" ).html(
      $( "#topicTemplate" ).render( topics )
  );
})