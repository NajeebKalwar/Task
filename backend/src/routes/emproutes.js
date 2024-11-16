const express = require('express');
const route = express.Router();
const employeeController = require('../controller/empcontroller');

route.delete('/employee/:ID/delete', employeeController.deleteEmployee);

route.post('/employee', employeeController.addEmployee);


route.put('/employee/:ID/attendance', employeeController.updateAttendance);
route.get('/employee/:ID', employeeController.fetchEmployee);

route.get('/employee/:ID', employeeController.fetchEmployee);


route.get('/allemployees', employeeController.fetchAllEmployees);
route.get('/employees', employeeController.fetchAllEmployeesWithPagination);



module.exports = route;