export default {
    routes: [
        {
            method: "GET",
            path: "/",
            action: async (req, res, next) => {
                res.json({ status: "route:messages" });
            },
        },
        {
            method: "GET",
            path: "/:id",
            action: async (req, res, next) => {
                res.json({ status: req.params.id });
            },
        },
    ],
};
