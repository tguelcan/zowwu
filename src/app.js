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
    pluginPath: "plugins",
    debug: false,
};

let modulesRegistred = false;

const defaultAction = (req, res, next) => next();

/**
 * Initial load module
 * @param  {String} entry default api, root folder of routes
 * @param  {String} fullPath   just only for the generator
 * @return {Promise}           polka app
 */
const load = (options, fullPath) =>
    new Promise((res) => {
        let { entry, debug, pluginPath, register } = Object.assign(
            defaultOptions,
            options
        );
        // Register custom middlewares
        register?.length &&
            register.forEach((r) => {
                if (modulesRegistred) return;
                app.use(r);
                debug && console.log("Module registred");
                modulesRegistred = true;
            });

        if (!fullPath) {
            fullPath = entry;
        }

        // prevent folder path error
        if (!fullPath.endsWith("/")) {
            fullPath = fullPath + "/";
        }

        if (!pluginPath.endsWith("/")) {
            pluginPath = pluginPath + "/";
        }

        if (!isAbsolute(fullPath)) {
            fullPath =
                env === "test"
                    ? resolve() + `/test/${fullPath}`
                    : `${dirname(require.main.filename)}/${fullPath}`;
        }

        if (!isAbsolute(pluginPath)) {
            pluginPath =
                env === "test"
                    ? resolve() + `/test/${pluginPath}`
                    : `${dirname(require.main.filename)}/${pluginPath}`;
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
                            routes.forEach((r) => {
                                const {
                                    plugin = null,
                                    method = "GET",
                                    path = "/",
                                    before,
                                    action,
                                } = r;
                                debug &&
                                    console.log(
                                        `${method.toUpperCase()} ${
                                            treePath + path
                                        }`
                                    );

                                /**
                                 * possibility to run several middlewares in a row
                                 */
                                const assignBefore = async (req, res, next) => {
                                    // Check if not a array
                                    if (before && typeof before !== "object") {
                                        await before(req, res, next);
                                        next();
                                    } else if (before) {
                                        r.before.forEach(async (b) => {
                                            await b(req, res, next);
                                        });
                                        next();
                                    }
                                };

                                // Load with plugin
                                if (plugin) {
                                    let pluginValues;

                                    if (
                                        statSync(
                                            `${pluginPath}${plugin}`
                                        ).isDirectory()
                                    ) {
                                        pluginValues = require(`${pluginPath}${plugin}/index.js`);
                                    } else {
                                        pluginValues = require(`${pluginPath}${plugin}.js`);
                                    }

                                    app[pluginValues.method.toLowerCase()](
                                        treePath + pluginValues.path || path,
                                        assignBefore ||
                                            pluginValues?.before ||
                                            defaultAction,
                                        action ||
                                            pluginValues?.action ||
                                            defaultAction
                                    );
                                } else {
                                    app[method.toLowerCase()](
                                        treePath + path,
                                        assignBefore || defaultAction,
                                        action || defaultAction
                                    );
                                }
                            });
                        }
                    }
                }
            });
        });
        res(app);
    });

module.exports = load;
