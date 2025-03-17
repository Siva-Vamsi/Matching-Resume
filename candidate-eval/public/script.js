document.getElementById('candidateForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    // Show a loading message
    document.getElementById('message').textContent = 'Processing...';

    // Get form data
    const formData = new FormData();
    formData.append('name', document.getElementById('name').value);
    formData.append('email', document.getElementById('email').value);
    formData.append('linkedin', document.getElementById('linkedin').value);
    formData.append('skillset', document.getElementById('skillset').value);
    formData.append('resume', document.getElementById('resume').files[0]);

    console.log('Form data:', {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        linkedin: document.getElementById('linkedin').value,
        skillset: document.getElementById('skillset').value,
        resume: document.getElementById('resume').files[0],
    });

    try {
        // Send the form data to the backend
        const response = await fetch('http://localhost:5000/upload', {
            method: 'POST',
            body: formData,
        });

        console.log('Response status:', response.status);

        if (!response.ok) {
            // If the response is not OK, throw an error
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to process file.');
        }

        // Get the results from the backend
        const results = await response.json();
        console.log('Results:', results);

        // Display the results in the frontend
        displayResults(results);
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('message').textContent = error.message || 'Failed to process file. Please try again.';
    }
});

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <h2>Results:</h2>
        <p><strong>Score:</strong> ${results.score}</p>
        <p><strong>Nearest Job:</strong> ${results.nearestJob.jobTitle}</p>
        <p><strong>Skills Match:</strong> ${results.skillsMatch.join(', ')}</p>
    `;

    // Clear the loading message
    document.getElementById('message').textContent = '';
}