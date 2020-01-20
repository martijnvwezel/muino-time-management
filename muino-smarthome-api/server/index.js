// config should be imported before importing any other file
const config = require('./config/config');
const app = require('./config/express');
require('./config/mongoose');


// const port =  process.argv[2] || config.port;
const port =   config.port;

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912

//rs
if (!module.parent) {
  app.listen(port, () => {
    console.info(`Server started on port ${config.port} (${config.env})`);
  }); 
}

