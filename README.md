# MasteryJS

Scalable API Server framework build on top of Hapi and Sequelize. One server to rule all your clients, simple, stable, and easy to use.

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

- [x] Internationalization (i18n) with [Polyglot.js](http://airbnb.io/polyglot.js)
- [x] Integration with [Open API (Swagger) UI](http://swagger.io/swagger-ui) 
- [x] JWT authentication support
- [x] Auto routes creation based on model configuration file (e.g. [user model configuration](src/config/development/models/development-model-user.json))
- [x] Built-in Access Control List
- [ ] Build system using Gulp
- [ ] Custom role resolver
- [ ] File transport
- [ ] Email handler
- [ ] API Rate Limitations
- [ ] Request Logger
- [ ] Combine multiple routes into one route

## Getting Started

### Prerequisites

1. [NodeJS](https://nodejs.org/en/download) version 6 or greater
1. [PostgreSQL](https://www.postgresql.org/download)

### Installation

Type ```npm install```

### Configuration

Configure database configuration inside the development environment [database configuration file](src/config/development/databases/development-database-main.json)

### Running

Type ```./node_modules/.bin/babel-node src/index.js```

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
