let limit = {}
const RateLimit = require('express-rate-limit')

limit.apiLimiter = new RateLimit({
  	windowMs: 15*60*1000, // 15 minutes
  	max: 10000,
  	delayMs: 0 // disabled
});

module.exports = limit