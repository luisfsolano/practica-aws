"use strict";

module.exports.metodoInicial = async (event) => {
  let nombre =
    event.queryStringParameters != null
      ? event.queryStringParameters.nombre
      : null;
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hola ${nombre}`
      },
      null,
      2
    ),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
