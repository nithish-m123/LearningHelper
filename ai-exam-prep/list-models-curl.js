const fs = require('fs');

async function testApiKey() {
  const envFile = fs.readFileSync('ai-exam-prep/.env.local', 'utf-8');
  let key = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('GEMINI_API_KEY=')) {
      key = line.split('=')[1].trim();
      break;
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    
    if (data.models) {
      console.log("SUCCESS! API Key is VALID.");
      console.log("Models found:", data.models.map(m => m.name));
    } else {
      console.log("API Key Auth worked, but no models found. Data:", JSON.stringify(data));
    }
  } catch (err) {
    console.log("Request failed:", err.message);
  }
}
testApiKey();
