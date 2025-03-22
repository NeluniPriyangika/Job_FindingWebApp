const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {   username: String,
        email: String,
        password: String,
        location: {
            type: String,
        },
        gender: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "recruiter", "user"],
            default: "user",
        },
        userCategory: {
            type: String,
            enum: ["Company", "Professional", "General Worker"],
            default: "General Worker",
        },
        status: {
            type: String,
            enum: ["verified", "unverified"],
            default: "unverified",
        },
        verified: {
            type: Boolean,
            default: false,
        },
        resume: {
            type: String,
        }
    },
    { timestamps: true } // to keep track
);

// Hashing Password
UserSchema.pre("save", async function (next) {
    const password = this.password;
    const salt = await bcrypt.genSalt(16);
    const hashedPassword = bcrypt.hashSync(password, salt);
    this.password = hashedPassword;
    next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
