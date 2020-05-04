# Disconnected Docs

This repository is a work in progress with the intent of breaking ways with the practice of integrating a SPA front end with a .NET Core back end.

## Getting Started

The `client` directory contains all of the necessary `build` and `start` scripts in [client/package.json](./client/package.json).

In order to build both the server and client at the same time, all you need to do is change directory to `./client` and execute:

```bash
yarn build
```

[![yarn-build](./.images/yarn-build.png)](./.images/yarn-build.png)

In order to run both the server and client at the same time, all you need to do is change directory to `./client` and execute:

```bash
yarn start
```

[![yarn-start](./.images/yarn-start.png)](./.images/yarn-start.png)