const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema(
    {   username: String,
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,  // Automatically convert to lowercase
            trim: true,       // Remove whitespace
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
        },
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
        userConfirm: {
            type: String,
            enum: ["ConfirmedUser", "User Not Confirmed"],
            default: "User Not Confirmed",
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
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(Number(process.env.SALT) || 10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});

const UserModel = mongoose.model("User", UserSchema);
module.exports = UserModel;
