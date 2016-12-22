# MasteryJS

Scalable API Server framework build on top of [Hapi](http://hapijs.com) and [Sequelize](http://sequelizejs.com). One server to rule all your clients, simple, stable, and easy to use.

[![Build Status](https://travis-ci.org/labibramadhan/mastery.svg?branch=master)](https://travis-ci.org/labibramadhan/mastery)
[![Dependency Status](https://david-dm.org/labibramadhan/mastery.svg)](https://david-dm.org/labibramadhan/mastery)
[![devDependency Status](https://david-dm.org/labibramadhan/mastery/dev-status.svg)](https://david-dm.org/labibramadhan/mastery?type=dev)

## Table of Contents
1. [Main Features](#main-features)
1. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    1. [Installation](#installation)
    1. [Configuration](#configuration)
    1. [Development](#development)
    1. [Deployment](#deployment)

## Main Features

- [x] Supports MySQL, MariaDB, SQLite, PostgreSQL, MSSQL through [Sequelize](http://docs.sequelizejs.com/en/v3/docs/getting-started/#setting-up-a-connection)
- [x] Auto routes creation based on model configuration file (e.g. [user model configuration](src/core/components/user/user.config.json))
- [x] Flexible base and component configurations
- [x] Internationalization (i18n) with [Polyglot.js](http://airbnb.io/polyglot.js)
- [x] Integration with [Open API (Swagger) UI](http://swagger.io/swagger-ui) 
- [x] JWT authentication support
- [x] Built-in Access Control List
- [x] [PM2 Production Process Manager](https://github.com/Unitech/pm2) support
- [x] Create Project, Server Management, and Build System using [MasteryJS CLI](https://github.com/labibramadhan/mastery-cli)
- [ ] Custom role resolver
- [ ] File transport
- [ ] Email transport
- [ ] API Rate Limitations
- [ ] Request Logger
- [ ] Combine multiple routes (appending) into a single route

## Getting Started

### Prerequisites

1. [Git](https://git-scm.com/downloads)
1. [NodeJS](https://nodejs.org/en/download) version 6 or greater
1. [PostgreSQL](https://www.postgresql.org/download)
1. [MasteryJS CLI](https://github.com/labibramadhan/mastery-cli)

### Installation

We will use [MasteryJS CLI](https://github.com/labibramadhan/mastery-cli) helper to get started easily.

You just need to type the following command and then follow the wizard on it.

```
>_ mastery new [destination]
```

### Configuration

First, create a database and create schema **core** inside your database.

Then, configure database connection by the [database configuration file](src/config/databases/database-main.json).

### Development

For debugging purpose, change current working directory to the root directory (a directory contains src directory and a package.json file). MasteryJS CLI will use the help of [babel-node](https://babeljs.io/docs/usage/cli/#babel-node) by using these commands:

```>_ mastery serve``` (running from source)

```>_ mastery serve -i``` (running & debugging from source using chrome inspector)

```>_ mastery serve -p <debug-port>``` (running & debugging from source using any IDE debugger)

### Deployment

First, you need to build MasteryJS by this command inside your root project directory:

```
>_ mastery build
```

And then there will be a new directory called **build**. These commands will be available inside build directory:

```
>_ mastery start
```

```
>_ mastery stop
```

```
>_ mastery restart
```

For monitoring all MasteryJS production processes, type this command:

```
>_ mastery status
```

**[Back to top](#table-of-contents)**
