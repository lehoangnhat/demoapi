let order = {}
const orderModel = require('../models/order')

order.create = async (req,res)=>{
    let orderData = {
        creatorID: req.currentUser._id.toString(),
        productIDs: req.body.productIDs,
        note: req.body.note,
        shippingAddress: req.body.shippingAddress,
        status: orderModel.STATUS_APPROVED
    }

    let result = await orderModel.addOrder(orderData)
	if (result) {
		res.status(200).json({
			status:'SUCCESS',
			data:result
		})
	}
	else {
		logHelper.log('error',`ADD ORDER: ${JSON.stringify(orderData)}`)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
}

module.exports = order