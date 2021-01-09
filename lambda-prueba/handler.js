"use strict";
const data = require("./controllers/data");
const constantes = require("./resources/constantes");
/**
 * Headers to send back to client
 */
const headers = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, PUT, POST, DELETE, HEAD, OPTIONS",
};

/**
 * Function to send response to client
 * @param statusCode {number}
 * @param body {*}
 * @returns {{statusCode: *, headers: string, body: *}}
 */
const sendResponse = (statusCode, body) => {
  const response = {
    statusCode: statusCode,
    headers: headers,
    body: body,
  };
  return response;
};

module.exports.create = async (event, context, callback) => {
  try {
    console.log(`init create car ${JSON.stringify(event)}`);
    let newCar = JSON.parse(event.body);
    let carroExistente = await data.getCar(newCar.matricula);
    console.log(JSON.stringify(carroExistente));
    if(!carroExistente.length){
      await data.insertCar(newCar);
      return callback(
        null,
        sendResponse(
          constantes.SUCESSFULL_EXECUTION,
          JSON.stringify({
            message: "Se creo con exito!",
          })
        )
      );
    }
    return callback(
      null,
      sendResponse(
        constantes.SUCESSFULL_EXECUTION,
        JSON.stringify({
          message: "el vehiculo ya existe: "+JSON.stringify(carroExistente),
        })
      )
    );
  } catch (error) {
    console.error(error);
    if (error instanceof TypeError) {
      return callback(
        null,
        sendResponse(
          constantes.SERVER_ERROR,
          JSON.stringify({
            message: error.message,
          })
        )
      );
    } else {
      return callback(
        null,
        sendResponse(
          constantes.SERVER_ERROR,
          JSON.stringify({
            message: error,
          })
        )
      );
    }
  }
};

module.exports.getAll = async (event, context) => {
  try {
    console.log(`init getAll carros ${JSON.stringify(event)}`);
    const datos = await data.getAllCars();
    return sendResponse(constantes.SUCESSFULL_EXECUTION, JSON.stringify(datos));
  } catch (error) {
    console.error(error);
    return sendResponse(constantes.SERVER_ERROR, JSON.stringify(error));
  }
};
