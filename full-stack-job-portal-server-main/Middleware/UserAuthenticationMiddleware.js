const createHttpError = require("http-errors");
const jwt = require("jsonwebtoken");
const UserModel = require("../Model/UserModel");

exports.authenticateUser = async (req, res, next) => {
    const token = req.signedCookies[process.env.COOKIE_NAME];

    console.log("Token:", token);
    if (!token) {
        return next(createHttpError(401, "Unauthorized User"));
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded); // Debugging

        const { ID, role } = decoded; // Ensure `role` is extracted from the token

        // Find the user in the database
        const user = await UserModel.findOne({ _id: ID, role }).select("-password");

        console.log("User:", user); // Debugging

        if (!user) {
            return next(createHttpError(401, "Unauthorized User: User not found"));
        }

        req.user = user;
        next();
    } catch (error) {
        console.error("Token Verification Error:", error); // Debugging
        
        if (error.name === "TokenExpiredError") {
            return next(createHttpError(401, "Unauthorized User: Token expired"));
        } else {
            return next(createHttpError(401, "Unauthorized User: Invalid token"));
        }
    }
};
