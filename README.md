# Todo list app backend

This project contains a REST API built with Node.js and Express. The API uses a postgresql database with sequelize. API contains basic CRUD operations for managing todo lists and user authentication with tokens (JWT).

## Server configuration
Server must have `node.js (v11.6.0)` and `postgresql (9.5.0)` installed.

### Environment variables
Server must contain the following environment variables:
    
    -NODE_ENV #{ development , production , test }

#### Postgresql
    Development
    -dev_db_username
    -dev_db_password
    -dev_db_database
    -dev_db_host
    -dev_db_dialect
    
    Test
    -test_db_username
    -test_db_password
    -test_db_database
    -test_db_host
    -test_db_dialect

    Production
    -prod_db_username
    -prod_db_password
    -prod_db_database
    -prod_db_host
    -prod_db_dialect

#### User auth
    Access_token
    -JWT_SECRET
    -JWT_EXPIRATION

## Run api with docker
Run `docker-compose up` at the root folder

## Manually Running the api
1. Install app dependencies with `npm install` on the root folder
1. Install sequelize-cli with `npm install -g sequelize-cli`
1. Run `sequelize db:create` on terminal
1. Run `sequelize db:migrate` on terminal
1. Run `node bin/www` on root folder
