import load from "./app";

(async () => {
    try {
        const app = await load();
        await app.listen(3000);
        console.log("Server running");
    } catch (err) {
        console.log("err");
        console.log(err);
        process.exit(1);
    }
})();
