const express = require('express')
const app = express()
require('dotenv').config
const helmet = require('helmet')

// app.use(helmet())

app.get('/', (req, res) => res.send('Hello'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server listening on port ${PORT}`))

