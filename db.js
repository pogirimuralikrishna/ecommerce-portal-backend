const mongoose = require('mongoose');

const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Mongoose connected successfully");
    } catch (e) {
        console.log("Mongoose connection failed:", e);
    }
};


module.exports = connectDb;  