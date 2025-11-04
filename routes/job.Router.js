const express = require('express');
const jobRouter = express.Router();
const jobController = require('../controllers/jobsController.js');

//Public Routes
//who is posting the job with id 
// jobRouter.post('/postJob/:ID', jobController.PostJob);
jobRouter.get('/FeatureJobs/:NO', jobController.FeaturedJob);
jobRouter.get('/job/:jobId', jobController.GetJobDetails)
// jobRouter.get('/searchJobs', jobController.searchJobs);
jobRouter.get('/searchJobs', jobController.searchJobs);


//authenticated Routes
jobRouter.post('/postJob', jobController.PostJob);

// jobRouter.get('/getJobs', jobController.getJobs);
// jobRouter.get('/getJob/:id', jobController.getJobById);
// jobRouter.delete('/deleteJob/:id', jobController.deleteJob);
// jobRouter.put('/updateJob/:id', jobController.updateJob);
module.exports = jobRouter;