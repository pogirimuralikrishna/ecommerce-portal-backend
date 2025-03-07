const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user.js');
const Invoice = require('../models/invoice.js');
const Product = require('../models/product.js');


// Owner SignUp
const handleRegisterRoute = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "Email already taken" });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt); 

        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();

        res.status(200).json({ message: "User registered successfully", userId: newUser._id });

    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error", error: e.message }); 
    }
};

// Owner Login
const handleLoginRoute = async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    }
    const {email, password} = req.body;
    try{
        const existingUser = await User.findOne({email})
        if (!existingUser){
            return res.status(400).json('Incorrect email')
        }
        const isMatch = await bcrypt.compare(password, existingUser.password)
        if (!isMatch){
           return res.status(400).json('Incorrect password')
        }
        const token = jwt.sign({userId: existingUser.id}, process.env.JWT_SECRET, {expiresIn: '1hr'})

        res.status(200).json({message: 'user logged successfully', jwtToken: token,})

    }
    catch(e){
        console.log(e)
        res.status(500).json({ message: "Server error", error: e.message });
    }
}


// Owner Add Product
const handleAddProductRoute = async (req, res) => {
    const ownerId = req.user.userId;
    const {productName, productPrice, productDescription, storeName, discount, productImage} = req.body
    try{
        const addProduct = new Product({ownerId, storeName, productName, productPrice, productDescription, discount, productImage})
        await addProduct.save()
        res.status(200).json({message: "Product added successfully", productDetails: addProduct})
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Server error", error: e.message }); 
    }
}

// Owner Get All Products
const handleAllProductsRoute = async (req, res) => {
    const ownerId = req.user.userId
    try{
        const allProducts = await Product.find({ownerId})
        res.status(200).json(allProducts)
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
}

// Owner Update Product
const handleUpdateProductRoute = async (req, res) => {
    const ownerId = req.user.userId;
    const { productId } = req.params;
    const updateFields = req.body;

    try {
        const updatedProduct = await Product.findOneAndUpdate(
            { _id: productId, ownerId },  // Ensure the product belongs to the owner
            { $set: updateFields },
            { new: true, runValidators: true } // Return updated product
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found or not owned by this user." });
        }

        res.status(200).json({ message: "Product updated successfully", productDetails: updatedProduct });
    } 
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
};

// Owner Delete Product
const handleDeleteProductRoute = async (req, res) => {
    const ownerId = req.user.userId;
    const { productId } = req.params;

    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: productId, ownerId });

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found or not owned by this user." });
        }

        res.status(200).json({ message: "Product deleted successfully" });
    } 
    catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
};


// Owner Get All Invoices
const handleAllInvoicesRoute = async (req, res) => {
    
    try{
        const allInvoices = await Invoice.find({ownerId: req.user.userId})
        res.status(200).json(allInvoices)
    }
    catch(e){
        console.log(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
}

// Owner Add Invoice
const handleAddInvoiceRoute = async (req, res) => {
    const ownerId = req.user.userId;
    const { orderId, storeName, regularPrice, quantity, dealPrice, itemTotal, itemWiseTax } = req.body;
    
    try {
        // Validate required fields
        if (!orderId || !storeName || !regularPrice || !quantity || !dealPrice || !itemTotal || !itemWiseTax) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newInvoice = new Invoice({
            ownerId,
            orderId,
            storeName,
            regularPrice,
            quantity,
            dealPrice,
            itemTotal,
            itemWiseTax,
            createdAt: new Date()  // Ensure createdAt field is set
        });

        await newInvoice.save();

        res.status(200).json({ message: "Invoice added successfully", invoice: newInvoice });
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
};

//Owner Delete Invoice
const handleDeleteInvoiceRoute = async (req, res) => {
    const ownerId = req.user.userId; // Get the ownerId from the authenticated user
    const { invoiceId } = req.params; // Get the invoiceId from the request parameters

    try {
        const deletedInvoice = await Invoice.findOneAndDelete({ _id: invoiceId, ownerId });

        if (!deletedInvoice) {
            return res.status(404).json({ message: "Invoice not found or unauthorized" });
        }

        res.status(200).json({ message: "Invoice deleted successfully", invoice: deletedInvoice });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
};

//Owner Update Invoice
const handleUpdateInvoiceRoute = async (req, res) => {
    const ownerId = req.user.userId; // Get the ownerId from the authenticated user
    const { invoiceId } = req.params; // Get the invoiceId from request parameters
    const updateFields = req.body; // Get updated fields from request body

    try {
        const updatedInvoice = await Invoice.findOneAndUpdate(
            { _id: invoiceId, ownerId },
            { $set: updateFields },
            { new: true, runValidators: true }
        );

        if (!updatedInvoice) {
            return res.status(404).json({ message: "Invoice not found or unauthorized" });
        }

        res.status(200).json({ message: "Invoice updated successfully", invoice: updatedInvoice });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
};




module.exports = {handleLoginRoute, handleRegisterRoute, 
                handleAllInvoicesRoute,handleAddInvoiceRoute,handleDeleteInvoiceRoute, handleUpdateInvoiceRoute,
                handleAddProductRoute,handleAllProductsRoute, handleDeleteProductRoute, handleUpdateProductRoute}


