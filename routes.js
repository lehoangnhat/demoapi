const express = require('express')
const router = express.Router()

const middlewareUser = require('./middlewares/user')
const middlewareProduct = require('./middlewares/product')

const user = require('./controllers/user')
const product = require('./controllers/product')

//USER API ROUTE
router.post('/api/user/login', user.logIn)
router.post('/api/user/register', middlewareUser.getTokenIfExist, user.register)
router.get('/api/user/order', middlewareUser.isLoggedIn, user.getOrderHistory)
router.post('/api/user/product', middlewareUser.isLoggedIn, user.addProduct)
router.get('/api/user/product', middlewareUser.isLoggedIn, user.getMyProduct)

//PRODUCT API ROUTE
router.get('/api/product/featured', product.getFeatured)
router.get('/api/product/new', product.getNewProduct)
router.get('/api/product/search', product.searchProduct)

module.exports = router