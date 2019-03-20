# remember env vars on OS
# NODE_ENV
# dev_db_username
# dev_db_password
# dev_db_database
# dev_db_host
# dev_db_dialect
# chatkit_instance_prefix
# chatkit_instance
# chatkit_secret_key_id
# chatkit_secret_key
# chatkit_token_expiry

node deleteData.js
cd ../../../../
sequelize db:drop
sequelize db:create 
sequelize db:migrate 
cd db/seeders/production/stage3
node createData.js
