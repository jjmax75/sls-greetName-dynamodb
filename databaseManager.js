'use strict';

const AWS = require('aws-sdk');
const dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = process.env.NAMES_DYNAMODB_TABLE;
const INDEX_NAME = process.env.NAMES_INDEX_NAME;

module.exports.saveName = async (item) => {
  console.log('saving the name');
  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  return await dynamo.put(params).promise()
    .then(() => {
      return `hello ${item.firstName}`;
    })
    .catch((err) => {
      console.log(err)
    });
};

module.exports.checkGreeted = async (firstName) => {
  const params = {
    TableName: TABLE_NAME,
    IndexName: INDEX_NAME,
    KeyConditionExpression: "firstName = :a",
    ExpressionAttributeValues: {
      ":a": firstName
    }
  };

  const response = await dynamo.query(params).promise();
  console.log(response);
  return response;
}
