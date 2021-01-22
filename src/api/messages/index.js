const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const beforeOne = (req, res, next) => {
    console.log("1");
    next();
};
const beforeTwo = (req, res, next) => {
    console.log("2");
    next();
};

const beforeThree = (req, res, next) => {
    console.log("3");
    next();
};

export default {
    before: [beforeTwo, beforeThree],
    routes: [
        {
            method: "GET",
            path: "/",
            before: beforeOne,
            action: async (req, res, next) => {
                console.log("action");
                res.json({ status: "success" });
            },
        },
        {
            method: "GET",
            path: "/:id",
            action: async (req, res, next) => {
                console.log(req.params);
                res.json({ status: req.params });
            },
        },
    ],
};
