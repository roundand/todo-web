// Actions - these call the todoServer
var Actions = {

    // emit() publishes a message to 'dispatcher' subscribers
    emit: PubSub.publish.bind(PubSub, Constants.dispatcher),

    handleResponse: function(err, data) {
      if (err) {
        console.log('Fermata error: ' + JSON.stringify(err));
      } else {
        console.log('Fermata OK: ' + JSON.stringify(data));
        this.getTodoList();
      }
    },

    handleGet: function(err, data) {
      if (err) {
        console.log('Fermata error: ' + JSON.stringify(err));
      } else {
        console.log('Fermata OK: ' + JSON.stringify(data));
        this.emit({type: 'update', data:data});
      }
    },

    addTodo: function (todo) {
        var server = fermata.json('/todo');
        server.post(todo, this.handleResponse.bind(this));
    },

    updateTodo: function (todo) {
        console.log('updating: ' + JSON.stringify(todo));
        var server = fermata.json('/todo/' + todo._id);
        server.put(todo, this.handleResponse.bind(this));
    },

    deleteTodo: function (todo) {
        console.log('deleting: ' + JSON.stringify(todo));
        var server = fermata.json('/todo/' + todo._id);
        server.delete(todo, this.handleResponse.bind(this));
    },

    getTodoList: function () {
        var server = fermata.json('/todo');
        server.get(this.handleGet.bind(this));
    }
}
