'use strict';

const util = require('util');

function NoResponseError() {  
  Error.call(this);
  this.name = 'NoResponseError';
  this.message = "No response from client.";
};

util.inherits(NoResponseError, Error);

module.exports = NoResponseError;