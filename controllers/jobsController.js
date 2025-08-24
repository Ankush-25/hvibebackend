import Job from "../model/jobModel.js";
import Company from "../model/companyModel.js";
import { EJSON } from 'bson';

///improve this api endpoind again 
export const searchJobs = async (req, res) => {  
  const { query, experience, location, category, limitNum=10 ,pageNum=1} = req.query;
  try {
    let querySearch = {}
    const companies = await Company.find({name: { $regex: query, $options: 'i' }}).select("_id");
    const companyId = companies.map(c => c._id)
    if(query&&typeof(query)==="string"){
      querySearch.$or = [
        {title: { $regex: query, $options: 'i' }},
        {skillsRequired: { $regex: query, $options: 'i' }},
        {description:{$regex:query, $options: "i"}},
        {company: { $in: companyId }}
      ]
    }
    if(experience){
      querySearch.experienceLevel = { $lte: Number(experience) }
    }
    if(category){
      querySearch.category={$regex: category, $options:"i"}
    }
    if(location){
      querySearch.location = { $regex: location, $options: 'i' }
    }
    if (!query && !experience && !location&&!category) {
      return res.status(400).json("Missing required parameters");
    }
    const total = await Job.countDocuments(querySearch);
    const jobsSearched = await Job.find(querySearch).sort({ createdAt: -1 }).skip((pageNum - 1) * limitNum).limit(limitNum);
    if (!jobsSearched || jobsSearched.length === 0) {
      return res.status(404).json("No Jobs Found");
    }
    res
      .status(200)
      .json({
          success: true,
          total,
          page: pageNum,
          totalPages: Math.ceil(total / limitNum),
          results: jobsSearched.length,
          jobsSearched,
        });
  } catch (error) {
    console.error("Unable to fetch search results due to :", error);
    res.status(500).json("Internal Server Error!");
  }
}
export const PostJob = async (req, res) => {
  const user = req.user.ID;
};

export const TPostJob = async (req, res) => {
  try {
    // Parse the request body using EJSON if it's in MongoDB Extended JSON format
    const parsedBody = EJSON.parse(JSON.stringify(req.body));

    const newJob = new Job({
      ...parsedBody,
      createdAt: parsedBody.createdAt || Date.now(),
      applications: parsedBody.applications || [],
      isActive: parsedBody.isActive !== undefined ? parsedBody.isActive : true
    });

    const savedJob = await newJob.save();
    res.status(201).json(savedJob);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({
      error: "Failed to create job",
      details: error.message
    });
  }
};

export const FeaturedJob = async (req, res) => {
  const jobNo = req.params.NO || 5;
  if (!jobNo || jobNo <= 0) {
    return res.status(404).json({
      message: "Job number is not specified or found",
    });
  }
  //change some fetching details of featured jobs based on the application
  try {
    const jobsCollection = await Job.find().limit(jobNo);
    if (!jobsCollection || jobsCollection.length === 0) {
      return res.status(404).json("No Jobs Found");
    }
    res
      .status(200)
      .json(
        { message: "Successfully Fetched the Fetured Jobs", jobsCollection }
      );
  } catch (error) {
    console.error("Unable to fetch featured JObs due to :", error);
    res.status(500).json("Internal Server Error!");
  }
};
