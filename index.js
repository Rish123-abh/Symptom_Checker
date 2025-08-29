const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const symptomDiseaseList = require('./symptomDiseaseList');
const defaultdiseasePrediction = require('./DiseasePrediction');
const rateLimit = require('express-rate-limit');
dotenv.config();
app.use(express.json());
app.use(cors());
const PORT = process.env.PORT || 5000;

// Light limiter for search (e.g., 1000 requests per 15 min)
const searchLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { error: "Too many search requests, please wait a bit." }
});

// Strict limiter for predictions (e.g., 10 requests per 1 min)
const predictionLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  message: { error: "Rate limit exceeded. Try again in a minute." }
});

// global limiter for all apis 
// app.use(limiter);

// This is a placeholder for user signup and API key generation
// In a real application, you would store users and their API keys in a database
// This allow only user with valid API key to access the /predictDisease endpoint

// app.post('/signup', (req, res) => {
//   const { username } = req.body;

//   // Generate a random 32-character API key
//   const apiKey = crypto.randomBytes(16).toString('hex');

//   // Store the user with the API key (In DB, here we just return for demo)
//   const user = { username, apiKey };

//   res.json({ message: 'User created', apiKey });
// });

// Precompute disease probabilities for each symptom
const symptomDiseaseMap = {};
for (const [symptom, diseases] of Object.entries(symptomDiseaseList)) {
    symptomDiseaseMap[symptom] = defaultdiseasePrediction(diseases);
}

app.get('/symptoms/search', searchLimiter,(req, res) => {
    const query = req.query.q?.split(",").map(s => s.trim().toLowerCase());
    if (!query) return res.json([]);

    const matches = Object.keys(symptomDiseaseList)
        .filter(symptom => query.some((q) => symptom.toLowerCase().includes(q)));

    // Remove duplicates
    const uniqueMatches = [...new Set(matches)];

    res.json(uniqueMatches);
});


app.get('/predictDisease',predictionLimiter, (req, res) => {
    const symptoms = req.query.symptoms?.split(",").map(s => s.trim().toLowerCase());

    if (!symptoms || symptoms.length === 0) {
        return res.status(400).json({ error: "Please provide symptoms (comma-separated)" });
    }

    const scoreMap = {};

    // Aggregate scores for diseases based on symptoms
    symptoms.forEach(symptom => {
        if (symptomDiseaseMap[symptom]) {
            symptomDiseaseMap[symptom].forEach(({ disease, probability }) => {
                if (!scoreMap[disease]) scoreMap[disease] = 0;
                scoreMap[disease] += probability;
            });
        }
    });

    // Convert object to array and sort by score
    const results = Object.entries(scoreMap)
        .map(([disease, score]) => ({ disease, score }))
        .sort((a, b) => b.score - a.score);

    //  take top 5 and normalize their scores to probabilities
    const top5results = results.slice(0, 5);
    const totalScore = top5results.reduce((sum, r) => sum + r.score, 0);
    const finalResults = top5results.map(r => ({
        disease: r.disease,
        probability: ((r.score / totalScore) * 100).toFixed(2)
    }));

    res.json({
        symptoms,
        possibleDiseases: finalResults
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening on Port ${PORT}`);
})
