const EmpModel = require('../model/employee');


// Add a new employee
exports.addEmployee = async (req, res) => {
  try {
    const { ID, name, age, class: className, subjects, attendance } = req.body;
    console.log("wndwe");
    // Validate required fields
    if (!ID || !name || !age || !className || !subjects ) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Create a new employee object
    const newEmployee = {
      ID,
      name,
      age,
      class: className,
      subjects,
      attendance
    };

    // Save the new employee to the database
    const empDocument = await EmpModel.findOneAndUpdate(
      {}, // Assuming a single document with nested array of employees
      { $push: { data: newEmployee } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Employee added successfully', data: empDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding employee', error });
  }
};

// Update an employee's attendance
exports.updateAttendance = async (req, res) => {
  try {
    const { ID } = req.params; // Assuming employee ID is passed in the URL
    const { attendance } = req.body;

    if (!attendance) {
      return res.status(400).json({ message: 'Attendance is required' });
    }

    // Update attendance for the specified employee
    const empDocument = await EmpModel.findOneAndUpdate(
      { 'data.ID': ID },
      { $set: { 'data.$.attendance': attendance } },
      { new: true }
    );

    if (!empDocument) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Attendance updated successfully', data: empDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error updating attendance', error });
  }
};

// Fetch a specific employee by their ID
exports.fetchEmployee = async (req, res) => {
  try {
    const { ID } = req.params; // Employee ID from the URL

    // Find employee with the specific ID within the nested array
    const empDocument = await EmpModel.findOne(
      { 'data.ID': ID }, // Filter by employee ID
      { 'data.$': 1 } // Only return the specific employee document
    );

    if (!empDocument || empDocument.data.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    // Return the found employee data
    res.status(200).json({ message: 'Employee fetched successfully', data: empDocument.data[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

// Fetch all employees
exports.fetchAllEmployees = async (req, res) => {
  try {
    // Fetch the entire employees data
    const empDocument = await EmpModel.findOne({}, { data: 1 }); // Fetch only the "data" array

    if (!empDocument || empDocument.data.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    // Return all employee data
    res.status(200).json({ message: 'Employees fetched successfully', data: empDocument.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

