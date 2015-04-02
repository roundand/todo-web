'use strict';

// todo variable will act as our namespace
var todo = todo || {};

// the todo.TodoList class is a generic array that will hold items
todo.TodoList = Array;

// initialise the app
m.module(document, {controller: todo.controller, view: todo.view});
