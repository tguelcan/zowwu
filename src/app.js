import { readdir, statSync } from "fs";
import { isAbsolute, dirname, resolve } from "path";

import polka from "polka";
import { jsonSend } from "~/utils";

// initial values
const app = polka();
const env = process.env.NODE_ENV;
// add custom middleware
app.use(jsonSend);

const defaultOptions = {
    entry: "api",
    debug: true,
};

/**
 * Initial load module
 * @param  {String} entry default api, root folder of routes
 * @param  {String} fullPath   just only for the generator
 * @return {Promise}           polka app
 */
const load = (options, fullPath) =>
    new Promise((res) => {
        const { entry, debug } = Object.assign(defaultOptions, options);

        if (!fullPath) {
            fullPath = entry;
        }
        // prevent folder path error
        if (!fullPath.endsWith("/")) {
            fullPath = fullPath + "/";
        }

        if (!isAbsolute(fullPath)) {
            fullPath =
                env === "test"
                    ? resolve() + `/test/${entry}/`
                    : `${dirname(require.main.filename)}/${fullPath}`;
        }

        /**
         * read files and folders
         * @param  {String} fullPath full path of root project directory
         */
        readdir(fullPath, (err, files) => {
            debug && console.log(`Look into ${fullPath}`);
            // ignore hidden files
            if (!files) {
                console.log(`No files found in ${fullPath}`);
                return;
            }
            files = files.filter((item) => !/(^|\/)\.[^\/\.]/g.test(item));
            files.forEach((file) => {
                if (statSync(`${fullPath}${file}`).isDirectory()) {
                    load(entry, `${fullPath}${file}`);
                    return;
                } else {
                    /**
                     * Additional route validation
                     * @param  {String} route
                     * @return {Boolean}
                     */
                    const validateRoute = (route) => {
                        const routeFile = require(route);
                        return !!routeFile?.routes;
                    };
                    if (validateRoute(`${fullPath}${file}`)) {
                        const {
                            routes,
                            before = (req, res, next) => next(),
                        } = require(`${fullPath}${file}`);

                        // get folder tree informations
                        let treePath;
                        // if index.js in folder (/messages/index.js)
                        if (file === "index.js") {
                            treePath = fullPath
                                .slice(0, -1)
                                .substring(
                                    fullPath
                                        .slice(0, -1)
                                        .lastIndexOf(`${entry}/`) + entry.length
                                );
                        } else {
                            // if another file in folder (/messages/anotherFile.js)
                            treePath = fullPath.substring(
                                fullPath.lastIndexOf(`${entry}/`) + entry.length
                            );
                            treePath = treePath + file.slice(0, -3);
                        }

                        /**
                         * key: before
                         * route global before function
                         */
                        if (before.constructor === Array) {
                            before.forEach((b) => {
                                app.use(async (req, res, next) => {
                                    if (req.url.startsWith(treePath)) {
                                        await b(req, res, next);
                                    }
                                    next();
                                });
                            });
                        } else {
                            app.use(async (req, res, next) => {
                                if (req.url.startsWith(treePath)) {
                                    await before(req, res, next);
                                }
                                next();
                            });
                        }

                        /**
                         * key: routes
                         */
                        if (routes?.length) {
                            // assign information to route
                            routes.forEach(
                                ({
                                    method = "GET",
                                    path = "/",
                                    before = (req, res, next) => next(),
                                    action,
                                }) => {
                                    debug &&
                                        console.log(
                                            `${method.toUpperCase()} ${
                                                treePath + path
                                            }`
                                        );

                                    app[method.toLowerCase()](
                                        treePath + path,
                                        before,
                                        action
                                    );
                                }
                            );
                        }
                    }
                }
            });
        });
        res(app);
    });

module.exports = load;
