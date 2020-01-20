'use strict';
const Joi = require('joi');

// require and configure dotenv, will load vars in .env in PROCESS.ENV
require('dotenv').config();


// define validation for all the env vars
const envVarsSchema = Joi.object({
  NODE_ENV: Joi.string().allow(['development', 'production', 'test', 'provision']).default('development'),
  SERVER_PORT: Joi.number().default(4040),
  MONGOOSE_DEBUG: Joi.boolean().when('NODE_ENV', {
    is: Joi.string().equal('development'),
    then: Joi.boolean().default(true),
    otherwise: Joi.boolean().default(false)
  }),
  JWT_SECRET: Joi.string().required().description('JWT Secret required to sign'),
  MONGO_HOST: Joi.string().required().description('Mongo DB host url  database muino'),
  // MONGO_HOST_SENSOR: Joi.string().required().description('Mongo DB host url database sensor'),
  REDIS_HOST: Joi.string().description('Redis host url database sensor'),
  REDIS_PORT: Joi.number().default(6379),
  MONGO_PORT: Joi.number().default(27017),
  DISABLE_STATIC_SERVE: Joi.boolean().default(false),
  MONGO_USER: Joi.string().description('MONGO Secret required to sign'),
  MONGO_PWD: Joi.string().description('MONGO Secret required to sign'),

  SMTP_PORT: Joi.number().default(587),
  SMTP_HOST: Joi.string().description('SMTP server url'),
  SMTP_SECURE: Joi.boolean().default(false),
  SMTP_USER: Joi.string().description('SMTP email'),
  SMTP_PASS: Joi.string().description('SMTP Secret required to sign'),
  CONTACTFORM_WATCHER: Joi.string().description('EMAIL of a contactfrom watcher'),
}).unknown()
  .required();

const { error, value: envVars } = Joi.validate(process.env, envVarsSchema);
if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const config = {
  env: envVars.NODE_ENV,
  port: envVars.SERVER_PORT,
  mongooseDebug: envVars.MONGOOSE_DEBUG,
  jwtSecret: envVars.JWT_SECRET,
  frontend: 'angular',
  loaderio_enable: envVars.LOADERIOeNABLE,
  mongo: {
    host: envVars.MONGO_HOST,
    port: envVars.MONGO_PORT,
    mongouser: envVars.MONGO_USER,
    mongopwd: envVars.MONGO_PWD
  },
  redis: {
    host: envVars.REDIS_HOST,
    port: envVars.REDIS_PORT
  },
  email: {
    smtp_port: envVars.SMTP_PORT,
    smtp_host: envVars.SMTP_HOST,
    smtp_secure: envVars.SMTP_SECURE,
    smtp_user: envVars.SMTP_USER,
    smtp_pass: envVars.SMTP_PASS,
    contactfromUser: envVars.CONTACTFORM_WATCHER
  },
  disable_static_serve: envVars.DISABLE_STATIC_SERVE
};

module.exports = config;
