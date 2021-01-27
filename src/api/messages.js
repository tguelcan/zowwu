export default {
    routes: [
        {
            method: "GET",
            path: "/",
            action: async (req, res, next) => {
                console.log("action");
                res.json({ status: "messages" });
            },
        },
    ],
};
