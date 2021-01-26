import fs from "fs";
import path from "path";

import polka from "polka";
import { jsonSend, statusSend } from "~/utils";

// initial polka
const app = polka();

app.use(statusSend).use(jsonSend);

const load = (srcName = "api") =>
    new Promise((resolve, reject) => {
        /**
         * prevent folder path error
         */
        if (!srcName.endsWith("/")) {
            srcName = srcName + "/";
        }
        /**
         * check if the path is already absolute
         */
        let apiSrc = srcName;

        if (!path.isAbsolute(apiSrc)) {
            apiSrc = `${__dirname}/${srcName}`;
        }
        /**
         * read files and folders
         */
        fs.readdir(apiSrc, (err, files) => {
            /**
             * ignore hidden files
             */
            files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
            files.forEach((file) => {
                const fullPath = apiSrc + file;

                // Go deeper if subdirectories exist
                if (fs.statSync(fullPath).isDirectory()) {
                    load(`${fullPath}/`);
                    return;
                } else {
                    /**
                     * throw error if no index.js file found
                     */
                    if (!files.includes("index.js"))
                        throw new Error("No index.js file found");
                    /**
                     * load index
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
                         * get folder tree informations
                         */
                        const rootApiPath = apiSrc.substring(
                            apiSrc.indexOf(srcName) + srcName.length
                        );

                        /**
                         * assign information to route
                         */
                        routes.forEach(
                            ({
                                method = "GET",
                                path,
                                before = (req, res, next) => next(),
                                action,
                            }) => {
                                app[method.toLowerCase()](
                                    `${rootApiPath + path}`,
                                    before,
                                    action
                                );
                            }
                        );
                    }
                }
            });
        });
        resolve(app);
    });

export default load;
