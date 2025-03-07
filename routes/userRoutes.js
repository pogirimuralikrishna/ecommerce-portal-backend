const express = require('express')
const {body} = require('express-validator')
const {handleLoginRoute, handleRegisterRoute, handleAllInvoicesRoute,
      handleAddInvoiceRoute, handleDeleteInvoiceRoute,handleUpdateInvoiceRoute,
      handleAddProductRoute,handleAllProductsRoute,
      handleDeleteProductRoute, handleUpdateProductRoute,} = require('../controllers/userController.js');
const authentication = require('../middlewares/authentication.js')

const router = express.Router()

router.post(
    '/signup',
    [
      body('username').trim().notEmpty().isLength({ min: 3 }).withMessage("Username must be at least 3 characters"),
      body('email').isEmail().withMessage('Email must be valid'),
      body('password').isLength({ min: 6 }).withMessage("Password must be at least 6 characters")
    ],
    handleRegisterRoute
  );

router.post('/login', 
    [
      body('email').isEmail().withMessage('Email must be valid'),
      body('password').isLength({ min: 6 }).withMessage("Incorrect password")
    ],
    handleLoginRoute
)


// authenication  middleware implemented

// CRUD Operation For Products
router.get('/all-products', authentication, handleAllProductsRoute)

router.post('/add-product', authentication, handleAddProductRoute)

router.delete('/delete-product/:productId', authentication, handleDeleteProductRoute)

router.put('/update-product/:productId', authentication, handleUpdateProductRoute)


// CRUD Operations FOr Invoices
router.get('/all-invoices', authentication, handleAllInvoicesRoute)

router.post('/add-invoice', authentication, handleAddInvoiceRoute)

router.delete('/delete-invoice/:invoiceId', authentication, handleDeleteInvoiceRoute)

router.put('/update-invoice/:invoiceId', authentication, handleUpdateInvoiceRoute)

module.exports = router  
  