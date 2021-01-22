import fs from "fs";
import polka from "polka";
import { jsonSend, statusSend } from "~/utils";

// initial polka
const app = polka();

app.use(statusSend).use(jsonSend);

const apiSrc = `${__dirname}/api/`;

const scanAndLoad = (apiSrc) => {
    fs.readdir(apiSrc, (err, files) => {
        /**
         * ignore and filter hidden files
         */
        files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
        files.forEach((file) => {
            const fullPath = apiSrc + file;

            // Go deeper if subdirectories exist
            if (fs.statSync(fullPath).isDirectory()) {
                scanAndLoad(`${fullPath}/`);
                return;
            } else {
                /**
                 * throw error if no index.js file found
                 */
                if (!files.includes("index.js"))
                    throw new Error("No index.js file found");
                /**
                 * load informations
                 */
                if (file === "index.js") {
                    const {
                        routes,
                        before = (req, res, next) => next(),
                    } = require(fullPath).default;
                    /**
                     * route global before function
                     */
                    if (before.constructor === Array) {
                        before.forEach((b) => {
                            app.use(b);
                        });
                    } else {
                        app.use(before);
                    }
                    /**
                     * throw error if no routes defined
                     */
                    if (!routes?.length) {
                        throw new Error("No routes found");
                    }
                    /**
                     * pass route informations to route
                     */
                    const folderName = apiSrc
                        .substr(0, apiSrc.length - 1)
                        .split("/")
                        .pop();
                    routes.forEach(
                        ({
                            method = "GET",
                            path,
                            before = (req, res, next) => next(),
                            action,
                        }) => {
                            app[method.toLowerCase()](
                                `/${folderName + path}`,
                                before,
                                action
                            );
                        }
                    );
                }
            }
        });
    });
};

export const start = async () => {
    try {
        //
        scanAndLoad(apiSrc);
        await app.listen(3000);
        console.log("Server running");
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
};
start();
