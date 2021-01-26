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
            action: async (req, res, next) => {
                console.log("action");
                res.json({ status: "testtest" });
            },
        },
    ],
};
