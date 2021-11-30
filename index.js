const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World from Wavelength! If you are on a Verizon network, make a request to http://155.146.4.228. Otherwise, make a request to http://3.82.14.59.')
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})
