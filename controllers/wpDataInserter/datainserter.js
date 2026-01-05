import axios from "axios";
import https from "https";

// 🔧 WordPress credentials and setup
const WP_BASE_URL = "https://gethyrd.in";
const WP_USER = "singh";
const WP_PASS = "h5JpMcrs4Iemaxwg5JRDtrP2";
// WordPress REST endpoints
const WP_MEDIA_URL = `${WP_BASE_URL}/wp-json/wp/v2/media`;
const WP_JOB_URL = `${WP_BASE_URL}/wp-json/wp/v2/job-listings`;

// Axios instance
const axiosInstance = axios.create({
  httpsAgent: new https.Agent({ rejectUnauthorized: false }), // ignore SSL issues for localhost
  auth: { username: WP_USER, password: WP_PASS },
  headers: { "Content-Type": "application/json" }
});

/**
 * 🔍 Checks if a job with the same title already exists
 * @param {string} jobTitle
 * @returns {Promise<boolean>}
 */
async function isDuplicateJob(applyUrl) {
  try {
    // We’ll fetch jobs and manually check their meta for matching _application
    const res = await axiosInstance.get(`${WP_JOB_URL}?per_page=50`);
    const existingJobs = res.data;

    const duplicate = existingJobs.some(job =>
      job.meta && job.meta._application === applyUrl
    );

    return duplicate;
  } catch (err) {
    console.error("❌ Error checking duplicates:", err.message);
    return false;
  }
}

/**
 * 🖼 Uploads the company logo to WordPress Media Library
 */
async function uploadLogo(logoUrl, companyName) {
  if (!logoUrl) return null;

  try {
    const imgRes = await axios.get(logoUrl, { responseType: "arraybuffer" });
    const fileName = companyName.replace(/\s+/g, "_") + ".jpg";

    const uploadRes = await axios.post(WP_MEDIA_URL, imgRes.data, {
      headers: {
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Type": "image/jpeg"
      },
      auth: { username: WP_USER, password: WP_PASS }
    });

    console.log(`🖼️ Logo uploaded for: ${companyName}`);
    return uploadRes.data.id;
  } catch (err) {
    console.error(`❌ Logo upload failed for "${companyName}":`, err.message);
    return null;
  }
}

/**
 * 🚀 Adds a new job to WordPress Job Manager (skips duplicates)
 * @param {Object} job - Job data object
 * @returns {Promise<Object>} - WordPress API response or skip message
 */
export async function addJobToWordPress(job) {
  try {
    // 🔎 Step 1: Check for duplicate title
    const duplicate = await isDuplicateJob(job.applyUrl);
    if (duplicate) {
      console.log(`⚠️ Skipped duplicate: ${job.jobTitle}`);
      return { status: "skipped", reason: "duplicate" };
    }

    // 🖼️ Step 2: Upload logo if available
    const logoId = await uploadLogo(job.companyLogo, job.jobTitle);

    // 🧾 Step 3: Prepare job payload
    const payload = {
      title: job.jobTitle,
      content: `${job.description}\n\n<b>Skills:</b> ${job.skills?.join(", ") || "N/A"}`,
      status: "publish",
      featured_media: logoId,
      meta: {
        _company_name: job.companyName,
        _company_tagline: job.CompShortDescription,
        _job_location: job.location,
        _application: job.applyUrl,
        _job_type: job.type,
        _job_mode: job.mode,
        _job_experience: job.yoe,
        _job_skills: job.skills?.join(", ") || "",
      }
    };

    // 🚀 Step 4: Create job via WordPress REST API
    const res = await axiosInstance.post(WP_JOB_URL, payload);
    console.log(`✅ Job successfully added: ${res.data.title.rendered}`);

    return res.data;
  } catch (err) {
    console.error(`❌ Error adding job "${job.jobTitle}":`, err.response?.data || err.message);
    throw err;
  }
}