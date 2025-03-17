const fs = require('fs');

// Function to generate embeddings from resume text
function getResumeEmbedding(filePath) {
  try {
    console.log('Reading file:', filePath); // Log the file path
    const resumeText = fs.readFileSync(filePath, 'utf-8'); // Read the resume content
    console.log('Resume text:', resumeText); // Log the resume text

    // Tokenize the resume text (split into words)
    const tokens = resumeText
      .toLowerCase() // Convert to lowercase
      .split(/\W+/) // Split by non-word characters (e.g., spaces, punctuation)
      .filter((word) => word.length > 0); // Remove empty strings

    // Create a vocabulary of unique words
    const vocabulary = [...new Set(tokens)]; // Remove duplicates

    // Generate a bag-of-words embedding
    const embedding = vocabulary.map((word) =>
      tokens.includes(word) ? 1 : 0 // 1 if word is present, 0 otherwise
    );

    // Pad or truncate the embedding to a fixed size (e.g., 10 dimensions)
    const fixedSize = 10;
    while (embedding.length < fixedSize) {
      embedding.push(0); // Pad with zeros
    }
    if (embedding.length > fixedSize) {
      embedding.length = fixedSize; // Truncate
    }

    console.log('Resume embedding:', embedding); // Log the embedding
    return embedding;
  } catch (error) {
    console.error('Error generating resume embedding:', error); // Log the error
    throw new Error('Failed to generate resume embedding');
  }
}

module.exports = { getResumeEmbedding };