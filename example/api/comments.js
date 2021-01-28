module.exports = {
    routes: [
        {
            path: "/",
            action: async (req, res, next) => {
                res.json({ status: "Hello world" });
            },
        },
    ],
};
