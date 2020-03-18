const http = require('http')
const express = require('express')
const port = 3000
const app = express()

app.get('/', (req, res) => {
    res.send('Hello from Express!')
})


app.listen(port, (err) => {
    if (err) {
        return console.log('error happened!', err)
    }
    console.log(`server is listening on ${port}`)
})