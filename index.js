const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "*"
}))

app.get('/', (req, res) => {
  console.log('sent response')
  res.send('Hello World from Wavelength! If you are on a Verizon network, make a request to http://155.146.4.228. Otherwise, make a request to http://18.232.126.27.')
})

let WSServer = require('ws').Server;
let server = require('http').createServer();

// Create web socket server on top of a regular http server
let wss = new WSServer({
  server: server
});

// Also mount the app here
server.on('request', app);

wss.on('connection', function connection (ws) {

  console.log('client connected')

  ws.on('message', (message) => {
    // ws.send(JSON.stringify({
    //   answer: 42
    // }));

    // console.log(`received message`);

    let messageObj;

    try {
      messageObj = JSON.parse(message);

      // console.log(messageObj.base64)

      // send camera stream to all clients
      if(messageObj.sender === 'camera') {
        const dataStr = JSON.stringify({
          'sender': 'camera',
          'base64': `${messageObj.base64}`
        });

        // ws.send('hi')
        // console.log('sending', dataStr);
        //
        // console.log('sending hi')
        // ws.send(JSON.stringify({
        //   answer: 43
        // }));
        wss.clients.forEach(function each(client) {
          client.send(dataStr);
        });
        // ws.send(dataStr);
      }
    }
    catch(e) {
      console.log('invalid message', message);
    }
  });
});


server.listen(port, function() {

  console.log(`http/ws server listening on ${port}`);
});
