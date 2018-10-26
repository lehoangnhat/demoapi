let product = {}
const productModel = require('../models/product')
const logHelper = require('../helper/logger')
const multiLanguage = require('../helper/multi-language')

product.getFeatured = async (req,res)=>{
    let condition = {
        featured:true,
        status:productModel.STATUS_VERIFIED
    }
    let result = await productModel.searchProduct(condition,1,4)
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

product.searchProduct = async (req,res)=>{
	let condition = {
		$text:{
			$search:req.query.query
		}
	}
	let page = 1
	let limit = 30
	if (req.query.page) {
        page = parseInt(req.query.page,10)
    }
    if (req.query.limit) {
        limit = parseInt(req.query.limit,10)
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

product.getNewProduct = async (req,res)=>{
    let condition = {
        status:productModel.STATUS_VERIFIED
    }
    let page = 1
    let limit = 30
    if (req.query.page) {
        page = parseInt(req.query.page,10)
    }
    if (req.query.limit) {
        limit = parseInt(req.query.limit,10)
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

module.exports = product