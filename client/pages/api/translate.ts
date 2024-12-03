// pages/api/translate.ts
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

  try {
    // Send the request to Express API
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
      return res.status(response.status).json({ error: error.error || 'Unknown error' });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Translation service unavailable' });
  }
}
