'use strict';

var todo = todo || {};

// and a view
todo.view = function() {
  return m('html', [
    m('body', [
      m('input', {onchange: m.withAttr("value", todo.vm.name), value: todo.vm.name()}),
      m('button', {onclick: todo.vm.add}, 'Add'),
      m('table', [
        todo.vm.list.map(function(task, index) {
          return m('tr',{onclick: todo.vm.put.bind(task, index)}, [
            m('td', [
              m('input[type=checkbox]', {onclick: m.withAttr('checked', task.done), checked: task.done()})
            ]),
            m('td', {style: {textDecoration: task.done() ? 'line-through' : 'none'}}, task.name()),
            m('td', [
              m('button', {onclick: todo.vm.del.bind(null, task)}, 'Del'),
            ]),
          ]);
        })
      ]),
    ])
  ]);
}
