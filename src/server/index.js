const app = require('http').createServer()
const io = module.exports.io = require('socket.io')(app)

const PORT = process.env.PORT || 5000

const SocketManager = require('./SocketManager')

io.on('connection', SocketManager)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('build'));

  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server Starts on ${PORT}`);
});
