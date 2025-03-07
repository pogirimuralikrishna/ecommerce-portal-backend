const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDb = require('./db.js')
const router  = require('./routes/userRoutes.js')
const app = express()

dotenv.config()
const PORT = process.env.PORT || 6000

app.use(express.json())
app.use(cors())

// Connect Database
connectDb()

app.use('/owner', router)

// Handle routes
app.listen(PORT, () => {
    console.log('server is running')
})


// { 
//     "orderId": 150,
//     "storeName": "D-mart",
//     "regularPrice": 2000,
//     "quantity": 4,
//     "dealPrice": 1800,
//     "itemTotal": 7200,
//     "itemWiseTax": 100,

// }