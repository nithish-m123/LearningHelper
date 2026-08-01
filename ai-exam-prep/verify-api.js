const fs = require('fs');

async function check() {
  const envFile = fs.readFileSync('.env.local', 'utf-8');
  let apiKey = '';
  for (const line of envFile.split('\n')) {
    if (line.startsWith('GEMINI_API_KEY=')) {
      apiKey = line.split('=')[1].trim();
    }
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  const response = await fetch(url);
  const data = await response.json();

  if (data.error) {
    console.error("API Error:", data.error.message);
    return;
  }

  const embeddingModels = data.models.filter(m => 
    m.supportedMethods && m.supportedMethods.includes('embedContent')
  );

  console.log("Found Supported models:");
  embeddingModels.forEach(m => console.log(m.name));
}
check();
