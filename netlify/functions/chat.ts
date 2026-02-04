import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

const handler: Handler = async (event: HandlerEvent, context: HandlerContext) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const { message } = JSON.parse(event.body || '{}');

    if (!message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Message is required' }),
      };
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ 
          error: 'OpenAI API key not configured. Set OPENAI_API_KEY environment variable.' 
        }),
      };
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
        'Authorization': `Bearer ${apiKey}`,
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
      console.error('OpenAI API error:', error);
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `OpenAI API error: ${response.statusText}` 
        }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: data.choices[0]?.message?.content || 'Maaf, tidak ada respons.',
      }),
    };
  } catch (error: any) {
    console.error('Error in chat function:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: error.message || 'Internal server error' 
      }),
    };
  }
};

export { handler };
