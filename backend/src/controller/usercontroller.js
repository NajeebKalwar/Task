// src/controllers/userController.js
const UserModel = require("../model/user");
const bcryptjs = require("bcryptjs");


exports.createUser = async (req, res) => {
  try {
    const { name, email, password, usertype } = req.body;

    const newUser = new UserModel({ name, email, password, usertype });
    await newUser.save();
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
};


exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Attempting login for:", email);

    // Find user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      console.log("User not found:", email);
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Invalid password for user:", email);
      return res.status(401).json({ message: 'Invalid password' });
    }

    console.log("Login successful for:", email);
    res.status(200).json({
      message: "Login successful",
      user: { id: user.id, name: user.name, email: user.email, usertype: user.usertype }
    });

  } catch (error) {
    console.error("Error logging in:", error.message);
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // if (req.user.usertype !== 'admin') {
    //   return res.status(403).json({ message: "Access denied. Admins only." });
    // }
    const users = await UserModel.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (req.user.usertype !== 'admin' && req.user.id !== req.params.id) {
      return res.status(403).json({ message: "Access denied." });
    }

    const updateData = { name, email };
    if (password) {
      updateData.password = bcryptjs.hashSync(password, 8);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.usertype !== 'admin') {
      return res.status(403).json({ message: "Access denied. Admins only." });
    }
    const deletedUser = await UserModel.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
};
