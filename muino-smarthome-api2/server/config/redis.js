const config = require('./config');
const redisClient = require('redis').createClient(config.redis.port, config.redis.host);

redisClient.on('connect', function () {
    console.log('Redis client connected');
});

redisClient.on('error', function (err) {
    console.log('Something went wrong ' + err);
});




module.exports = redisClient;


