import db from "~/services/db";
import { exist, notExist } from "~/utils";
import { fields } from "./model";

db.model("message", {
    fields,
    beforeUpdate: [exist],
});

export const fetch = async (ctx, next) => {
    try {
        const rows = await db.message.find();
        ctx.body = { rows };
        next();
    } catch (err) {
        next(err);
    }
};

export const fetchOne = async ({ params }, res, next) => {
    try {
        const doc = await db.message.findOne({ query: params });
        console.log(doc);
        await notExist(doc, res);
        res.send(doc);
    } catch (err) {
        next(err);
    }
};

export const create = async ({ body }, res) =>
    res.send(await db.message.insert({ data: body }));

export const update = async ({ body, params }, res, next) => {
    try {
        res.send(await db.message.update({ query: params, data: body }));
    } catch (err) {
        console.log("eeeror");
        next(err);
    }
};

export const remove = async ({ params }, res, next) => {
    try {
        const doc = await db.message.findOne({ query: params });
        await notExist(doc, res);
        await db.message.remove({ query: params });
        res.send({ status: "success" });
    } catch (err) {
        res.status(500).send(err);
    }
};
