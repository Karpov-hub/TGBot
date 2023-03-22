# SportsClub BE

## DB

### Create roll hse

```
sudo -u postgres psql

CRATE ROLE hse WITH SUPERUSER;

ALTER ROLE hse WITH LOGIN;

ALTER ROLE hse WITH PASSWORD 'hse';

```

### Create database scdb

```
sudo -u postgres psql

create database scdb;

GRANT ALL PRIVILEGES ON DATABASE "scdb" to hse;

```

### Run migration

```
cd BE/db
npx sequelize-cli db:migrate
```
