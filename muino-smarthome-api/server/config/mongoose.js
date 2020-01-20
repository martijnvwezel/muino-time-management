'use strict';
const mongoose = require('mongoose');
const util = require('util');
const debug = require('debug')('express-mongoose-es6-rest-api:index');

const config = require('./config');

// connect to mongo db
const mongoUri = config.mongo.host;
let vier = {
  user: config.mongo.mongouser,
  pass: config.mongo.mongopwd,
  mongoUri
};
console.log(vier);

if (config.mongo.mongouser) {
  try {
     mongoose.connect(mongoUri, {
      keepAlive: 1,
      useNewUrlParser: true,
      user: config.mongo.mongouser,
      pass: config.mongo.mongopwd
    });
  } catch (error) {
    handleError(error);
  }
} else {
  console.log("\nNo mongodb user and password!\n");


  mongoose.connect(mongoUri, {
    keepAlive: 1,
    useNewUrlParser: true
  });

}
mongoose.set('useCreateIndex', true);
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri} with user ${config.mongo.mongouser} `);
});


// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

