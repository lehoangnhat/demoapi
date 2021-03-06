let category = {}
const dbService = require('../helper/dbService')

category.searchCategory = async (condition,page,limit) => {
    let categoryObj = {
        collection:'categories',
        condition:condition,
        page:1,
        limit:30
    }

    if (page) {
        categoryObj.page = page
    }

    if (limit || limit===0) {
        categoryObj.limit = limit
    }
    let result = await dbService.query("read",categoryObj)
    if (result.status==="SUCCESS") {
		result = result.data
	}
	else {
		result = false
	}

	return result
}

module.exports = category