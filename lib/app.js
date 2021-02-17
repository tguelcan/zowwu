"use strict";

var _fs = require("fs");

var _path = require("path");

var _polka = _interopRequireDefault(require("polka"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// initial values
var app = (0, _polka.default)();
var env = process.env.NODE_ENV; // add custom middleware

app.use(_utils.jsonSend);
var defaultOptions = {
  entry: "api",
  pluginPath: "plugins",
  debug: false
};
var modulesRegistred = false;

var defaultAction = (req, res, next) => next();
/**
 * Initial load module
 * @param  {String} entry default api, root folder of routes
 * @param  {String} fullPath   just only for the generator
 * @return {Promise}           polka app
 */


var load = (options, fullPath) => new Promise(res => {
  var {
    entry,
    debug,
    pluginPath,
    register
  } = Object.assign(defaultOptions, options); // Register custom middlewares

  (register === null || register === void 0 ? void 0 : register.length) && register.forEach((r, i) => {
    if (modulesRegistred) return;
    app.use(r); // check if all modules registred

    if (register.length == i + 1) {
      modulesRegistred = true;
      debug && console.log("Module registred");
    }
  });

  if (!fullPath) {
    fullPath = entry;
  } // prevent folder path error


  if (!fullPath.endsWith("/")) {
    fullPath = fullPath + "/";
  }

  if (!pluginPath.endsWith("/")) {
    pluginPath = pluginPath + "/";
  }

  if (!(0, _path.isAbsolute)(fullPath)) {
    fullPath = env === "test" ? (0, _path.resolve)() + "/test/".concat(fullPath) : "".concat((0, _path.dirname)(require.main.filename), "/").concat(fullPath);
  }

  if (!(0, _path.isAbsolute)(pluginPath)) {
    pluginPath = env === "test" ? (0, _path.resolve)() + "/test/".concat(pluginPath) : "".concat((0, _path.dirname)(require.main.filename), "/").concat(pluginPath);
  }
  /**
   * read files and folders
   * @param  {String} fullPath full path of root project directory
   */


  (0, _fs.readdir)(fullPath, (err, files) => {
    debug && console.log("Look into ".concat(fullPath)); // ignore hidden files

    if (!files) {
      console.log("No files found in ".concat(fullPath));
      return;
    }

    files = files.filter(item => !/(^|\/)\.[^\/\.]/g.test(item));
    files.forEach(file => {
      if ((0, _fs.statSync)("".concat(fullPath).concat(file)).isDirectory()) {
        load(entry, "".concat(fullPath).concat(file));
        return;
      } else {
        /**
         * Additional route validation
         * @param  {String} route
         * @return {Boolean}
         */
        var validateRoute = route => {
          var routeFile = require(route);

          return !!(routeFile !== null && routeFile !== void 0 && routeFile.routes);
        };

        if (validateRoute("".concat(fullPath).concat(file))) {
          var {
            routes,
            before = (req, res, next) => next()
          } = require("".concat(fullPath).concat(file)); // get folder tree informations


          var treePath; // if index.js in folder (/messages/index.js)

          if (file === "index.js") {
            treePath = fullPath.slice(0, -1).substring(fullPath.slice(0, -1).lastIndexOf("".concat(entry, "/")) + entry.length);
          } else {
            // if another file in folder (/messages/anotherFile.js)
            treePath = fullPath.substring(fullPath.lastIndexOf("".concat(entry, "/")) + entry.length);
            treePath = treePath + file.slice(0, -3);
          }
          /**
           * key: before
           * route global before function
           */


          if (before.constructor === Array) {
            before.forEach(b => {
              app.use( /*#__PURE__*/function () {
                var _ref = _asyncToGenerator(function* (req, res, next) {
                  if (req.url.startsWith(treePath)) {
                    yield b(req, res, next);
                  }

                  next();
                });

                return function (_x, _x2, _x3) {
                  return _ref.apply(this, arguments);
                };
              }());
            });
          } else {
            app.use( /*#__PURE__*/function () {
              var _ref2 = _asyncToGenerator(function* (req, res, next) {
                if (req.url.startsWith(treePath)) {
                  yield before(req, res, next);
                }

                next();
              });

              return function (_x4, _x5, _x6) {
                return _ref2.apply(this, arguments);
              };
            }());
          }
          /**
           * key: routes
           */


          if (routes !== null && routes !== void 0 && routes.length) {
            // assign information to route
            routes.forEach(r => {
              var {
                plugin = null,
                method = "GET",
                path = "/",
                before,
                action
              } = r;
              debug && console.log("".concat(method.toUpperCase(), " ").concat(treePath + path));
              /**
               * possibility to run several middlewares in a row
               */

              var assignBefore = /*#__PURE__*/function () {
                var _ref3 = _asyncToGenerator(function* (req, res, next) {
                  // Check if not a array
                  if (before && typeof before !== "object") {
                    yield before(req, res, next);
                    next();
                  } else if (before) {
                    r.before.forEach( /*#__PURE__*/function () {
                      var _ref4 = _asyncToGenerator(function* (b) {
                        yield b(req, res, next);
                      });

                      return function (_x10) {
                        return _ref4.apply(this, arguments);
                      };
                    }());
                    next();
                  }
                });

                return function assignBefore(_x7, _x8, _x9) {
                  return _ref3.apply(this, arguments);
                };
              }(); // Load with plugin


              if (plugin) {
                var _pluginValues, _pluginValues2;

                var pluginValues;

                if ((0, _fs.statSync)("".concat(pluginPath).concat(plugin)).isDirectory()) {
                  pluginValues = require("".concat(pluginPath).concat(plugin, "/index.js"));
                } else {
                  pluginValues = require("".concat(pluginPath).concat(plugin, ".js"));
                }

                app[pluginValues.method.toLowerCase()](treePath + pluginValues.path || path, assignBefore || ((_pluginValues = pluginValues) === null || _pluginValues === void 0 ? void 0 : _pluginValues.before) || defaultAction, action || ((_pluginValues2 = pluginValues) === null || _pluginValues2 === void 0 ? void 0 : _pluginValues2.action) || defaultAction);
              } else {
                app[method.toLowerCase()](treePath + path, assignBefore || defaultAction, action || defaultAction);
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