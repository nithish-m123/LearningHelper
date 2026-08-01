const fs = require('fs');

// Simple parse of .env.local manually
const envFile = fs.readFileSync('.env.local', 'utf-8');
let key = '';
for (const line of envFile.split('\n')) {
  if (line.startsWith('GEMINI_API_KEY=')) {
    key = line.split('=')[1].trim();
  }
}

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    // Find models that support 'embedContent'
    const embeddingModels = data.models.filter(m => 
      m.supportedMethods && m.supportedMethods.includes('embedContent')
    );
    
    console.log("Supported Embedding Models:");
    embeddingModels.forEach(m => console.log(`- ${m.name}`));
    
    if (embeddingModels.length === 0) {
        console.log("No embedding models found. Full list of models:");
        data.models.forEach(m => console.log(`- ${m.name}`));
    }
  } catch (e) {
    console.error("Error listing models:", e.message);
  }
}
listModels();
