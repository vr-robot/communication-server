const cors = require('cors')
const express = require('express')
const app = express()
const port = (parseInt(process.env.PORT) || 5000)

// http server setup
app.use(cors({
    origin: "*"
}))

app.get('/', (req, res) => {
  console.log('sent response')
  res.send('If you are on a Verizon network, please make a request to http://155.146.4.228')
})

// create socket and http servers
let WSServer = require('ws').Server;
let server = require('http').createServer();

// Create web socket server on top of a regular http server
let wss = new WSServer({
  server: server
});

wss.on('connection', function connection (ws) {
  console.log('client connected')

  ws.on('message', (message) => {
    try {
      // get the message sent in json format
      const messageObj = JSON.parse(message);

      // send camera stream data to all clients
      if(messageObj.sender === 'camera') {
        const dataObj = {
          'sender': 'camera',
          'base64': `${messageObj.base64}`
        };

        const dataStr = JSON.stringify(dataObj);

        wss.clients.forEach(function each(client) {
          client.send(dataStr);
        });
      }
    }
    catch(e) {
      // message is not in a valid json format
      console.log('invalid message', message);
    }
  });
});

// mount the http server app
server.on('request', app);

// make server listen on the port specified
server.listen(port, function() {
  console.log(`http/ws server listening on ${port}`);
});
