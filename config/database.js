module.exports = {
    development: {
        username: process.env.dev_db_username,
        password: process.env.dev_db_password,
        database: process.env.dev_db_database,
        host: process.env.dev_db_host,
        dialect: process.env.dev_db_dialect
    },
    test: {
        username: process.env.test_db_username,
        password: process.env.test_db_password,
        database: process.env.test_db_database,
        host: process.env.test_db_host,
        dialect: process.env.test_db_dialect,
        logging: false
    },
    production: {
        username: process.env.prod_db_username,
        password: process.env.prod_db_password,
        database: process.env.prod_db_database,
        host: process.env.prod_db_host,
        dialect: process.env.prod_db_dialect,
        logging: false
    }
};