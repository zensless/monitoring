// API endpoint for chatbot - this will be used as serverless function
import { OPENAI_API_KEY } from '../src/config/apiKeys';

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { message } = req.body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const systemPrompt = `Anda adalah asisten AI yang membantu warga Cileles, Jatinangor memahami kualitas air di daerah mereka. Anda memiliki pengetahuan tentang:

- Parameter kualitas air: pH, EC (konduktivitas listrik), TDS (total padatan terlarut)
- 16 stasiun pemantauan (TA01-TA16) di sekitar Cileles, Jatinangor
- Standar kualitas air minum yang aman menurut WHO dan standar Indonesia
- pH normal air minum: 6.5-8.5
- TDS normal air minum: < 500 mg/L (baik), 500-1000 mg/L (cukup baik), > 1000 mg/L (tidak disarankan)
- EC (electrical conductivity) mengukur kemampuan air menghantarkan listrik, berkaitan dengan TDS

Jawab pertanyaan dalam Bahasa Indonesia dengan ramah, informatif, dan mudah dipahami. Fokus pada penjelasan praktis yang berguna bagi warga lokal.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: message,
          },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      res.status(response.status).json({ error: `OpenAI API error: ${response.statusText}` });
      return;
    }

    const data = await response.json();
    res.status(200).json({
      message: data.choices[0]?.message?.content || 'Maaf, tidak ada respons.',
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
