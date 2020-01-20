
# Muino Time Management
The Muino Time Management/ accounting tool for keeping track of your hours on projects and tasks.  

# URLs 
Some list of URLs
* [Sales webpage for companies](https://sales.muino.nl)
* [docker hub with latest version](https://hub.docker.com/r/muino/time-management)
* [telegram](https://t.me/Muinonl)

# Start developing on Muino

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
Be aware that you need a MongDB, and Redis version running. Redis will be reconsidered, so it can be removed in the future branches.
``` bash 
cd muino-smarthome-api/
npm run start # This command build the frontend and start the backend

```

## Production
For the production of pre-build docker on docker-hub.
``` bash 
./build_docker.sh

```
