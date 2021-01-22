import monastery from "monastery-js";
const db = monastery("localhost/mydb");

db.addMiddleware(({ collection: { name } }) => (next) => (args, method) => {
    return next(args, method);
});

export default db;
