<!-- PROJECT LOGO -->
<p align="center">
    <img src="http://media.kopfundgeist.de/zowwu.png" alt="Logo" width="700">

  <h3 align="center">it's never been easier to create a REST api</h3>
  <p align="center">folder and filename based routing service</p>
  <p align="center">
    <a href="https://github.com/tguelcan/zowwu/issues">Report Bug</a>
    ·
    <a href="https://github.com/tguelcan/zowwu/labels/Feature%20request">Request Feature</a>
    ·
    <a href="paypal.me/tayfuuu">Donate</a>
  </p>
</p>
    <br />

![Node.js CI](https://github.com/tguelcan/zowwu/workflows/Node.js%20CI/badge.svg)
![LICENCE](https://img.shields.io/github/license/tguelcan/zowwu)

<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#usage">Usage</a></li>
        <li><a href="#plugins">Plugins</a></li>
      </ul>
    </li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->

## About The Project

Just don't waste any time. If you're building a project, you probably have a clean folder structure anyway. Zowwu uses the folder structure and automatically creates your API endpoints based on [polka](https://github.com/lukeed/polka) from it.

The project is still in progress. Support is **greatly appreciated**.

<p align="center">
  <img src="http://media.kopfundgeist.de/zowwu_folder_.png" alt="Logo" width="700">
</p>
<!-- GETTING STARTED -->

### Installation

1. Install Package
   ```sh
   npm install zowwu
   ```
   or
   ```sh
   yarn add zowwu
   ```

<!-- USAGE EXAMPLES -->

## Usage

#### Server

```
   ./index.js
```

```javascript
const loader = require("zowwu");

loader().then((app) => {
  app.listen(3000, (err) => {
    if (err) throw err;
    console.log(`> Running on localhost:3000`);
  });
});
```

👩‍🔧 Available options:

```javascript
const loader = require("zowwu");

loader({
  entry: 'api', // default api folder
  debug: false, // default true - it shows you the generated routes on load
  pluginPath: 'plugins' // default plugins
}).then(app => // return the polkajs instance

```

#### Create your folders or files

```
   ./api/comments/index.js  -> http://localhost:3000/comments
   ./api/comments/deeper/index.js  -> http://localhost:3000/comments/deeper
   ./api/articles/index.js  -> http://localhost:3000/comments
   ./api/...
```

or

```
   ./api/comments.js  -> http://localhost:3000/comments
   ./api/articles.js  -> http://localhost:3000/articles
   ./api/...
```

```javascript
module.exports = {
  routes: [
    {
      action: async (req, res, next) => {
        res.json({ status: "Hello world" });
      },
    },
  ],
};
```

> 🪄 Now your routes are automatically created based on the file names and/or folder structure

#### Route Options

```javascript
module.exports = {
  routes: [
    {
      path: '/', // Optional, default '/'
      method: 'GET', // Optional, default 'GET'
      before: async (req, res, next) => ..., // Before Handler (Hook)
      action: async (req, res, next) => ...  // Handler
    },
  ],
};
```

> 📄 For more information - [polka](https://github.com/lukeed/polka) based on [trouter](https://github.com/lukeed/trouter).

#### Now you can query

```sh
 curl http://localhost:3000/articles
 curl http://localhost:3000/comments
 ...
```

#### Middlewares (Endpoint specific)

```javascript
function one(req, res, next) {
  console.log("world...");
  next();
}

function two(req, res, next) {
  console.log("...needs better demo 😔");
  next();
}

module.exports = {
  before: [one, two],
  routes: [
    {
      action: async (req, res, next) => {
        // Get Posts
        res.json([{ title: "Post..." }]);
      },
    },
    {
      path: "/:id",
      action: async (req, res, next) => {
        // Get Posts
        res.json([{ title: `Hello ${req.params}` }]);
      },
    },
    {
      method: "POST",
      path: "/",
      action: async (req, res, next) => {
        // Create Post
        res.end("Create Post...");
      },
    },
  ],
};
```

#### Middlewares (Route specific)

```javascript
function one(req, res, next) {
  console.log("world...");
  next();
}

function two(req, res, next) {
  console.log("...needs better demo 😔");
  next();
}

module.exports = {
  routes: [
    {
      before: one,
      action: async (req, res, next) => {
        // Get Posts
        res.json([{ title: "Post..." }]);
      },
    },
    {
      method: "POST",
      path: "/",
      before: two,
      action: async (req, res, next) => {
        // Create Post
        res.end("Create Post...");
      },
    },
  ],
};
```

<!-- PLUGINS -->

## Plugins

Plugins work like normal routes.
For example, you can provide the authentication function as a plugin or other functions.

#### Create your folders or files

```
   ./plugins/myplugin.js
   or
   ./plugins/myplugin/index.js
   ./plugins/...
```

> Note: With the plug-ins, you cannot go deeper into the folder structure.

```javascript
// ./plugins/myplugin.js  or  ./plugins/myplugin/index.js
module.exports = {
  routes: [
    {
      action: async (req, res, next) => {
        res.json({ status: "Hello plugin" });
      },
    },
  ],
};
```

```javascript
// ./api/myroute.js
module.exports = {
  routes: [
    {
      plugin: "myplugin",
    },
    {
      path: "/:id",
      action: async (req, res, next) => {
        res.json({ status: req.params.id });
      },
    },
  ],
};
```

🤟 You can still add your middlewares here or overwrite the plugins:

```javascript
// ./api/myroute.js
module.exports = {
  routes: [
    {
      plugin: "myplugin",
      before: async (req, res, next) => {
        console.log("before.. but after plugin function");
        next();
      },
      action: async (req, res, next) => {
        res.json({ status: "overwrite plugin" });
      },
    },
    {
      path: "/:id",
      action: async (req, res, next) => {
        res.json({ status: req.params.id });
      },
    },
  ],
};
```

<!-- ROADMAP -->

## Roadmap

See the [open issues](https://github.com/tguelcan/zowwu/issues) for a list of proposed features (and known issues).

<!-- CONTRIBUTING -->

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->

## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- CONTACT -->

## Contact

Tayfun Gülcan - [Twitter](https://twitter.com/Tayfuuu) [LinkedIn](https://www.linkedin.com/in/%E2%98%95-tayfun-g%C3%BClcan-57627aab/)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Polka](https://github.com/lukeed/polka)
- [Kopfundgeist](https://kopfundgeist.com/)
