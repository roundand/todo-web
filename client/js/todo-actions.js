// initialise the connection
var initSocket = function() {
  var socket = io.connect();

  // new data, publish the results
  socket.on('update', function(data) {
    console.log('socket.io update: ' + JSON.stringify(data));
    PubSub.publish(Constants.dispatcher, {type: 'update', data: data});
  });

  // when calls succeed, publish the results
  socket.on('success', function(data) {
    console.log('socket.io success: ' + JSON.stringify(data));
    Actions.getTodoList();
  });

  // when calls fail, publish the results on a different channel
  socket.on('error', function(error) {
    console.log('socket.io Error: ' + JSON.stringify(error));
    PubSub.publish(Constants.dispatcher, {type: 'error', error: error});
  });

  return socket;
};
var _socketio = initSocket();

// Actions - these call the todoServer
var Actions = {

    addTodo: function (todo) {
        _socketio.emit('post', todo);
    },

    updateTodo: function (todo) {
        _socketio.emit('put', todo);
    },

    deleteTodo: function (todo) {
        _socketio.emit('delete', todo);
    },

    getTodoList: function () {
        _socketio.emit('get');
    }
}
