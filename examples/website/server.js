/*
 *  server.js
 *
 */


var http = require("http");
http.createServer(function (req, res) {
  res.end("Hello world");
}).listen(8080);