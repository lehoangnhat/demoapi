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

const getRelatedBM25 = (productA, productB) => {
	let tagA = productA.tags || []
	let tagB = productB.tags || []
	let countCommonTag = 0
	tagA.forEach((tag)=>{
		if (tagB.indexOf(tag)!==-1) {
			countCommonTag += 1
		}
	})
	return countCommonTag / ((tagA.length + tagB.length)/2)
}

product.getRelatedProduct = async (req,res)=>{
	let productList = await productModel.searchProduct({
		id:{
			$ne: req.params.productID
		},
		tags:{
			$ne:[]
		},
		
	},1,0)
	
	if (productList && productList.total > 0) {
		productList = productList.items.filter((product)=>{
			return product.id !== parseInt(req.params.productID,10)
		})
		
		let productDetail = await productModel.getDetail(req.params.productID);
		productList.map((product)=>{
			product.relativity = getRelatedBM25(product, productDetail)
			return product
		})
		productList = productList.sort((productA,productB)=>{
			return productB.relativity - productA.relativity
		})
		let result = {
			total: productList.length,
			page: 1,
			limit: 10
		}
		if (req.query.page) {
			result.page = parseInt(req.query.page,10)
		}
		if (req.query.limit) {
			result.limit = parseInt(req.query.limit,10)
		}

		result.items = productList.slice((result.page-1)*result.limit,result.page*result.limit)
		
		res.status(200).json({
			status:"SUCCESS",
			data: result
		})
	}
	else {
		logHelper.log('error',`GET RELATED PRODUCT: ${JSON.stringify(req.params.productID)}`)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
}

product.updateProduct = async (req,res) => {
	let productData = {
		dateModified: Date.now(),
		status:productModel.STATUS_NOT_VERIFED
	}
	if (req.body.name) {
		productData.name = req.body.name
	}
	if (req.body.price) {
		productData.price = req.body.price
	}
	if (req.body.quantity) {
		productData.quantity = req.body.quantity
	}
	if (req.body.tags) {
		productData.tags = req.body.tags
	}
	if (req.body.images) {
		productData.images = req.body.images
	}
	if (req.body.categoryID) {
		productData.categoryID = req.body.categoryID
	}
	if (req.body.description) {
		productData.description = req.body.description
	}
	if (req.body.pstate) {
		productData.pstate = req.body.pstate
	}
	if (req.body.status) {
		productData.status = req.body.status
	}
	let updateData = {
		condition:{
			id: parseInt(req.params.productID,10)
		},
		data:productData
	}
	let result = await productModel.updateProduct(updateData)
	if (result) {
		res.status(200).json({
			status:'SUCCESS',
			data:result
		})
	}
	else {
		logHelper.log('error',`UPDATE PRODUCT: ${JSON.stringify(condition)}`)
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
		},
		
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