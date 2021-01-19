'use strict';
const { v4: uuidv4 } = require('uuid');

const databaseManager = require('./databaseManager');

function createResponse(statusCode, message) {
  return {
    statusCode,
    body: JSON.stringify(message, null, 2)
  }
}

module.exports.hello = async (event, context, callback) => {
  const name = event.queryStringParameters && event.queryStringParameters.name;
  const message = `Hello ${name ? name : 'World'}`;
  
  if (!!name) {
    const payload = {
      itemId: uuidv4(),
      firstName: name
    };

    const message = await databaseManager.saveName(payload);
    callback(null, createResponse(200, { message }));
  } else {
    const response = {
      message,
      input: event
    };

    return createResponse(200, response);
  }  
};

module.exports.wasGreeted = async (event, context, callback) => {
  console.log('wasGreeted was called');
  const name = event.queryStringParameters && event.queryStringParameters.name;

  if (!!name) {
    console.log('anme is set to', name);

    const response = await databaseManager.checkGreeted(name);
    console.log(response);
    const message = response.Count ? "YES" : "NO";
    callback(null, createResponse(200, message));
  } else {
    const response = {
      message: 'no name given',
      input: event
    };

    return createResponse(200, response);
  }
};
