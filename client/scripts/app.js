// YOUR CODE HERE:
//https://api.parse.com/1/classes/chatterbox
var app = {
  init: function(){
    $(".username").on("click", app.addFriend);
    $("#send .submit").on("submit", app.handleSubmit);
    app.fetch();
  },
  server: 'https://api.parse.com/1/classes/chatterbox',
  send: function(message){
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: this.server,
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message');
      }
    });
  },
  fetch: function(){
    $.ajax({
      url: this.server,
      type: 'GET',
      data: 'jsonp',
      contentType: 'application/json',
      success: function (data) {
        app.args = data.results;
      },
      error: function (data) {
        console.error('chatterbox: Failed to retrieve');
      }
    });
  },
  userList: {},
  objIdList: {},
  roomList: {},
  addMessage: function(message){
    if(app.objIdList[message.objectId] === undefined &&
                      message.username !== undefined &&
                          message.text !== undefined &&
                      message.roomname !== undefined){
      var name = app.rejector(message.username);
      var post = app.rejector(message.text);
      var room = app.rejector(message.roomname)
      var $chatbox = $('<div class="chatbox"></div>');
      $chatbox.append('<div class="username">'+name+' :</div>');
      $chatbox.append('<div class="message">'+post+'</div>');
      $chatbox.append('<div class="room">'+room+' '+message.objectId+'</div>');
      $('#chats').prepend($chatbox);
      // if(app.userList[name] === undefined && name !== undefined ){  
      //   $('.users').append('<option value='+name+'>'+name+'</option>')
      //   app.userList[name] = name;
      // }
      app.addRoom(room);
      app.addFriend(name);
      app.objIdList[message.objectId] = message.objectId;
    }    // $(".username").on( "click", function(){app.addFriend()} );
  },

  addRoom: function(roomName){
    if(roomName && app.roomList[roomName] === undefined){
      $("#roomSelect").append('<option value='+roomName+'>'+ roomName +'</option>');
      app.roomList[roomName] = roomName;
    }
  },

  addFriend: function(name){
    if(app.userList[name] === undefined && name !== undefined ){  
        $('.users').append('<option value='+name+'>'+name+'</option>')
        app.userList[name] = name;
      }
  },
  handleSubmit: function(e){
    e.preventDefault();
    var message = {};
    message.username = window.location.search.split('=')[1];

    //get inputs
    message.text = $("#message").val();
    message.roomname = $("#roomSelect").val();
    //place into object

    app.send(message)
  },
  clearMessages: function(){
    var myNode = document.getElementById("chats");
    while (myNode.firstChild) {
      myNode.removeChild(myNode.firstChild);
    }
  },
  rejector: function(string){
    return string.replace(/[<>&%*+^$;{}()|[\]\\]/g, "");
  }
  
}
// var userList = {},

app.init();
setInterval(function(){
    app.fetch();
    for(var i = 0; i<app.args.length; i++){
      app.addMessage(app.args[i]);
    }
  }, 5000)




