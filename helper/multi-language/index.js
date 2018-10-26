let multiLanguage = {}
let dict = {}

dict.vn = require('./vn.json')

multiLanguage.getString = (key,lang) => {
	if (dict[lang]) {
		if (dict[lang][key]) {
			return dict[lang][key]
		}
		else {
			return key
		}
	}
	else {
		return key
	}
}

module.exports = multiLanguage