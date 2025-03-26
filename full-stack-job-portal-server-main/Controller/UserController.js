const UserModel = require("../Model/UserModel");
const createError = require("http-errors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const JWTGenerator = require("../Utils/JWTGenerator");
const sendEmail = require("../Utils/SendEmail");
const TokenModel = require("../Model/Token");
const crypto = require("crypto");

exports.getAllUser = async (req, res, next) => {
    try {
        const user = await UserModel.find({}).select("-password");
        if (user.length !== 0) {
            res.status(200).json({
                status: true,
                user,
            });
        } else {
            next(createError(200, "User list is empty"));
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getMe = async (req, res, next) => {
    try {
        const me = req.user;
        if (!me) {
            next(createError(500, "Please login first"));
        } else {
            res.status(200).json({
                status: true,
                user: me,
            });
        }
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.logOut = async (req, res, next) => {
    try {
        res.cookie(process.env.COOKIE_NAME, "", {
            sameSite: "none",
            secure: true,
            httpOnly: true,
            expires: new Date(0), // Set to a date in the past
            path: "/", // Ensure this matches the path set during login
        })
            .status(200)
            .json({
                status: true,
                message: "Logout done",
            });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.getSingleUser = async (req, res, next) => {
    res.send("get single user");
};

exports.addUser = async (req, res, next) => {
    const data = req.body;
    try {
        console.log("Received data:", data); // Debugging: Log incoming data

        const isUserExists = await UserModel.findOne({ email: data.email });
        if (isUserExists) {
            return next(createError(400, "Email Already exists")); // Use return to stop execution
        }

        const isFirstUser = (await UserModel.countDocuments()) === 0;
        req.body.role = isFirstUser ? "admin" : data.role;

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(data.password, salt);
        data.password = hashPassword;

        const newUser = new UserModel(data);
        console.log("New user object:", newUser); // Debugging: Log new user object

        const user = await newUser.save(); // Ensure this line is present
        console.log("User saved:", user); // Debugging: Log saved user

        const token = await new TokenModel({
            userId: user._id, // Use user._id instead of user.id
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        console.log("Token saved:", token); // Debugging: Log saved token

        // Construct the verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${user._id}/verify/${token.token}`;
        console.log("Verification URL:", verificationUrl); // Debugging: Log verification URL

        // Send the verification email
        await sendEmail(user.email, "Verify Email", verificationUrl);

        res.status(200).json({
            status: true,
            message: "An Email sent to your account please verify",
        });
    } catch (error) {
        console.error("Error in addUser:", error); // Debugging: Log the error
        next(createError(500, error.message));
    }
};

// Verify the user's email
exports.verifyEmail = async (req, res, next) => {
    try {
        const { id, token } = req.params;

        console.log("Verification request received:", { id, token });

        // Find the user
        const user = await UserModel.findOne({ _id: id });
        if (!user) {
            console.log("User not found");
            return res.status(400).json({
                status: false,
                message: "Invalid link",
            });
        }

        // Find the token
        const tokenDoc = await TokenModel.findOne({
            userId: user._id,
            token: token,
        });
        console.log("Token lookup result:", tokenDoc ? "Found" : "Not found");
        if (!tokenDoc) {
            console.log("Token not found or expired");
            return res.status(400).json({
                status: false,
                message: "Invalid or expired token",
            });
        }

        // Mark the user as verified
        await UserModel.updateOne({ _id: user._id }, { verified: true });
        console.log("User verification status updated to true");

        //await TokenModel.deleteOne({ _id: tokenDoc._id });
        //console.log("Token deleted successfully");


        res.status(200).json({
            status: true,
            message: "Email verified successfully",
        });
    } catch (error) {
        console.error("Verification error:", error);
        next(createError(500, error.message));
    }
};

// Resend verification email
exports.resendEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        // Find the user
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                status: false,
                message: "User not found.",
            });
        }

        // Check if the user is already verified
        if (user.verified) {
            return res.status(400).json({
                status: false,
                message: "User is already verified.",
            });
        }

        // Delete the existing token if it exists
        await TokenModel.deleteOne({ userId: user._id });

        // Generate a new token
        const token = await new TokenModel({
            userId: user._id,
            token: crypto.randomBytes(32).toString("hex"),
        }).save();

        // Construct the verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${user._id}/verify/${token.token}`;

        // Send the verification email
        await sendEmail(user.email, "Verify Email", verificationUrl);

        res.status(200).json({
            status: true,
            message: "Verification email has been resent.",
        });
    } catch (error) {
        next(createError(500, error.message));
    }
};

exports.loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;

          // Log input credentials for debugging
          console.log('Login attempt:', { email, password });

        // Check if the user exists
        const isUserExists = await UserModel.findOne({  email: email.toLowerCase().trim()});
        // Log user found details
        console.log('User found:', isUserExists);

        console.log('User Search Details:', {
            inputEmail: email,
            searchEmail: email.toLowerCase().trim(),
            foundUser: isUserExists
        });

        // More detailed logging
        console.log('User Found:', { 
            exists: !!isUserExists,
            userId: isUserExists?._id,
            storedPassword: isUserExists?.password,
            verified: isUserExists?.verified,
        });
        
        if (!isUserExists) {
            console.log('User not found for email:', email);
            return next(createError(404, "User not found!"));
        }

        // Additional verification logging
        console.log('Verification status:', {
            verified: isUserExists.verified,
        });

        // Check if the user is verified
        if (!isUserExists.verified) {
            return res.status(403).json({
                verified: false,
                message: "Your account is not verified. Please check your email for the verification link.",
                footer: '<a href="/resend-verification">Resend verification email</a>', // Optional: Add a link to resend verification email
            });
        }


        // Generate JWT token
        const tokenObj = {
            ID: isUserExists._id,
            role: isUserExists.role,
        };
        const TOKEN = JWTGenerator(tokenObj);

        // Set cookie with the token
        const one_day = 1000 * 60 * 60 * 24; // Token expires in 1 day
        res.cookie(process.env.COOKIE_NAME, TOKEN, {
            expires: new Date(Date.now() + one_day),
            secure: true, // Sent only over HTTPS
            httpOnly: true, // Restricts access from client-side scripts
            signed: true, // Helps keep the cookie secure
            sameSite: "None",
        });

        // Send success response
        res.status(200).json({
            verified: true,
            message: "Login Successful",
            user: {
                id: isUserExists._id,
                email: isUserExists.email,
                role: isUserExists.role,
            },
        });
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};



exports.updateUser = async (req, res, next) => {
    const data = req.body;
    try {
        if (req?.user?.email !== data?.email) {
            next(createError(500, `You have no permission to update`));
        } else {
            const updateUser = await UserModel.updateOne(
                { _id: req.user._id },
                { $set: data }
            );

            if (updateUser.nModified > 0) {
                const updatedUser = await UserModel.findById(
                    req.user._id
                ).select("-password");
                res.status(200).json({
                    status: true,
                    message: "Profile Updated",
                    user: updatedUser,
                });
            } else {
                res.status(200).json({
                    status: false,
                    message: "No changes were made",
                    user: null,
                });
            }
        }
    } catch (error) {
        next(createError(500, `Something went wrong: ${error.message}`));
    }
};

exports.deleteUser = async (req, res, next) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            next(createError(400, "Invalid User ID format"));
        }

        const isUserExists = await UserModel.findOne({ _id: id });
        if (!isUserExists) {
            res.status(500).json({
                status: false,
                message: "User not found",
            });
        } else {
            const user = await UserModel.findByIdAndDelete(id);
            res.status(200).json({
                status: true,
                message: "User Deleted",
            });
        }
    } catch (error) {
        next(createError(500, `something wrong: ${error.message}`));
    }
};

exports.deleteAllUser = async (req, res, next) => {
    try {
        user = await UserModel.deleteMany({});
        res.status(201).json({
            status: true,
            message: "All userd deleted",
        });
    } catch (error) {
        next(createError(500, `something wrong: ${error.message}`));
    }
};
