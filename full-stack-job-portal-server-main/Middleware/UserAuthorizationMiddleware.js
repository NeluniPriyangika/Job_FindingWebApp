const userAuthorizationHandler = (...roles) => {
    return (req, res, next) => {
        const userRole = req?.user?.role;

        console.log("User Object:", req.user); // Debugging
        console.log("User Role:", userRole); // Debugging
        console.log("Required Roles:", roles); // Debugging

        if (!roles.includes(userRole)) {
            return res.status(403).json({
                status: false,
                message: "You don't have permission",
            });
        }
        next();
    };
};

// module.exports = userAuthorizationHandler;
module.exports = {
     userAuthorizationHandler,
    //userAuthorizationHandler: userAuthorizationHandler,

};
