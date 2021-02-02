module.exports = {
    method: "GET",
    path: "/",
    before: async (req, res, next) => {
        console.log("testplugin:before");
        next();
    },
    action: async (req, res, next) => {
        res.json({ status: "testplugin:action" });
    },
};
