const express = require('express')
const app = express()
const http = require('http')
const socketIO = require('socket.io')
const path = require('path');

const PORT = process.env.PORT || 5000

const server = http.createServer(app)

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

const io = socketIO(server)

module.exports.io = io;

const SocketManager = require('./SocketManager')

io.on('connection', SocketManager)

server.listen(PORT, () => console.log(`server has started on ${PORT}`));
