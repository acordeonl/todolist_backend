[[JSDocs](http://keyconservation-docs.surge.sh/)]
    [[API_Docs](https://documenter.getpostman.com/view/5818678/RzthRrE1)]

# KeyConservationBackend

This project contains a REST API built with Node.js and Express. The API uses a postgresql database and handles Stripe, Chatkit, Onesignal, AWS S3 and Gmail services.

## Server configuration
Server must have `node.js (v11.6.0)`, `redis-server (3.0.6)`, and `postgresql (9.5.0)` installed.

### Environment variables
Server must contain the following environment variables:
    
    -NODE_ENV #{ development , production , test }

#### AWS 
    -AWS_ACCESS_KEY_ID
    -AWS_SECRET_ACCESS_KEY
    -AWS_REGION

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

    Social Login
    -oauth_google_clientId
    -oauth_google_clientSecret
    -oauth_facebook_clientId
    -oauth_facebook_clientSecret
    -twitter_consumer_key
    -twitter_consumer_secret

    Stripe
    -stripe_secret_key

#### User communication
    -chatkit_instance_prefix
    -chatkit_instance
    -chatkit_secret_key_id
    -chatkit_secret_key
    -chatkit_token_expiry

    -oneSignal_appId

    -gmail_sender_account #Used for resetting password
    -gmail_sender_pass


## Running the App
1. Install app dependencies with `npm install` on the root folder
1. Run `sequelize db:create` on terminal
1. Run `sequelize db:migrate` on terminal
1. Run `node bin/www` on root folder
