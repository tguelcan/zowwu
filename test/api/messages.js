const firstMiddleware = (req, res, next) => {
    console.log("first middleware");
    next();
};

const secondMiddleware = (req, res, next) => {
    console.log("second middleware");
    next();
};

module.exports = {
    routes: [
        {
            plugin: "myplugin",
        },
        {
            path: "/:id",
            before: [firstMiddleware, secondMiddleware],
            action: async (req, res, next) => {
                res.json({ status: req.params.id });
            },
        },
    ],
};
