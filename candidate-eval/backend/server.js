require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Import custom modules
const { getResumeEmbedding } = require('./parser');
const { storeJobEmbeddings } = require('./storage');
const { jobEmbeddings } = require('./embeddings');

// Initialize Express app
const app = express();
const port = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({ storage });

// Route for the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// POST route for uploading candidate data
app.post('/upload', upload.single('resume'), async (req, res) => {
    if (!req.file) {
        console.error('No file uploaded');
        return res.status(400).json({ status: 'error', message: 'No file uploaded' });
    }

    console.log('File uploaded:', req.file);

    const { name, email, linkedin, skillset } = req.body;
    console.log('Form data:', { name, email, linkedin, skillset });

    try {
        // Step 1: Extract the resume embedding
        const resumeEmbedding = await getResumeEmbedding(req.file.path);
        console.log('Resume embedding:', resumeEmbedding);

        // Step 2: Store job embeddings in Pinecone (if not already stored)
        await storeJobEmbeddings(jobEmbeddings);

        // Step 3: Find the most similar job
        const nearestJob = await findMostSimilarJobEmbedding(resumeEmbedding);
        console.log('Nearest job:', nearestJob);

        // Step 4: Calculate skills match
        const skillsMatch = calculateSkillsMatch(skillset, nearestJob.jobTitle);
        console.log('Skills match:', skillsMatch);

        // Step 5: Calculate overall score
        const score = calculateScore(resumeEmbedding, nearestJob, skillsMatch);
        console.log('Overall score:', score);

        // Step 6: Respond with results
        const response = {
            status: 'success',
            score,
            nearestJob,
            skillsMatch,
        };
        console.log('Sending response:', response);
        res.json(response);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ status: 'error', message: error.message || 'Failed to process the file' });
    }
});

// Function to find the most similar job
async function findMostSimilarJobEmbedding(resumeEmbedding) {
    console.log('Resume embedding received:', resumeEmbedding);

    const similarityScores = jobEmbeddings.map((job) => {
        const similarity = cosineSimilarity(resumeEmbedding, job.embedding);
        return {
            jobTitle: job.jobTitle,
            similarityScore: similarity,
            skills: job.skills || [], // Ensure skills property exists
        };
    });

    console.log('Similarity scores:', similarityScores);

    // Sort the jobs by similarity score in descending order
    similarityScores.sort((a, b) => b.similarityScore - a.similarityScore);

    // Return the nearest job
    return similarityScores[0];
}

// Function to calculate cosine similarity
function cosineSimilarity(vecA, vecB) {
    console.log('Calculating cosine similarity between:', vecA, vecB);

    const dotProduct = vecA.reduce((sum, val, idx) => sum + val * vecB[idx], 0);
    const magnitudeA = Math.sqrt(vecA.reduce((sum, val) => sum + val * val, 0));
    const magnitudeB = Math.sqrt(vecB.reduce((sum, val) => sum + val * val, 0));

    const similarity = dotProduct / (magnitudeA * magnitudeB);
    console.log('Cosine similarity:', similarity);

    return similarity;
}

// Function to calculate skills match
function calculateSkillsMatch(skillset, jobTitle) {
    console.log('Skillset:', skillset);
    console.log('Job Title:', jobTitle);

    if (!skillset || !jobTitle) {
        throw new Error('Skillset or job title is missing.');
    }

    const job = jobEmbeddings.find((job) => job.jobTitle === jobTitle);
    console.log('Job:', job);

    if (!job) {
        throw new Error(`Job with title "${jobTitle}" not found.`);
    }

    const jobSkills = job.skills || [];
    console.log('Job Skills:', jobSkills);

    const candidateSkills = skillset.split(',').map((skill) => skill.trim());
    console.log('Candidate Skills:', candidateSkills);

    return candidateSkills.filter((skill) => jobSkills.includes(skill));
}

// Function to calculate overall score
function calculateScore(resumeEmbedding, nearestJob, skillsMatch) {
    console.log('Nearest Job:', nearestJob);
    console.log('Skills Match:', skillsMatch);

    if (!nearestJob || !nearestJob.skills) {
        throw new Error('Nearest job or skills are undefined.');
    }

    if (!skillsMatch) {
        throw new Error('Skills match is undefined.');
    }

    const similarityScore = nearestJob.similarityScore;
    const skillsMatchScore = skillsMatch.length / nearestJob.skills.length;
    return (similarityScore + skillsMatchScore) / 2;
}

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});