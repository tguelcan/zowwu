export const jsonSend = (req, res, next) => {
    res.json = (payload, statusCode = 200, filter) => {
        res.statusCode = statusCode;
        res.setHeader("Content-Type", "application/json");
        // (Default), Response payload
        res.end(JSON.stringify(payload));
    };

    next();
};
