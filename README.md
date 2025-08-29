🩺 Symptom-to-Disease Prediction API

This project provides a backend API that predicts possible diseases based on a given list of symptoms. The API returns a list of potential diseases along with their associated probabilities.

🌐 Base URL
https://symptom-checker-r1zn.onrender.com

📌 Endpoint
GET /predictDisease

Predicts diseases based on provided symptoms.

🔹 Query Parameters

Multiple symptoms should be passed comma-separated.

Parameter	Type	Description
symptoms	string	Example: "headache, fever"
⚡ Example Request (Using Axios)
import axios from "axios";

const API_BASE_URL = "https://symptom-checker-r1zn.onrender.com";

async function getDiseasePrediction(symptoms: string) {
  try {
    const response = await axios.get<DiseasePredictionResponse>(
      `${API_BASE_URL}/predictDisease`,
      { params: { symptoms } }
    );
    console.log(response.data);
  } catch (error) {
    console.error("❌ Error fetching prediction:", error);
  }
}

// Example usage
getDiseasePrediction("headache");

📄 Example Response
{
  "symptoms": ["headache"],
  "possibleDiseases": [
    { "disease": "Migraine", "probability": "41.84" },
    { "disease": "Flu", "probability": "28.57" },
    { "disease": "Tension Headache", "probability": "17.35" },
    { "disease": "Sinusitis", "probability": "11.22" },
    { "disease": "Cluster Headache", "probability": "1.02" }
  ]
}


symptoms: The string of symptoms provided in the request (comma-separated).

possibleDiseases: Array of predicted diseases with probability (in %).

⚠️ Notes

Ensure the symptoms parameter is passed as a string of symptoms separated by commas.

Probabilities indicate the likelihood of each disease based on the given symptoms.

This API is for informational purposes only and should not replace professional medical advice.



🔍 Symptoms Suggestion API

While typing symptoms, this API provides suggestions based on the input to help users select valid symptoms.

GET /symptoms/search
🔹 Query Parameters
Parameter	Type	Description
q	string	Partial input of symptom(s), comma-separated. Example: "hea, fe"
⚡ Example Request (Using Axios)
import axios from "axios";

const API_BASE_URL = "https://symptom-checker-r1zn.onrender.com";

async function getSymptomSuggestions(query: string) {
  try {
    const response = await axios.get<string[]>(
      `${API_BASE_URL}/symptoms/search`,
      { params: { q: query } }
    );
    console.log(response.data);
  } catch (error) {
    console.error("❌ Error fetching suggestions:", error);
  }
}

// Example usage
getSymptomSuggestions("hea, fe"); // might return ["headache", "fever"]

📄 Example Response
[
  "headache",
  "fever",
  "heartburn"
]


Returns an array of matching symptoms based on the partial input.

Matches are case-insensitive and duplicates are removed.

⚠️ Notes

Use this API to provide autocomplete or suggestions in your frontend while the user is typing symptoms.

The q parameter must be a string of partial symptom(s), comma-separated.
