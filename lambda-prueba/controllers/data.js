"use strict";
const DynamoHelper = require("../resources/dynamo_helper");
const constantes = require("../resources/constantes");
const dynamo = new DynamoHelper();

async function insertCar(data) {
  console.log(
    `${process.env.LOG_ENVIRONMENT} -> start insert car...${JSON.stringify(
      data
    )}`
  );
  if (
    data.matricula &&
    constantes.ALPHANUMERIC_REGEX.test(data.matricula) &&
    data.color &&
    constantes.ALPHANUMERIC_REGEX.test(data.color)
  ) {
    const params = {
      TableName: process.env.TABLE_CARS,
      Item: {
        matricula: data.matricula,
        color: data.color,
        fechaCreacion: new Date().toLocaleString("en-US", {
          timeZone: "America/Panama",
        }),
        precio: data.precio ? data.precio : 0,
      },
    };
    await dynamo.saveData(params);
    console.log(`${process.env.LOG_ENVIRONMENT} -> en insert car successful`);
  } else {
    console.error(
      `${process.env.LOG_ENVIRONMENT} -> throws insert car... incomplete data`
    );
    throw new TypeError("Los campos matricula y color son requeridos");
  }
}

async function getAllCars() {
  console.log(`${process.env.LOG_ENVIRONMENT} -> start get all cars...`);
  const params = {
    TableName: process.env.TABLE_CARS,
  };
  const data = await dynamo.loadData(params);
  console.log(
    `${
      process.env.LOG_ENVIRONMENT
    } -> end get all cars successfull with ${JSON.stringify(data)}`
  );
  return data.Items;
}

async function getCar(data) {
  console.log(`${process.env.LOG_ENVIRONMENT} -> start get car...`);
  const params = {
    TableName: process.env.TABLE_CARS,
    KeyConditionExpression: "#matricula = :matricula",
    ExpressionAttributeNames:{
        "#matricula": "matricula"
    },
    ExpressionAttributeValues: {
        ":matricula": data
    }
  };
  console.log(JSON.stringify(params));
  let car = await dynamo.loadDataByParams(params);
  console.log(
    `${
      process.env.LOG_ENVIRONMENT
    } -> end get car successfull with ${JSON.stringify(car)}`
  );
  return car.Items;
}

module.exports = {
  insertCar,
  getAllCars,
  getCar,
};
