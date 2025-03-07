const mongoose = require('mongoose')

// Define Schema

const invoiceSchema = new mongoose.Schema({
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: "Owner", required: true },
    orderId: { type: Number, required: true },
    storeName: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    quantity: { type: Number, required: true },
    dealPrice: { type: Number, required: true },
    itemTotal: { type: Number, required: true },
    itemWiseTax: { type: Number, required: true },
}, { timestamps: true }); // Adds createdAt and updatedAt automatically



// Define Model

const Invoice = mongoose.model('Invoice', invoiceSchema);

module.exports = Invoice