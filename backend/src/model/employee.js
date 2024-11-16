const mongoose = require("mongoose");
// const AutoIncrement = require("mongoose-sequence")(mongoose);

const employee = new mongoose.Schema({
    ID: {
        type: Number,
        unique: true,
        index:true,
    },
    name: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        required: true,
    },
    class: {
        type: String,
        required: true,
    },
    subjects: {
        type: String,
        required: true,
    },
    attendance: {
        type: String,
        required:false,
        default: ""
    },
});


const employees = mongoose.Schema({//nested object
    data: {
        type: [employee],
        default: [],
    },
});

// auto-increment 
// employee.plugin(AutoIncrement, { inc_field: "ID" });


employees.pre("save", function (next) {//save ke time kiya hoga
    next();
});


employees.pre(['update', 'findOneAndUpdate', 'updateOne'], function (next) {
    const update = this.getUpdate();
    delete update._id;
    next();
});



const empModel = mongoose.model("emp", employees);

module.exports = empModel;