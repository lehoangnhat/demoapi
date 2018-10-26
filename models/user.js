let user = {}
const dbService = require('../helper/dbService')
const md5 = require('md5')

user.STATUS_ACTIVE = 1
user.STATUS_INACTIVE = 0

user.ROLE_ADMIN = 1
user.ROLE_USER = 2

const mapData = (rawData)=>{
    rawData.fullName = `${rawData.lastName} ${rawData.firstName}`
    return rawData
}

const makeKey = () => {
	let text = "";
	let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < 20; i++)
	  	text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

user.addUser = async (userData)=>{
	userData.encryptKey = makeKey()
	userData.password = md5(md5(userData.password)+userData.encryptKey)
	userData.deviceIDList = []

	if (!userData.role) {
		userData.role = user.ROLE_USER
	}

	let userObj = {
		collection:'users',
		data:userData
	}

	let result = await dbService.query("create",userObj)
	if (result.status==="SUCCESS") {
		result = result.data
	}
	else {
		result = false
	}

	return result
}

user.getUsers = async (condition)=>{
	let userObj = {
		collection:'users',
		condition:condition
	}
	let results = await dbService.query("read",userObj)
	if (results.status==="SUCCESS") {
		results.data = mapData(results.data)
	}
	return results
}

user.getOrder = async (userID)=>{
	let orderObj = {
		collection:'orders',
		condition:{
			creatorID:userID
		}
	}
	let results = await dbService.query("read",orderObj)
	return results
}

user.updateUser = async (updateData)=>{
	updateData.collection = 'users'
	
	let results = await dbService.query("update",updateData)
	if (results.status==="SUCCESS") {
		results.data = mapData(results.data)
	}
	return results
}

module.exports = user