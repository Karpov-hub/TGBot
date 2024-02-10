# TGBot BE

## DB

### Create roll hse

```
sudo -u postgres psql

CRATE ROLE hse WITH SUPERUSER;

ALTER ROLE hse WITH LOGIN;

ALTER ROLE hse WITH PASSWORD 'hse';

```

### Create database tbdb

```
sudo -u postgres psql

create database tbdb;

GRANT ALL PRIVILEGES ON DATABASE "tbdb" to hse;

```

### Run migration

```
cd BE/db
npx sequelize-cli db:migrate
```

# TGBot

## Install on local host

Clone mono repo

```
git clone git@github.com:Karpov-hub/sports-club.git
```

or

```
git clone https://github.com/Karpov-hub/sports-club.git
```

Install yarn

```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update && sudo apt install yarn
```

```
npm install -g verdaccio
nohup verdaccio &

npm set registry http://localhost:4873/
npm adduser --registry http://localhost:4873
Username: test
Password: test
Email: test@test.com
```

Install node modules

```
yarn
npx lerna bootstrap
```

### Requirements

- Node 16.18.0
- Postgres 11
