export default {
    routes: [
        {
            method: "GET",
            path: "/",
            action: async (req, res, next) => {
                console.log("action");
                res.json({ status: "test" });
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
