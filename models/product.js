let product = {}
const dbService = require('../helper/dbService')

product.STATUS_VERIFIED = 1
product.STATUS_NOT_VERIFED = 0
product.STATUS_INACTIVE = 2

const mapData = (rawData)=>{
    return rawData
}

product.updateProduct = async (updateData) => {
    updateData.collection = 'products'
	
    let results = await dbService.query("update",updateData)
	if (results.status==="SUCCESS") {
		results.data = mapData(results.data)
    }
    else {
        results = false
    }
	return results
}

product.addProduct = async (productData)=>{
    productData.dateCreated = Date.now()
    productData.dateModifed = 0

    let productObj = {
        collection:'products',
        data:productData
    }

    let currentProduct = await product.searchProduct({},1,1)
    
    if (currentProduct) {
        productData.id = currentProduct.total + 1
        let result = await dbService.query("create",productObj)
        if (result.status==="SUCCESS") {
            result = result.data
        }
        else {
            result = false
        }
    }
    return currentProduct
}

product.getDetail = async (productID) => {
    let productObj = {
        collection:'products',
        condition:{
            id: productID
        }
    }

    let result = await dbService.query("read",productObj)
    if (result.status==="SUCCESS") {
        result = result.data
        if (result.total > 0) {
            result = result.items[0]
        }
	}
	else {
		result = false
	}

	return result
}

product.searchProduct = async (condition,page,limit) => {
    let productObj = {
        collection:'products',
        condition:condition,
        page:1,
        limit:30
    }

    if (page) {
        productObj.page = page
    }

    if (limit || limit===0) {
        productObj.limit = limit
    }

    let result = await dbService.query("read",productObj)
    if (result.status==="SUCCESS") {
		result = result.data
	}
	else {
		result = false
	}

	return result
}

module.exports = product