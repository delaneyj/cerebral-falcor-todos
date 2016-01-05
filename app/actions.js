const getTodos = ({state, output, services}) => {
  const length = state.get('todosLength') - 1;

  services.falcor.get(['todos', {from: 0, to: length}, 'title']).
    then(response => output(response.json)).
    catch(response => output.error);
}

const getTodosLength = ({output, services}) => {
  services.falcor.get(['todosLength']).
    then(response => output(response.json)).
    catch(response => output.error);
}

const createTodo = ({input, output, services}) => {
  services.falcor.call(['todos', 'add'], [input.title], ['title']).
    then(response => output(response.json)).
    catch(response => output.error);
}

const getGreeting = ({output, services}) => {
  services.falcor.get(['greetings']).
  then(response => {
    debugger; //no problems if there is a success
    output(response.json)
  }).
  catch(response => {
    debugger; //if there was an error gives back in raw jsongraph form
    output(response); //this will cause the thrown error described in the bug
  });
}

export {getTodos, getTodosLength, createTodo, getGreeting};
