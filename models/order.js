let order = {}
const dbService = require('../helper/dbService')

order.STATUS_CANCELED = 0
order.STATUS_APPROVED = 1
order.STATUS_SHIPPING = 2
order.STATUS_COMPLETED = 3

order.addOrder = async (orderData) => {
    orderData.dateCreated = Date.now()
    orderData.dateModifed = 0

    let orderObj = {
        collection:'orders',
        data:orderData
    }

    let result = await dbService.query("create",orderObj)
	if (result.status==="SUCCESS") {
		result = result.data
	}
	else {
		result = false
	}

	return result
}

module.exports = order