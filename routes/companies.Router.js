import express from 'express';
import * as companyController from '../controllers/companiesController.js';
import authmiddlewareVerification from '../middleware/authMiddleware.js';

const companyRouter = express.Router();

companyRouter.post('/addCompany', authmiddlewareVerification, companyController.addCompany);
companyRouter.get('/allCompanies', authmiddlewareVerification, companyController.getAllCompany);

export default companyRouter;
