import { map, pick, partialRight, isArray } from "lodash";

export const exist = async function (data, next) {
    const doc = await this.model._findOne(this.query);
    if (!doc) {
        next(new Error("Document does not exist"));
    }
    next();
};

export const notExist = async (data, res) =>
    new Promise((resolve, reject) =>
        data
            ? resolve(data)
            : reject(res.status(404).send("Document does not exist"))
    );

export const jsonSend = (req, res, next) => {
    res.json = (payload, statusCode = 200, filter) => {
        res.statusCode = statusCode;
        res.setHeader("Content-Type", "application/json");

        // Array Projection by key
        if (filter && isArray(payload)) {
            payload = map(payload, partialRight(pick, filter));
        }

        // Object Projection by key
        if (filter && !isArray(payload)) {
            payload = pick(payload, filter);
        }

        // (Default), Response payload
        res.end(JSON.stringify(payload));
    };

    next();
};

export const statusSend = (req, res, next) => {
    res.status = (status, message) => (
        (res.statusCode = status), res.end(message ?? null)
    );
    next();
};
