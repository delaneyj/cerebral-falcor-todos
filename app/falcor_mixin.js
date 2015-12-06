import React from 'react';
let callbacks = [];
let listener = false;

const Mixin = {
  contextTypes: {
    controller: React.PropTypes.object,
    falcor: React.PropTypes.instanceOf(falcor.Model)
  },
  componentWillMount: function () {
    this.signals = this.context.controller.signals;
    this.falcor  = this.context.falcor;

    if (!this.getStatePaths) {
      return;
    }

    if (this.context.controller.isServer) {
      return this._update();
    }

    if (!listener) {
      listener = true;
      this.context.controller.on('change', function () {
        callbacks.forEach(function (cb) {
          cb();
        });
      });
    }
    callbacks.push(this._update);
    this._update();
  },
  componentWillUnmount: function () {
    this._isUmounting = true;
    if (this.getStatePaths || this.getComputedPaths) {
      callbacks.splice(callbacks.indexOf(this._update), 1);
    }
  },
  shouldComponentUpdate: function (nextProps, nextState) {
    var propKeys = Object.keys(nextProps);
    var stateKeys = Object.keys(nextState);

    // props
    for (var x = 0; x < propKeys.length; x++) {
      var key = propKeys[x];
      if (this.props[key] !== nextProps[key]) {
        return true;
      }
    }

    // State
    for (var x = 0; x < stateKeys.length; x++) {
      var key = stateKeys[x];
      if (this.state[key] !== nextState[key]) {
        return true;
      }
    }

    return false;
  },
  _update: function () {
    if (this._isUmounting) {
      return;
    }
    var statePaths = this.getStatePaths ? this.getStatePaths() : {};
    var controller = this.context.controller;
    var newState = {};

    newState = Object.keys(statePaths).reduce(function (newState, key) {
      var value = controller.get(statePaths[key]);
      if (value !== undefined) {
        newState[key] = value;
      }
      return newState;
    }, newState);
    
    const queryKey = Object.keys(this.getQueryPaths())[0];
    const query    = this.getQueryPaths()[queryKey];

    this.falcor.
      get(query).
      then((response) => {
        newState[queryKey] = response.json[queryKey];
        this.setState(newState);
      });
    }
  }

export {Mixin};