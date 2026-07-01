// api/image.js
// Vercel Serverless Function — generates images via OpenAI's DALL-E 3.
// Runs server-side, keeps the OpenAI key hidden from the browser,
// and avoids CORS issues the same way api/claude.js does for text.

export default async function handler(req, res) {
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
    const { prompt, size, style } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt' });
      return;
    }

    const apiKey = process.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'Image generation is not configured yet. Add VITE_OPENAI_API_KEY in Vercel environment variables.' });
      return;
    }

    // Basic content safety pre-check happens on OpenAI's side automatically,
    // but we also keep prompts scoped to creative/art use only.
    const safePrompt = `${prompt}. Digital art style, high quality, imaginative and appropriate for all audiences.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: safePrompt,
        n: 1,
        size: size || '1024x1024',
        style: style || 'vivid', // 'vivid' = dramatic/fantasy, 'natural' = realistic
        quality: 'standard',
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      res.status(openaiResponse.status).json({
        error: data?.error?.message || 'Image generation failed',
      });
      return;
    }

    const imageUrl = data?.data?.[0]?.url || null;
    const revisedPrompt = data?.data?.[0]?.revised_prompt || safePrompt;

    if (!imageUrl) {
      res.status(500).json({ error: 'No image returned' });
      return;
    }

    res.status(200).json({ imageUrl, revisedPrompt });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
