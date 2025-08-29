const mongoose = require("mongoose");

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    logo:{
        type:String,
    },
    description: {
        type: String,
    },
    location: {
        type: String,
    },
    category: {
        type: String,
        enum:['IT', 'Marketing', 'Design', 'Finance', 'Healthcare', 'Education', 'Other'],
    },
    website: {
        type: String,
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