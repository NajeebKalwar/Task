// src/routes/userRoutes.js
const express = require("express");
// const userController = require("../controller/usercontroller");
const userController= require("../controller/usercontroller");
// const { userController } = require("../controller/usercontroler");
const userRoutes = express.Router();


// User routes
userRoutes.post("/users", userController.createUser);               // Create user
userRoutes.get("/users", userController.getAllUsers);               // Get all users
userRoutes.get("/users/:id", userController.getUserById);           // Get user by ID
userRoutes.put("/users/:id", userController.updateUser);            // Update user
userRoutes.delete("/users/:id", userController.deleteUser);         // Delete user
userRoutes.post("/users/login", userController.loginUser);               // Get all users

// const userRoutes = router;

module.exports = userRoutes;