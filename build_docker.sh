#!/bin/bash

# NOT WORKING NO GIT PULL
git -C muino-angular/  checkout -f master
git -C muino-angular/  pull origin  master

git -C muino-smarthome-api/  checkout -f master
git -C muino-smarthome-api/  pull origin master

git submodule update --recursive --remote

echo "$(date)"
GIT_DIRTY=`git rev-parse HEAD`
docker login -u "$REGISTRYDOCKER_USER" -p "$REGISTRYDOCKER_PASSWORD" registry.muino.nl/muino-smarthome:latest
echo "docker pull registry.muino.nl/muino-smarthome:latest || true"
docker pull registry.muino.nl/muino-smarthome:latest || true
echo "docker build --cache-from registry.muino.nl/muino-smarthome:latest --tag registry.muino.nl/muino-smarthome:$GIT_DIRTY --tag registry.muino.nl/muino-smarthome:latest ."
# docker build  --tag registry.muino.nl/muino-smarthome:$GIT_DIRTY --tag registry.muino.nl/muino-smarthome:latest .
docker build --cache-from registry.muino.nl/muino-smarthome:latest --tag registry.muino.nl/muino-smarthome:$GIT_DIRTY --tag registry.muino.nl/muino-smarthome:latest .
echo "docker push registry.muino.nl/muino-smarthome:$GIT_DIRTY"
docker push registry.muino.nl/muino-smarthome:$GIT_DIRTY
echo "docker push registry.muino.nl/muino-smarthome:latest"
docker push registry.muino.nl/muino-smarthome:latest

echo "$(date)"
echo "Wait for 5 sec..."
sleep 5

ssh muino.nl   "./scripts-git/docker/muino-smarthome.sh"
ssh muino.nl   "dm"