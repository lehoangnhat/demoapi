let product = {}
const dbService = require('../helper/dbService')

product.STATUS_VERIFIED = 1
product.STATUS_NOT_VERIFED = 0

product.addProduct = async (productData)=>{
    productData.dateCreated = Date.now()
    productData.dateModifed = 0

    let productObj = {
        collection:'products',
        data:productData
    }

    let result = await dbService.query("create",productObj)
	if (result.status==="SUCCESS") {
		result = result.data
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