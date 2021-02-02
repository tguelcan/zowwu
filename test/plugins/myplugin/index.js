module.exports = {
    method: "GET",
    path: "/",
    before: async (req, res, next) => {
        console.log("myplugin:before");
        next();
    },
    action: async (req, res, next) => {
        res.json({ status: "myplugin:action" });
    },
};
