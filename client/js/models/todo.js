'use strict';

// the todo.Todo class is a Todo item, and has the obvious two properties
var todo = todo || {};
todo.Todo = function(data) {
  this.name = m.prop(data.name);
  this.done = m.prop(data.done);
  this._id = m.prop(data._id);
};

// time for a view-model to handle the view state
todo.vm = (function() {
  var vm = {};

  var log = function(data){
    console.log(data);
  }

  vm.init = function() {

    // our running list of todo items
    vm.list = new todo.TodoList();

    // somewhere to store the name of a new todo before it is added to the model
    vm.name = m.prop('');

    // add a todo item to the list, and clear description field for next use
    vm.add = function() {
      if(vm.name()) {
        m.request({method: 'POST', url: 'http://127.0.0.1/todo', data: {name: vm.name()}})
          .then(function(posted){
            console.log('new item posted: ' + JSON.stringify(posted));
            vm.get();
          }, function(e){
            alert('new item not posted: ' + e)
          });
        vm.name('');
      }
    }

    // remove a todo item from list and DB
    vm.del = function(item) {
      console.log('Delete called for: ' + JSON.stringify(item));
      var url = 'http://127.0.0.1/todo/' + item._id();
      console.log('del() url: ' + url);
      m.request({method: 'DELETE', url: url})
        .then(function(){
          console.log('item deleted: ' + JSON.stringify(item));
          vm.get();
        }, function(e){
          alert('DELETE failed: ' + e)
        });
    }
  }

  // update a todo item in list and DB
  vm.put = function(index, event) {
    // _item is state before last user update
    console.log('Put called for: ' + JSON.stringify(this) + ', index: ' + index);
    var item = vm.list[index];
    console.log('Put executing on item: ' + JSON.stringify(item));
    var dto = {name : item.name(), done: item.done(), _id: item._id()}
    console.log('Put executing on DTO: ' + JSON.stringify(dto));
    var url = 'http://127.0.0.1/todo/' + item._id();
    console.log('put() url: ' + url);
    m.request({method: 'PUT', url: url, data: dto})
      .then(function(){
        console.log('item updated: ' + JSON.stringify(dto));
        vm.get();
      }, function(e){
        alert('PUT failed: ' + e)
      });
  }

  vm.get = function() {
    var newlist = m.prop([]);
    m.request({method: 'GET', url: 'http://127.0.0.1/todo'})
      .then(newlist)
      .then(function(){
        console.log('vm.get(): ' + JSON.stringify(newlist()));
        vm.list = new todo.TodoList();
        newlist().forEach(function(item) {
          vm.list.push(new todo.Todo(item));
        })
      }, function(e){
        alert('GET (All) failed: ' + e)
      });
    console.log(newlist());
  }
  return vm;
}());
