export default {
    routes: [
        {
            method: "GET",
            path: "/",
            action: async (req, res, next) => {
                res.json({ status: "route:content" });
            },
        },
    ],
};
