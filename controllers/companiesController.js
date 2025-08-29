import Company from "../model/companyModel.js";

export const addCompany = async (req, res) => {
    try {
        const { name, logo, description, location, category, website, userId } = req.body;
        const newCompany = new Company({
            name,
            logo,
            description,
            location, 
            category,
            website,
            userId,
            createdAt: Date.now()
        });
        const savedCompany = await newCompany.save();
        res.status(201).json(savedCompany);
    } catch (error) {
        console.error("Error creating company:", error);
        res.status(500).json({
            error: "Failed to create company",
            details: error.message
        });
    }
};

export const getAllCompany = async (req, res) => {
    try {
        const companies = await Company.find();
        res.status(200).json(companies);
    } catch (error) {
        console.error("Error fetching companies:", error);
        res.status(500).json({
            error: "Failed to fetch companies",
            details: error.message
        });
    }
};


