# TGBot

## Install on local host

Clone mono repo

```
git clone git@github.com:Karpov-hub/TGBot.git
```

or

```
git clone https://github.com/Karpov-hub/TGBot.git
```

Install node modules

```
npm install
```

### Install Redis

you need to install WLS2 (ubunty)

```
https://redis.io/docs/getting-started/installation/install-redis-on-windows/

```

### Requirements

- Node 22
- Postgres 11
- Redis

## DB

```
sudo -u postgres psql

create database tbdb;

GRANT ALL PRIVILEGES ON DATABASE "tbdb" to hse;
```

### Run migration

```
cd packages/db
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

## Run Server work

Start our services

```
npm start
```

Start Redis service in WSL(ubuntu) terminal

```
sudo service redis-server start
```
