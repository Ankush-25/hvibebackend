const express = require('express');
const companyRouter = express.Router();
const companyController = require('../controllers/companiesController.js');
const authmiddlewareVerification = require('../middleware/authMiddleware');

companyRouter.post('/addCompany', authmiddlewareVerification, companyController.addCompany);
companyRouter.get('/allCompanies', authmiddlewareVerification, companyController.getAllCompany);
module.exports = companyRouter;
