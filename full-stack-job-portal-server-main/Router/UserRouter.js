const express = require("express");
const UserRouter = express.Router();

// Controllers
const UserController = require("../Controller/UserController");

// Middleware
const {
    checkRegisterInput,
    checkLoginInput,
    checkUserUpdateInput,
} = require("../Validation/UserDataRules");
const { inputValidationMiddleware } = require("../Validation/ValidationMiddleware");
const { userAuthorizationHandler } = require("./../Middleware/UserAuthorizationMiddleware");
const authenticateUser = require("./../Middleware/UserAuthenticationMiddleware");

// User management routes
UserRouter.route("/")
    .get(userAuthorizationHandler("admin"), UserController.getAllUser)
    .patch(UserController.updateUser)
    .delete(UserController.deleteAllUser);

UserRouter.route("/:id")
    .get(UserController.getSingleUser)
    .delete(userAuthorizationHandler("admin"), UserController.deleteUser);

module.exports = UserRouter;