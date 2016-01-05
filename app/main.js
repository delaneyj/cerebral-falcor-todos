import React from 'react';
import ReactDOM from 'react-dom';
import {Container} from 'cerebral-react';
import {controller, model} from './controller';
import App from './app';
import FalcorModule from 'cerebral-falcor-module';
import {getTodos, getTodosLength, createTodo,getGreeting} from './actions';

controller.register({
  falcor: FalcorModule({
    source: '/model.json',
    model: model
  })
});

controller.signal('appMounted', [
  [getTodosLength],
  [getTodos],
  [getGreeting]
]);

controller.signal('todoTextEntered', [
  [createTodo]
]);

ReactDOM.render(
  <Container controller={controller}><App/></Container>,
  document.getElementById('root')
);
