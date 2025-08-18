const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logo:{
        type:String,
        required:true
    },
    description: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    category: {
        type: String,
        enum:['IT', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Other'],
        required: true
    },
    website: {
        type: String,
        required: true
    },
    userId: { //who has been working on this company
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const Company = mongoose.model('Company', companySchema)
module.exports = Company