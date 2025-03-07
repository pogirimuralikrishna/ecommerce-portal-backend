const jwt = require('jsonwebtoken');

const authentication = (req, res, next) => {
    const authorizer = req.headers.authorization; 

    if (!authorizer || !authorizer.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization required" }); 
    }

    const token = authorizer.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => { 
        if (error) {
            return res.status(403).json({ message: "Token expired or invalid" }); 
        }

        req.user = decoded; 
        next(); 
    });
};

module.exports = authentication;
