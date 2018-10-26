let logHelper = {}

const addZero = (num) => {
	if (num<10) {
		return `0${num}`
	}
	else {
		return `${num}`
	}
}

logHelper.error = (message) => {
	logHelper.log('error',message)
}

logHelper.info = (message) => {
	logHelper.log('info',message)
}

logHelper.debug = (message) => {
	logHelper.log('debug',message)
}

logHelper.log = (type,message)=> {
	const date = new Date()
	const dateString = `${addZero(date.getDate())}/${addZero(date.getMonth()+1)}/${addZero(date.getFullYear())}`
	const timeString = `${addZero(date.getHours())}:${addZero(date.getMinutes())}:${addZero(date.getSeconds())}`
	logger.log({
		level:type,
		message:`${dateString} ${timeString}: ${message}`
	})
}

module.exports = logHelper