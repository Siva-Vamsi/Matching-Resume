require('dotenv').config(); // Load environment variables from .env file
const { Pinecone } = require('@pinecone-database/pinecone'); // Import Pinecone

// Initialize the Pinecone client
const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY, // Your Pinecone API key
});

// Get the Pinecone index (replace 'quickstart' with your actual index name)
const index = pinecone.Index('quickstart');

// Function to store job embeddings in Pinecone
async function storeJobEmbeddings(jobEmbeddings) {
  const embeddingsToStore = jobEmbeddings.map((job, index) => ({
    id: `job-${index}`, // Unique ID for each job
    values: job.embedding, // Embedding values
    metadata: { jobTitle: job.jobTitle }, // Metadata for the job title
  }));

  try {
    const upsertResponse = await index.upsert(embeddingsToStore);
    console.log('Job embeddings stored successfully in Pinecone:', upsertResponse);
  } catch (error) {
    console.error('Error storing job embeddings:', error);
  }
}

// Export the function
module.exports = { storeJobEmbeddings };