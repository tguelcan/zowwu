<!-- PROJECT LOGO -->
<br />
<p align="center">
    <img src="http://media.kopfundgeist.de/zowwu.png" alt="Logo" width="700" height="286">

  <h3 align="center">it's never been easier to create a REST api</h3>
  <p align="center">folder based routing service</p>
  <p align="center">
    <a href="https://github.com/tguelcan/zowwu/issues">Report Bug</a>
    ·
    <a href="https://github.com/tguelcan/zowwu/labels/Feature%20request">Request Feature</a>
    ·
    <a href="paypal.me/tayfuuu">Donate</a>
  </p>
</p>
    <br />

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

Just don't waste any time. If you're building a project, you probably have a clean folder structure anyway. Zowwu uses the folder structure and automatically creates your API endpoints from it.
We use [polka](https://github.com/lukeed/polka) for it. an extremely minimal, highly performant Express.js alternative that uses the native HTTP driver.

The project is still in progress. Support is **greatly appreciated**.

<img src="http://media.kopfundgeist.de/zowwu_folder.png" alt="Logo" width="700">

<!-- GETTING STARTED -->

## Getting Started

This is an example of how you may give instructions on setting up your project locally.
To get a local copy up and running follow these simple example steps.

### Installation

1. Clone the repo
   ```sh
   npm install zowwu
   ```
   or
   ```sh
   yarn add zowwu
   ```

<!-- USAGE EXAMPLES -->

## Usage

### Simple usage

#### Server

```
   ./index.js
```

```javascript
const loader = require("zowwu");

// Options: loader({ entry: 'src', debug: false }).then(...

loader().then((app) => {
  app.listen(3000, (err) => {
    if (err) throw err;
    console.log(`> Running on localhost:3000`);
  });
});
```

#### Create your folders or files

```
   ./api/comments/index.js
   ./api/articles/index.js
   ./api/...
```

```javascript
module.exports = {
  routes: [
    {
      path: "/",
      action: async (req, res, next) => {
        res.json({ status: "Hello world" });
      },
    },
  ],
};
```

#### Now you can query

```sh
 curl http://localhost:3000/articles
 curl http://localhost:3000/comments
 ...
```

#### File based endpoints also possible

```
   ./api/comments.js
   ./api/articles.js
   ./api/...
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
      path: "/",
      action: async (req, res, next) => {
        // Get Posts
        res.json([{ title: "Post..." }]);
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
      path: "/",
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

Tayfun Gülcan - [@tayfuuu](https://twitter.com/Tayfuuu)

<!-- ACKNOWLEDGEMENTS -->

## Acknowledgements

- [Polka](https://github.com/lukeed/polka)
- [Kopfundgeist](https://kopfundgeist.com/)
