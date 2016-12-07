# MasteryJS

Scalable API Server framework build on top of [Hapi](http://hapijs.com) and [Sequelize](http://sequelizejs.com). One server to rule all your clients, simple, stable, and easy to use.

[![Build Status](https://travis-ci.org/labibramadhan/mastery.svg?branch=master)](https://travis-ci.org/labibramadhan/mastery)

## Table of Contents
1. [Main Features](#main-features)
1. [Getting Started](#getting-started)
    1. [Prerequisites](#prerequisites)
    1. [Installation](#installation)
    1. [Configuration](#configuration)
    1. [Running](#running)
1. [License](#license)

## Main Features

- [x] Supports MySQL, MariaDB, SQLite, PostgreSQL, MSSQL through [Sequelize](http://docs.sequelizejs.com/en/v3/docs/getting-started/#setting-up-a-connection)
- [x] Internationalization (i18n) with [Polyglot.js](http://airbnb.io/polyglot.js)
- [x] Integration with [Open API (Swagger) UI](http://swagger.io/swagger-ui) 
- [x] JWT authentication support
- [x] Auto routes creation based on model configuration file (e.g. [user model configuration](src/core/components/user/user.config.json))
- [x] Built-in Access Control List
- [ ] Build system using Gulp
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

### Installation

Type ```git clone https://github.com/labibramadhan/mastery.git && cd mastery && npm install```

### Configuration

Configure database configuration inside the development environment [database configuration file](src/config/development/databases/development-database-main.json).

Also, create schema 'core' inside your database.

### Running

Type ```./node_modules/.bin/babel-node src/index.js``` and then open ```http://localhost:4444/documentation```

## License

#### (The Apache 2.0 License)

Copyright (c) 2016 Muhammad Labib Ramadhan

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

**[Back to top](#table-of-contents)**
