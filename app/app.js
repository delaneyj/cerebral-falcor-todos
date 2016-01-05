import React from 'react';
import {Decorator as Cerebral} from 'cerebral-react';

@Cerebral({
  greetings: ['greetings'],
  todos: ['todos']
})
export default class App extends React.Component {
  componentDidMount() {
    this.props.signals.appMounted();
  }
  textEntered(event) {
    if (event.keyCode === 13) {
      this.props.signals.todoTextEntered.sync({title: event.target.value});
      event.target.value = '';
    }
  }
  render() {
    if (this.props.todos) {
      const todos = Object.keys(this.props.todos).map((id) => {
        return <li key={id}>{this.props.todos[id].title}</li>;
      });

      return (
        <div>
          <h1>{this.props.greetings}</h1>
          <input onKeyDown={this.textEntered.bind(this)} />
          <ul>{todos}</ul>
        </div>
      );
    } else {
      return (
        <div>
          <h5>{this.props.greetings}</h5>
          <input />
          <p>Loading</p>
        </div>
      );
    }
  }
}
