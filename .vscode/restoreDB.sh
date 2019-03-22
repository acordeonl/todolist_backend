export NODE_ENV="development"

export dev_db_username="postgres"
export dev_db_password="Curramba2018"
export dev_db_database="key_conservation_development"
export dev_db_host="localhost"
export dev_db_dialect="postgres"

export test_db_username="postgres"
export test_db_password="Curramba2018"
export test_db_database="key_conservation_test"
export test_db_host="localhost"
export test_db_dialect="postgres"

export prod_db_username="postgres"
export prod_db_password="Curramba2018"
export prod_db_database="key_conservation_production"
export prod_db_host="localhost"
export prod_db_dialect="postgres"

# chatkit development
export chatkit_instance_prefix="v1:us1"
export chatkit_instance="15ed1216-3ff6-4fc1-a3b4-40573d30c8c3"
export chatkit_secret_key_id="b5268bb5-bda6-494b-af04-5185016744bd"
export chatkit_secret_key="NxTYKOic9/u5Pr4DzCcaPfoUJAnaotI30xab5W9NPyw="
export chatkit_token_expiry="86400"

# chatkit test
# export chatkit_instance_prefix="v1:us1"
# export chatkit_instance="0b2f925e-747b-414b-944a-172bc2f5d106"
# export chatkit_secret_key_id="40f9e329-789a-442d-92d6-c0984ee34fb3"
# export chatkit_secret_key="cP5S6KZKyi+KeB8hIqphL2gmCS5gTHf5RGhPNfGKOAg="
# export chatkit_token_expiry="86400"

# chatkit production
# export chatkit_instance_prefix="v1:us1"
# export chatkit_instance="6dd6c8a4-0f8e-4132-9868-5443a2319b28"
# export chatkit_secret_key_id="8d26bf35-4d2c-47a9-8ef9-28e8da046938"
# export chatkit_secret_key="i83YbBssv+yH6tYJ/Od+8yOL20hOLEZjkOm6chRS+2A="
# export chatkit_token_expiry="86400"

cd ../db/seeders/development/stage3
bash restoreDB.sh