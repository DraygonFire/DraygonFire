// api/image.js
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
    const { prompt, size } = req.body;

    if (!prompt) {
      res.status(400).json({ error: 'Missing prompt' });
      return;
    }

    const apiKey = process.env.VITE_OPENAI_API_KEY;

    if (!apiKey) {
      res.status(500).json({ error: 'Image generation is not configured yet.' });
      return;
    }

    const safePrompt = `${prompt}. Digital art style, high quality, imaginative and appropriate for all audiences.`;

    const openaiResponse = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt: safePrompt,
        n: 1,
        size: size || '1024x1024',
      }),
    });

    const data = await openaiResponse.json();

    if (!openaiResponse.ok) {
      res.status(openaiResponse.status).json({
        error: data?.error?.message || 'Image generation failed',
      });
      return;
    }

    // Newer gpt-image models return base64 data (b64_json) instead of a URL.
    // Handle both formats so this works regardless of which the API sends back.
    const imageData = data?.data?.[0];
    let imageUrl = null;

    if (imageData?.url) {
      imageUrl = imageData.url;
    } else if (imageData?.b64_json) {
      imageUrl = `data:image/png;base64,${imageData.b64_json}`;
    }

    if (!imageUrl) {
      res.status(500).json({ error: 'No image returned' });
      return;
    }

    res.status(200).json({ imageUrl, revisedPrompt: imageData?.revised_prompt || safePrompt });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error' });
  }
}
