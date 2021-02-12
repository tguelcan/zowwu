"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.jsonSend = void 0;

var jsonSend = (req, res, next) => {
  res.json = function (payload) {
    var statusCode = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
    var filter = arguments.length > 2 ? arguments[2] : undefined;
    res.statusCode = statusCode;
    res.setHeader("Content-Type", "application/json"); // (Default), Response payload

    res.end(JSON.stringify(payload));
  };

  next();
};

exports.jsonSend = jsonSend;