const express = require('express')
const router = express.Router()

const middlewareUser = require('./middlewares/user')
const middlewareProduct = require('./middlewares/product')

const user = require('./controllers/user')
const product = require('./controllers/product')
const category = require('./controllers/category')
const order = require('./controllers/order')

//USER API ROUTE
router.post('/api/user/login', user.logIn)
router.post('/api/user/register', middlewareUser.getTokenIfExist, user.register)
router.get('/api/user/order', middlewareUser.isLoggedIn, user.getOrderHistory)
router.post('/api/user/product', middlewareUser.isLoggedIn, user.addProduct)
router.post('/api/user/order', middlewareUser.isLoggedIn, order.create)
router.get('/api/user/product', middlewareUser.isLoggedIn, user.getMyProduct)
router.get('/api/user/:userID', user.getProfile)
router.put('/api/user/', middlewareUser.isLoggedIn, user.updateProfile)

//PRODUCT API ROUTE
router.get('/api/product/featured', product.getFeatured)
router.get('/api/product/new', product.getNewProduct)
router.get('/api/product/search', product.searchProduct)
router.get('/api/product/related/:productID', product.getRelatedProduct)
router.put('/api/product/:productID', product.updateProduct)

//PRODUCT CATEGORY API ROUTE
router.get('/api/category/search', category.searchCategory)

module.exports = router