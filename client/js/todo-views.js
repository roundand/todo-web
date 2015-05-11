// Our views
var View = {};

// top level todo management component
View.TodoBox = React.createClass({displayName: "TodoBox",

    // accept change from store
    _acceptChange: function(channel, payload) {
        this.setState({data: payload.data });
    },

    // user has selected or de-selected an item from the list
    _handleTodoSelect: function(_id) {
        if (this.state.selectedId === -1 || _id === -1)
            this.setState({selectedId: _id});
    },

    // called only once
    getInitialState: function() {
        return {data: [], selectedId: -1};
    },

    // called every time this is going to render
    componentDidMount: function() {
        PubSub.subscribe('todoStore', this._acceptChange);
        Actions.getTodoList();
    },

    // called whenever this is going to be removed???
    componentWillUnmount: function() {
        PubSub.unsubscribe('todoStore', this._acceptChange);
    },


    render: function() {
        return (
            React.createElement("div", {className: "todoBox"},
                React.createElement("div", {className: "todoHeader"},
                    React.createElement("h1", null, "Behold the mighty Todo List!"),
                    React.createElement(View.TodoNew, {
                        selectedId: this.state.selectedId,
                        onTodoSubmit: this._handleTodoSubmit}
                    )
                ),
                React.createElement("br", null),
                React.createElement(View.TodoList, {
                    selectedId: this.state.selectedId,
                    data: this.state.data,
                    onTodoSelect: this._handleTodoSelect}
                )
            )
        );
    }
});

// a list of TodoLine items
View.TodoList = React.createClass({displayName: "TodoList",
    render: function() {
        var self = this;
        var todoNodes = this.props.data.map( function(todo) {
            if (self.props.selectedId == todo._id) {
                return (
                    React.createElement(View.TodoEdit, {
                        key: todo._id,
                        _id: todo._id,
                        selectedId: self.props.selectedId,
                        name: todo.name,
                        done: todo.done,
                        onTodoSelect: self.props.onTodoSelect}
                    ) );
            } else {
                return (
                    React.createElement(View.Todo, {
                        key: todo._id,
                        _id: todo._id,
                        selectedId: self.props.selectedId,
                        name: todo.name,
                        done: todo.done,
                        onTodoSelect: self.props.onTodoSelect}
                    ) );
            }
        });

        return (
            React.createElement("div", {className: "todoList"},
                todoNodes
            )
        );
    }
});

// an individual todo item - read only
View.Todo = React.createClass({displayName: "Todo",

    render: function() {
        var boundOnTodoSelect = this.props.onTodoSelect.bind(null, this.props._id);
        var className = 'todo';
        var todo = (
            React.createElement("div", {className:  'todo', onClick: boundOnTodoSelect},
                this.props.name, "  ", ' ',
                React.createElement("b", null,  this.props.done ? '☑' : '☐', " "), " ", ' '
            )
        );
        return todo;
    }
});

// an individual todo item - update or delete
View.TodoEdit = React.createClass({displayName: "TodoEdit",

    // this will contain our deselect function
    _deselect: function() { this.props.onTodoSelect(-1); },

    // update name field as user edits it
    _onChangeName: function(event) { this.setState({name: event.target.value}); },

    // update done field every time user clicks on it
    _onChangeDone: function(event) { this.setState({done: !this.state.done}); },

    _handleUpdate: function(e) {
        // send non-blank updates to the server
        if (this.state.name ) {
            Actions.updateTodo({name: this.state.name, done: this.state.done, _id: this.state._id})
        }
        this._deselect();
    },

    _handleCancel: function(e) {
        this._deselect();
    },

    _handleDelete: function(e) {
        Actions.deleteTodo({name: this.state.name, done: this.state.done, _id: this.state._id})
        this._deselect();
    },

    getInitialState: function() {
        return {_id: -1, name: '', done: false};
    },

    // called every time this is going to render
    componentDidMount: function() {
        this.setState( {_id: this.props._id, name: this.props.name, done: this.props.done} );
    },

    render: function() {
        return (
            React.createElement("div", {className:  'todo selected' },
                React.createElement("input", {type: "text", onChange: this._onChangeName, value: this.state.name}), "  ", ' ',
                React.createElement("b", null,
                    React.createElement("input", {
                        type: "checkbox",
                        onChange: this._onChangeDone,
                        checked: this.state.done}
                    )
                ),
                React.createElement("br", null),
                React.createElement("input", {type: "submit", value: "Update", onClick: this._handleUpdate}),
                React.createElement("input", {type: "submit", value: "Cancel", onClick: this._handleCancel}),
                React.createElement("input", {type: "submit", value: "Delete", onClick: this._handleDelete, className: "rightButton"})
            )
        );
    }
});

// edit a new todo item
View.TodoNew = React.createClass({displayName: "TodoNew",

    // update name field as user edits it
    _onChangeName: function(event) {
        this.setState({name: event.target.value});
    },

    _handleSubmit: function(e) {
        var name = this.state.name;
        if (!name ) {
            return;
        }

        // send non-blank request to the server and clear local state
        Actions.addTodo({name: name, done: false})
        this.setState({name: ''});
        return;
    },

    getInitialState: function() {
        return {name: ''};
    },

    render: function() {
        return (
          React.createElement("div", {className: "todo todoForm"},
            React.createElement("input", {type: "text", placeholder: "Do something...", value: this.state.name, onChange: this._onChangeName}),
            React.createElement("input", {type: "submit", value: "Add", onClick: this._handleSubmit})
          )
        );
    }
});
