require('dotenv').config();

module.exports = {
  // Predefined job titles and their embeddings
  JOB_EMBEDDINGS: [
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
  ],

  // Configuration for handling file uploads
  MAX_FILE_SIZE: 10 * 1024 * 1024,  // 10 MB limit for file upload
  ALLOWED_FILE_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],  // PDF and DOCX allowed

  // Configuration for job matching threshold (similarity score)
  MIN_SIMILARITY_SCORE: 0.5,  // Minimum cosine similarity score to consider a match
  MAX_RESULTS: 5,  // Max number of job titles to return

  // Logging configuration
  LOG_LEVEL: 'info',  // Default logging level (info, debug, error)
  LOG_PATH: './logs/application.log',  // Path to log file
};
