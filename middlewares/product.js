let product = {}
const multiLanguage = require('../helper/multi-language')

product.addProductValidate = (req,res)=>{
    if (!req.body.name) {
        res.status(200).json({
            status:"ERROR",
            data:{
				code:'PRODUCT_NAME_MISSING',
				message:multiLanguage.getString('productNameRequired','vn')
			}
        })
    }
    else if (!req.body.categoryID) {
        res.status(200).json({
            status:"ERROR",
            data:{
				code:'PRODUCT_CATEGORY_MISSING',
				message:multiLanguage.getString('productCategoryRequired','vn')
			}
        })
    }
    else if (!req.body.quantity) {
        res.status(200).json({
            status:"ERROR",
            data:{
				code:'PRODUCT_QUANTITY_MISSING',
				message:multiLanguage.getString('productQuantityRequired','vn')
			}
        })
    }
    else if (!req.body.price) {
        res.status(200).json({
            status:"ERROR",
            data:{
				code:'PRODUCT_PRICE_MISSING',
				message:multiLanguage.getString('productPriceRequired','vn')
			}
        })
    }
    else {
        next()
    }
}

module.exports = product