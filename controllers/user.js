let user = {}
const userModel = require('../models/user')
const productModel = require('../models/product')
const md5 = require('md5')
const jwt = require('jsonwebtoken')
const randtoken = require('rand-token') 
const multiLanguage = require('../helper/multi-language')
const logHelper = require('../helper/logger')

let refreshTokens = {}

user.logIn = async (req,res) => {
	let condition = {
		username:req.body.username
	}
	let fetchResults = await userModel.getUsers(condition)
	if (fetchResults.status==="ERROR") {
		logHelper.log('error',fetchResults.data)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
	else if (fetchResults.data.total===0) {
		logHelper.log('error',`LOGIN FAIL - USERNAME: ${req.body.username}`)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'WRONG_CREDENTIAL',
				message:multiLanguage.getString('loginFail','vn')
			}
		})
	}
	else {
		let userData = fetchResults.data.items[0]
		let password = md5(md5(req.body.password)+userData.encryptKey)
		if (password!==userData.password) {
			logHelper.log('error',`LOGIN FAIL - USERNAME: ${req.body.username}`)
			res.status(200).json({
				status:"ERROR",
				data: {
					code:'WRONG_CREDENTIAL',
					message:multiLanguage.getString('loginFail','vn')
				}
			})
		}
		else {
			if (req.headers['deviceid']) {
				let updateData = {
					condition:{
						username:userData.username
					},
					data:{
						deviceIDList: userData.deviceIDList.push(req.headers['deviceid']) || [req.headers['deviceid']]
					}
				}
				userModel.updateUser(updateData)
			}
			delete userData.password
			delete userData.encryptKey
			userData.token = jwt.sign(userData, '1ClickSecretKey@23101995', {
				expiresIn : '3d'
			});
			userData.refreshToken = randtoken.uid(256)
			refreshTokens[userData.refreshToken] = req.body.username
			res.status(200).json({
				status:'SUCCESS',
				data:userData
			})
		}
	}
}

