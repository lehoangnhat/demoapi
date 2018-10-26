const express = require('express');
const app = express()
const bodyParser = require('body-parser');
const cors = require('cors')
const winston = require('winston')
const { format } = require('winston');

const config = require('./config');
const limit = require('./rate_limit')

app.enable('trust proxy')
app.use(bodyParser.json({limit:'4mb'}));

const logger = winston.createLogger({
	format: format.combine(
		format.splat(),
		format.simple()
	),
  	transports: [
    	new winston.transports.File({ filename: './logs/error.log', level: 'error' }),
    	new winston.transports.File({ filename: './logs/info.log', level:'info' }),
    	new winston.transports.File({ filename: './logs/debug.log', level:'debug' })
  	]
})

global.baseRoot = __dirname + '/'
global.logger = logger

app.use(cors())

let route = require(`./routes`)
app.use('/',limit.apiLimiter,route)

app.options('*',cors())

app.get('*', (req, res) => res.send('DIRECT ACCESS NOT ALLOWED'))

let port = process.env.PORT || 9997;

app.listen(port, () => console.log(`1CLICK API ON PORT ${port}!`))