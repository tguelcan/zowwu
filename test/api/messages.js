module.exports = {
    routes: [
        {
            action: async (req, res, next) => {
                res.json({ status: "route:messages" });
            },
        },
        {
            path: "/:id",
            action: async (req, res, next) => {
                res.json({ status: req.params.id });
            },
        },
    ],
};
