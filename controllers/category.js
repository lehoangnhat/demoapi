let cateogry = {}
const categoryModel = require('../models/category')
const logHelper = require('../helper/logger')
const multiLanguage = require('../helper/multi-language')

cateogry.searchCategory = async (req,res)=>{
	let condition = {}
	
	if (req.query.query) {
		condition.$text = {
			$search:req.query.query || ''
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
	let result = await categoryModel.searchCategory(condition,page,limit)
    if (result) {
		res.status(200).json({
			status:'SUCCESS',
			data:result
		})
	}
	else {
		logHelper.log('error',`SEARCH CATEGORY: ${JSON.stringify(condition)}`)
		res.status(200).json({
			status:"ERROR",
			data: {
				code:'GENERAL_ERROR',
				message:multiLanguage.getString('hasError','vn')
			}
		})
	}
}

module.exports = cateogry