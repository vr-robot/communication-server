const cors = require('cors')
const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.use(cors({
    origin: "*"
}))

const http = require('http').Server(app)

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
})

io.on('connection', (socket) => {
    console.log(`${socket.id} connected`)

    // someone sent a message
    socket.on('send_message', msg => {
        console.log(`sending message from ${socket.id}`);
        // send message to everyone connected to socket server
        io.emit('message_sent', msg);
    })

    // when someone disconnects
    socket.on('disconnect', () => {
        console.log(`${socket.id} disconnected`);
    })
})

app.get('/', (req, res) => {
  console.log('sent response')
  res.send('Hello World from Wavelength! If you are on a Verizon network, make a request to http://155.146.4.228. Otherwise, make a request to http://18.232.126.27.')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
