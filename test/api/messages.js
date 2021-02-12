module.exports = {
    routes: [
        {
            plugin: "myplugin",
        },
        {
            path: "/:id",
            action: async (req, res, next) => {
                res.json({ status: req.params.id });
            },
        },
        {
            method: "POST",
            path: "/:id",
            action: async (req, res, next) => {
                res.json({ status: req.body });
            },
        },
    ],
};
