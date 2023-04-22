
# Muino Time Management
The Muino Time Management/ accounting tool for keeping track of your hours on projects and tasks.

# URLs
Some list of URLs
* [Sales webpage for companies](https://sales.muino.nl)
* [docker hub with latest version](https://hub.docker.com/r/muino/time-management)
* [telegram](https://t.me/Muinonl)


# Feature requests
* Setting to give a user a selection that it can only submit 24 hours a day.
* Clockyfi intergration
* SQL database instead of MongoDB (PostgresSQL; will be the probably been chosen)
* hour schema instead of starting from `00:00` till `xx:xx`, too `start = (now)` and `end = (now - xx:xx)`
* Adding automatically managment api to the backend










# Start developing on Muino
Note: Node.js should be >10.9, and you should have installed MongoDB.
## Installation
``` bash
cd muino-angular/
npm install

cd ../

cd muino-smarthome-api/
npm install

# change .env to your need
cp .env.example .env

```

## Developing
Note: Node.js should be >10.9, and you should have installed MongoDB.
``` bash
# running in the same terminal (not recommended)
sudo /usr/bin/mongod --unixSocketPrefix=/var/lib/mongodb --config /etc/mongod.conf &

# running in a different terminal
sudo /usr/bin/mongod --unixSocketPrefix=/var/lib/mongodb --config /etc/mongod.conf
# Note: can be mongodb.conf
```

db.createUser({user: "root", pwd: "password", roles: [{role: "userAdminAnyDatabase", db: "admin"}]})
<!-- C:\Program Files\MongoDB\Server\4.4\bin\mongod.cfg -->

disable firewall

mongodb://192.168.1.152:27017


``` bash
cd muino-smarthome-api/


npm run start # This command build the frontend and start the backend

```
## ADMIN user
Register with the following email adress to the account: `martijnvwezel@muino.nl` for admin rights.


## Production
### Build a docker
For the production of pre-build docker on docker-hub.
``` bash
./build_docker.sh

```

### Run on the docker
There are many environments variables, so it will be logical to add those in a docker compose file. Please, checkout docker compose and the `docker-compose.yml`. At the moment documantion is being written, and will be shortly be posted here.