user.register = async (req,res)=>{
	let userData = {
		username: req.body.username,
		password: req.body.password,
		lastName: req.body.lastName,
		firstName: req.body.firstName,
		dob: req.body.dob,
		dateCreated: Date.now(),
		dateModified:0
	}
	if (req.body.role && req.currentUser && req.currentUser.role===userModel.ROLE_ADMIN) {
		userData.role = req.body.role
	}
	let getUser = await userModel.getUsers({username:req.body.username})
	if (getUser) {
		if (getUser.data.total>0) {
			res.status(200).json({
				status:"ERROR",
				data: {
					code:'USERNAME_EXIST',
					message:multiLanguage.getString('usernameExist','vn')
				}
			})
		}
		else {
			let results = await userModel.addUser(userData)
			if (results) {
				res.status(200).json({
					status:'SUCCESS',
					data:results
				})
			}
			else {
				logHelper.log('error',results.data)
				res.status(200).json({
					status:"ERROR",
					data: {
						code:'GENERAL_ERROR',
						message:multiLanguage.getString('hasError','vn')
					}
				})
			}
		}
	}
	else {
		logHelper.log('error',getUser.data)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
}

user.refreshToken = async (req,res)=>{
	let username = req.body.username
	let refreshToken = req.body.refreshToken
	if(refreshTokens[refreshToken] == username) {
	    let condition = {
			username:req.body.username
		}
		let fetchResults = await userModel.getUsers(condition)
		if (fetchResults.status==="ERROR") {
			logHelper.log('error',data)
			res.status(200).json({
				status:"ERROR",
				data: {
					code:'GENERAL_ERROR',
					message:multiLanguage.getString('hasError','vn')
				}
			})
		}
		else if (fetchResults.data.total===0) {
			logHelper.log('error',`LOGIN FAIL - USERNAME: ${req.body.username}`)
			res.status(200).json({
				status:"ERROR",
				data: {
					code:'WRONG_CREDENTIAL',
					message:multiLanguage.getString('loginFail','vn')
				}
			})
		}
		else {
			let userData = fetchResults.data.items[0]
			delete userData.password
			delete userData.encryptKey
			userData.token = jwt.sign(data, req.app.get('superSecret'), {
				expiresIn : '3d'
			});
			userData.refreshToken = randtoken.uid(256)
			refreshTokens[userData.refreshToken] = req.body.username
			delete refreshToken[refreshToken]
			res.status(200).json({
				status:'SUCCESS',
				data:userData
			})
		}
  	}
  	else {
	    res.status(200).json({
	    	status:'fail',
	    	data:{
	    		code:'REFRESH_TOKEN_INVALID',
	    		message:multiLanguage.getString('wrongToken','vn')
	    	}
	    })
  	}
}

user.getProfile = async (req,res) => {
	let userData = await userModel.getUsers({_id: req.params.userID})
	if (userData.status === "ERROR") {
		logHelper.log('error',data)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
	else if (userData.data.total === 0) {
		res.status(200).json({
			status:"SUCCESS",
			data: {
				code:'USER_NOT_FOUND',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	} 
	else {
		res.status(200).json({
			status:"SUCCESS",
			data: userData.data.items[0]
		})
	}
}

user.updateProfile = async (req,res) => {
	let newData = {}
	if (req.body.lastName) {
		newData.lastName = req.body.lastName
	}
	if (req.body.firstName) {
		newData.firstName = req.body.firstName
	}

	if (req.body.email) {
		newData.email = req.body.email
	}

	if (req.body.address) {
		newData.address = req.body.address
	}

	if (req.body.dob) {
		newData.dob = req.body.dob
	}
	let condition = {
		_id: req.currentUser._id.toString()
	}
	if (req.currentUser.role === userModel.ROLE_ADMIN && req.body._id) {
		condition._id = req.body._id
	}
	let updateUser = await userModel.updateUser({condition: condition, data: newData})
	if (updateUser.status==="ERROR") {
		logHelper.log('error',data)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
	else {
		res.status(200).json(updateUser)
	}
}

user.getOrderHistory = async (req,res)=>{
	let fetchResults = await userModel.getOrder(req.currentUser._id.toString())
	if (fetchResults.status==="ERROR") {
		logHelper.log('error',data)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
	else {
		res.status(200).json(fetchResults)
	}
}

user.addProduct = async (req,res)=>{
	let productData = {
		name:req.body.name,
		price:req.body.price,
		quantity:req.body.quantity,
		tags:req.body.tags || [],
		images:req.body.images || [],
		categoryID:req.body.categoryID,
		description:req.body.description || "",
		creatorID: req.currentUser._id,
		dateCreated: Date.now(),
		dateModified:0,
		status:productModel.STATUS_NOT_VERIFED
	}

	if (req.currentUser.role === userModel.ROLE_ADMIN) {
		productData.featured = true
		productData.status = productModel.STATUS_VERIFIED
	}
	else {
		productData.featured = false
	}

	let result = await productModel.addProduct(productData)
	if (result) {
		res.status(200).json({
			status:'SUCCESS',
			data:result
		})
	}
	else {
		logHelper.log('error',`ADD PRODUCT: ${JSON.stringify(productData)}`)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
}

user.getMyProduct = async (req,res) => {
	let page = 1
	let limit = 30
	if (req.query.page) {
		page = parseInt(req.query.page,10)
	}
	if (req.query.limit) {
		limit = parseInt(req.query.limit,10)
	}
	let condition = {
		creatorID:req.currentUser._id.toString()
	}
	let result = await productModel.searchProduct(condition,page,limit)
	if (result) {
		res.status(200).json({
			status:'SUCCESS',
			data:result
		})
	}
	else {
		logHelper.log('error',`SEARCH PRODUCT: ${JSON.stringify(condition)}`)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
}

module.exports = user