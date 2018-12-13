let user = {}
const multiLanguage = require('../helper/multi-language')
const jwt = require('jsonwebtoken')

user.isLoggedIn = (req,res,next) => {
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['token'];
	
	if (token) {
		jwt.verify(token, req.app.get('superSecret'), (err,decoded)=>{
			if (err) {
				if (err.name && err.name==="TokenExpiredError") {
					res.status(200).json({
						status:"ERROR",
						data: {
							code:'TOKEN_EXPIRED',
							message:multiLanguage.getString('expiredToken','vn')
						}
					})
				}
				else {
					res.status(200).json({
						status:"ERROR",
						data: {
							code:'TOKEN_INVALID',
							message:multiLanguage.getString('wrongToken','vn')
						}
					})
				}
			}
			else {
				req.currentUser = decoded;
				next()
			}
		})
	}
	else {
		res.status(200).json({
			status:"ERROR",
			data:{
				code:'TOKEN_MISSING',
				message:multiLanguage.getString('wrongToken','vn')
			}
		})
	}
}

user.getTokenIfExist = (req,res,next)=>{
	let token = req.body.token || req.query.token || req.headers['x-access-token'] || req.headers['token'];
	
	if (token) {
		jwt.verify(token, req.app.get('superSecret'), (err,decoded)=>{
			if (err) {
				if (err.name && err.name==="TokenExpiredError") {
					res.status(200).json({
						status:"ERROR",
						data: {
							code:'TOKEN_EXPIRED',
							message:multiLanguage.getString('expiredToken','vn')
						}
					})
				}
				else {
					res.status(200).json({
						status:"ERROR",
						data: {
							code:'TOKEN_INVALID',
							message:multiLanguage.getString('wrongToken','vn')
						}
					})
				}
			}
			else {
				req.currentUser = decoded;
				next()
			}
		})
	}
	else {
		next()
	}
}

module.exports = user