// api/claude.js
// This is a Vercel Serverless Function. It runs on Vercel's servers,
// NOT in the browser — so it is allowed to call Anthropic directly,
// and it keeps your API key hidden from anyone viewing the site's code.

export default async function handler(req, res) {
  // Allow requests from your site (and make preflight checks pass)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Browsers send an OPTIONS request first to check permissions — just say OK
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { prompt, maxTokens } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt' });
      return;
    }

    const apiKey = process.env.VITE_ANTHROPIC_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'API key not configured on server' });
      return;
    }

    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: maxTokens || 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await anthropicResponse.json();

    if (!anthropicResponse.ok) {
      res.status(anthropicResponse.status).json({
        error: data?.error?.message || 'Anthropic API error',
      });
      return;
    }

    const text = data?.content?.map((b) => b.text || '').join('').trim() || '';
    res.status(200).json({ text });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
