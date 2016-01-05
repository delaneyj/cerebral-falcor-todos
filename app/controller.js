import Controller from 'cerebral';
import Model from 'cerebral-baobab';

const model = Model({
    greetings:"Hello unknown person."
});

const controller = Controller(model);

export {controller, model};
