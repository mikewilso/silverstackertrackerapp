const express = require('express')
const app = express()
const cors = require('cors')

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(5000, () => {
  console.log('Server started on port 5000')
})

app.use(cors())

app.get('/home', (req, res) => {
  const data = {
    message: 'Michael'
  }
  res.send(data)
})