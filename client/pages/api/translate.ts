// File: pages/api/translate.ts

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

/**
 * API handler for text translation requests.
 * 
 * Accepts a POST request with an array of texts and a target language.
 * Forwards the request to a backend translation service and returns the translations.
 * 
 * @param req - The incoming HTTP request.
 * @param res - The HTTP response to be sent back.
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TranslateResponse | ErrorResponse>
) {
  // Allow only POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    console.error('Invalid request method:', req.method);
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
    console.error('Invalid request body:', req.body);
    return res.status(400).json({ error: 'Invalid texts or target language' });
  }

  console.log(`Translation request received: ${texts.length} texts to translate to ${targetLanguage}`);

  try {
    // Send the request to the backend translation API
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        texts,
        targetLanguage,
      }),
    });

    // Handle response
    if (!response.ok) {
      const error = await response.json();
      console.error(`Translation API error: ${error.error || 'Unknown error'}`);
      return res.status(response.status).json({ error: error.error || 'Unknown error' });
    }

    const data = await response.json();

    // Validate response structure
    if (!data.translatedTexts || !Array.isArray(data.translatedTexts)) {
      console.error('Invalid translation API response:', data);
      return res.status(500).json({ error: 'Invalid translation API response' });
    }

    console.log(`Translation API response received: ${data.translatedTexts.length} translations`);

    return res.status(200).json(data);
  } catch (error) {
    console.error('Translation API handler error:', error);
    return res.status(500).json({ error: 'Translation service unavailable' });
  }
}
