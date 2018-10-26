let dbService = {}
const config = require('./config')
const logHelper = require('../logger')
const axios = require('axios')

dbService.query = async (method,params)=>{
    try {
        let results = await axios.post(`${config.dbServiceURL}/query`,{
            method:method,
            params:params
        })
        return({
            status:results.data.status,
            data:results.data.message
        })
    } catch (error) {
        console.log(error)
        return({
            status:"ERROR",
            data:error
        })
    }
}

module.exports = dbService