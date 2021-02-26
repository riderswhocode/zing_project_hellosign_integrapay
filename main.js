const express = require('express')
const { static } = require('express')
const cookieParser = require('cookie-parser')
const ejs = require('ejs')
const path = require('path')
require('dotenv').config()

const app = express()
const port = process.env.PORT || "3001"

app.use(cookieParser())
app.set('view engine', 'ejs')
app.use(express.json())
app.use(static(path.join(__dirname,'/public')))

const hsRoute = require('./routes/hellosign.route')
const ipRoute = require('./routes/integrapay.route')

app.use('/', hsRoute)
app.use('/', ipRoute)

app.listen(port, () => {
    console.log(`Node Server is running on Development Server under Port ${port}`)
})


