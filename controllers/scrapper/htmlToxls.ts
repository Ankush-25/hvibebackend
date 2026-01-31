import XLSX from "xlsx";

export function exportJobsToExcel(jobs: any[], filePath: string = "jobs.xlsx") {
  try {
    // Validate input
    if (!jobs || !Array.isArray(jobs) || jobs.length === 0) {
      console.error("No jobs data provided or empty array");
      return false;
    }

    // Map jobs to Excel rows with consistent field names
    const rows = jobs
      .map((job, index) => {
        try {
          return {
            "Job Title": job.jobTitle || "",
            Location: job.location || "",
            Company: job.companyName || "",
            "Company Description": job.CompShortDescription || "",
            CompanyLogo: job.companyLogo || "",
            Description: job.description || "",
            Skills: Array.isArray(job.skills) ? job.skills.join(", ") : "",
            "Experience (YOE)": job.yoe || "",
            Type: job.type || "",
            Mode: job.mode || "",
            "Apply URL": job.applyUrl || "",
          };
        } catch (rowError: any) {
          console.error(`Error mapping job ${index + 1}:`, rowError.message);
          return null;
        }
      })
      .filter(Boolean); // Remove any null entries

    // Create worksheet and workbook
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Jobs");

    // Write file
    XLSX.writeFile(wb, filePath);

    console.log(`✓ Successfully exported ${rows.length} jobs to ${filePath}`);
    return true;
  } catch (error: any) {
    console.error("Error exporting to Excel:", error.message);
    return false;
  }
}
