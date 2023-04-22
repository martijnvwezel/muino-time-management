FROM node:latest as builder

WORKDIR /usr/src/app
ADD muino-angular/ /usr/src/app

RUN npm install --production
j

RUN npm run build

FROM mhart/alpine-node:latest

RUN apk update

WORKDIR /usr/src/app
ADD muino-smarthome-api/ /usr/src/app

RUN apk --no-cache add --virtual builds-deps build-base python
RUN npm config set python /usr/bin/python
RUN npm i -g npm


RUN mkdir dist/ || true
COPY --from=builder /usr/src/app/dist/ /usr/src/app/dist/
RUN ls -la /usr/src/app/dist/
RUN npm install --production
RUN npm rebuild bcrypt --build-from-source || true
# RUN npm i -g pm2

RUN apk del builds-deps



EXPOSE 80

# CMD ["pm2", "start", "processes.json", "--no-daemon"]
CMD ["node", "server"]