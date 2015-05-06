/*****************************************************************\

  Component Structure Chart:

  // the overall container component
  [View.TodoBox]-------------------------------------------+
  |                                                        |
  | // add new items
  | [View.TodoNew]
  |
  | // list and edit existing items
  | [View.TodoList]--------------------------------------+
  | |                                                    |
  | | // individual items, with up to one edit item
  | | [View.Todo]*
  | | [View.TodoEdit]?
  | | [View.Todo]*
  | |
  | +--
  |
  +--

  Major data flows:

  There are three data flow scenarios in this app. I have tried to
  implement a data-flows-down / events-flow-up loop in each.

  [1] In-Form Data Flow

  React implements a one-way data-binding, from components values
  to DOM values. Changes to DOM values, eg field edits, are not
  automatically reflected in the matching component values.

  A simple pattern to close this loop involves storing the
  editable values in the component's state collection, and updating
  these state values from the field's onChange callback. When a
  component uses this.setState() to update a state value from
  within a callback (or any time), React automatically schedules a
  this.render() to re-draw itself.

  This pattern is illustrated in View.TodoNew and View.TodoEdit.

  [2] In-View Data Flow

  React supports compound views composed of nested components.
  Top-level state can be passed down to lower level components in
  their constructors, and is exposed via the lower-level
  component's read-only this.props collection.

  To keep complexity under control, the React ethos is to mutate
  the data of external or higher-level entities via events and / or
  callbacks.

  In this application this is illustrated by the selectedId
  variable in View.TodoBox, which keeps track of which todo item,
  if any, is currently selected. selectedId is a state variable in
  TodoBox, but an immutable props variable in View.TodoList and its
  nested Todo and TodoEdit components. For it to be changed, we
  pass a callback to the top-level component -
  TodoBox._handleTodoSelect() - to these components, also as a
  property. When the user selects an item, this callback is
  executed with the item Id (or -1 to deselect), the TodoBox state
  is updated, which in turn schedules a TodoBox render() using the
  new selectedId value, and React calculates the minimium set of
  DOM changes required to update the rendering correctly.

  This pattern is used by View.TodoBox to let View.Todo and
  View.TodoEdit mutate View.TodoBox.state.selectedId.

  [3] Async External Data Flow

  This app includes TodoServer, stubbing for an external server,
  which allows us to follow a Flux-like model for commmunication
  between the client app and the TodoServer. All data updates are
  posted from the views to the server via an Actions API. The
  action calls the server, then publishes the results on a message
  channel to which a Todo Store is subscribed.

  The Todo Store actions the results and then publishes a change
  event plus the modified data set via a message channel on which
  the TodoBox view is subscribed.

  TodoBox updates a state variable with the modified data, which
  triggers React to re-render nested components as necessary.

\*****************************************************************/


React.render(React.createElement(View.TodoBox, {pollInterval: 2000}), document.getElementById('content'));
