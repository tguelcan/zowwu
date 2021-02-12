const loader = require("./../lib/app");

loader({ debug: true })
    .then((app) => {
        app.listen(3000, (err) => {
            if (err) throw err;
            console.log(`> Running on localhost:3000`);
        });
    })
    .catch((err) => console.log(err));
