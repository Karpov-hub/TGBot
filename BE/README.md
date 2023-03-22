# HealthyFood BE

## DB

### Create roll hse

```
sudo -u postgres psql

CRATE ROLE hse WITH SUPERUSER;

ALTER ROLE hse WITH LOGIN;

ALTER ROLE hse WITH PASSWORD 'hse';

GRANT ALL PRIVILEGES ON DATABASE "hfdb" to hse;

```

### Create database hfdb

```
sudo -u postgres psql

create database hfdb;

GRANT ALL PRIVILEGES ON DATABASE "hfdb" to hse;

```

### Run migration

```
cd BE/db
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```
