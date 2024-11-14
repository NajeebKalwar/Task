const express = require('express');
const route = express.Router();
const employeeController= require('../controller/empcontroller');

route.post('/employee', employeeController.addEmployee);

route.put('/employee/:ID/attendance', employeeController.updateAttendance);
// Route to fetch a specific employee by ID
route.get('/employee/:ID', employeeController.fetchEmployee);

// Route to fetch all employees
route.get('/employees', employeeController.fetchAllEmployees);


module.exports = route;