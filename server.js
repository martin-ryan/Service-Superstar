'use strict';
//
const Hapi = require('hapi');
const inert = require('inert');

//
// Create a server with a host and port
const server = new Hapi.Server();
server.connection({
    host: 'localhost',
    port: 3000
});

//
//
server.register(inert, (err) => {
    if (err) {
        throw err;
    }

  server.route({
      method: 'GET',
      path:'/',
      handler: function (request, reply) {
        reply.file("public/dist/index.html");
      }
  });
});

//
// Start the server
server.start((err) => {

    if (err) {
        throw err;
    }
    console.log('Server running at:', server.info.uri);
});
