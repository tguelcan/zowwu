const loader = require("./../lib/app");

const test1 = (req, res, next) => {
    console.log("test1");
    next();
};

const test2 = (req, res, next) => {
    console.log("test2");
    next();
};

loader({ debug: true, register: [test1, test2] })
    .then((app) => {
        app.listen(3000, (err) => {
            if (err) throw err;
            console.log(`> Running on localhost:3000`);
        });
    })
    .catch((err) => console.log(err));
