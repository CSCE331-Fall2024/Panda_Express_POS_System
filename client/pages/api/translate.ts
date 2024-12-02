import type { NextApiRequest, NextApiResponse } from 'next';

type TranslateRequest = {
  texts: string[];
  targetLanguage: string;
};

type TranslateResponse = {
  translatedTexts: string[];
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranslateResponse | ErrorResponse>
) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate request body
  const { texts, targetLanguage }: TranslateRequest = req.body;
  if (
    !texts ||
    !Array.isArray(texts) ||
    texts.length === 0 ||
    typeof targetLanguage !== 'string' ||
    targetLanguage.trim() === ''
  ) {
    return res.status(400).json({ error: 'Invalid texts or target language' });
  }

  // Check API key
  const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;
  if (!apiKey) {
    console.error('Google Translate API key is missing');
    return res.status(500).json({ error: 'Translation service not configured' });
  }

  // API URL
  const url = 'https://translation.googleapis.com/language/translate/v2';

  try {
    // API request
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        q: texts,
        target: targetLanguage,
        key: apiKey,
      }),
    });

    // Handle response
    if (!response.ok) {
      const error = await response.json();
      console.error('Translation API Error:', error);
      return res.status(response.status).json({ error: error.error.message || 'Unknown error' });
    }

    const data = await response.json();
    const translatedTexts = data.data.translations.map((t: any) => t.translatedText);

    // Respond with translated texts
    return res.status(200).json({ translatedTexts });
  } catch (error: any) {
    // Handle server or network errors
    console.error('Error translating text:', error.message || error);
    return res.status(500).json({ error: 'Translation service unavailable' });
  }
}
