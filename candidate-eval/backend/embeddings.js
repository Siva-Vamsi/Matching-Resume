const jobEmbeddings = [
    {
        jobTitle: "Software Engineer",
        embedding: [0.12, 0.45, 0.63, 0.28, 0.91, 0.54, 0.33, 0.88, 0.65, 0.47],  // Example of pre-generated embedding
    },
    {
        jobTitle: "Data Scientist",
        embedding: [0.13, 0.55, 0.65, 0.32, 0.87, 0.49, 0.41, 0.77, 0.56, 0.50],  // Replace with actual embedding
    },
    {
        jobTitle: "Machine Learning Engineer",
        embedding: [0.14, 0.51, 0.60, 0.29, 0.82, 0.56, 0.37, 0.72, 0.61, 0.49],  // Replace with actual embedding
    },
    {
        jobTitle: "Product Manager",
        embedding: [0.10, 0.50, 0.63, 0.25, 0.78, 0.53, 0.34, 0.71, 0.58, 0.46],
    },
    {
        jobTitle: "Cloud Architect",
        embedding: [0.09, 0.47, 0.67, 0.31, 0.83, 0.52, 0.39, 0.69, 0.60, 0.50],
    },
    {
        jobTitle: "Backend Developer",
        embedding: [0.14, 0.49, 0.59, 0.27, 0.75, 0.50, 0.36, 0.68, 0.62, 0.51],
    },
    // Add more job titles here...
  ];
  
  // Function to get the embedding for a specific job title
  function getJobEmbedding(jobTitle) {
    const job = jobEmbeddings.find(job => job.jobTitle === jobTitle);
    if (!job) {
        throw new Error(`Job title not found: ${jobTitle}`);
    }
    return job.embedding;
  }
  
  // Export the variables and functions using CommonJS
  module.exports = { jobEmbeddings, getJobEmbedding };
  