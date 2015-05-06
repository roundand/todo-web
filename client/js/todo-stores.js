// Our stores
var Store = {};

// Todo store - subscribes to todoStore events
Store.Todo = {

    // emit() publishes a message to 'todoStore' subscribers
    emit: PubSub.publish.bind(PubSub, 'todoStore'),

    // our data
    data: [],

    // accept updates
    acceptActions: function(channel, action) {
        switch(action.type) {
            case Constants.update:
                this.data = action.data;
                this.emit({type: 'change', data: this.data});
                break;
            default:
                alert('unexpected action: ' + JSON.stringify(action));
        }
    }
}
PubSub.subscribe(Constants.dispatcher, Store.Todo.acceptActions.bind(Store.Todo));
