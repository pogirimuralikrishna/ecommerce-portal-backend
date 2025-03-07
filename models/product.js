const mongoose = require('mongoose')

// Define Schema


const productSchema = new mongoose.Schema({
    ownerId: {type: mongoose.Types.ObjectId, ref: "User", required: true},
    storeName: { type: String, required: true },
    productName: { type: String, required: true }, 
    productPrice: { type: Number, required: true }, 
    productDescription: { type: String }, // Optional
    discount: { type: Number, default: 0 }, // Default discount is 0
    productImage: { type: String } // Optional
});

// Define Model

const Product = mongoose.model("Product", productSchema)

module.exports = Product