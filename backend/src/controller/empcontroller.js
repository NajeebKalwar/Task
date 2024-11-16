const EmpModel = require('../model/employee');


exports.addEmployee = async (req, res) => {
  try {
    const { ID, name, age, class: className, subjects, attendance } = req.body;
    console.log("wndwe");
    if (!ID || !name || !age || !className || !subjects) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const newEmployee = {
      ID,
      name,
      age,
      class: className,
      subjects,
      attendance
    };

    const empDocument = await EmpModel.findOneAndUpdate(
      {}, 
      { $push: { data: newEmployee } },
      { upsert: true, new: true }
    );

    res.status(201).json({ message: 'Employee added successfully', data: empDocument });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding employee', error });
  }
};

exports.updateAttendance = async (req, res) => {
  try {
    const { ID } = req.params; 
    const { attendance } = req.body;
    console.log('Requesting update for ID:', ID, 'with attendance:', attendance);

    if (!attendance) {
      return res.status(400).json({ message: 'Attendance is required' });
    }
          console.log('Requesting update for ID:', ID, 'with attendance:', attendance);

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

exports.deleteEmployee = async (req, res) => {
  try {
    const { ID } = req.params;

    const result = await EmpModel.updateOne(
      { 'data.ID': ID }, 
      { $pull: { data: { ID } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Employee not found or already deleted' });
    }

    // Send success response
    res.status(200).json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error deleting employee', error });
  }
};


exports.fetchEmployee = async (req, res) => {
  try {
    const { ID } = req.params;

    const empDocument = await EmpModel.findOne(
      { 'data.ID': ID },
      { 'data.$': 1 }
    );

    if (!empDocument || empDocument.data.length === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }

    res.status(200).json({ message: 'Employee fetched successfully', data: empDocument.data[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employee', error });
  }
};

exports.fetchAllEmployeesWithPagination = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5; 

   
    const skip = (page - 1) * limit;

    console.log("Page:", page, "Limit:", limit, "Skip:", skip); 

    const empDocuments = await EmpModel.find({}, { 
      data: { $slice: [skip, limit] } 
    });
    

    if (!empDocuments || empDocuments.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    const totalEmployees = await EmpModel.aggregate([
      { $project: { dataSize: { $size: "$data" } } },
      { $limit: 1 }
    ]);

    const total = totalEmployees[0]?.dataSize || 0; 

    console.log("Total Employees:", total); 

    res.status(200).json({
      message: 'Employees fetched successfully',
      data: empDocuments[0]?.data, 
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit), 
        totalEmployees: total, 
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

// Fetch all employees
exports.fetchAllEmployees = async (req, res) => {
  try {
    const empDocument = await EmpModel.findOne({}, { data: 1 });

    if (!empDocument || empDocument.data.length === 0) {
      return res.status(404).json({ message: 'No employees found' });
    }

    res.status(200).json({ message: 'Employees fetched successfully', data: empDocument.data });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching employees', error });
  }
};

