// pages/api/chatbot.ts

import { NextApiRequest, NextApiResponse } from 'next';

// Chatbot request handler
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Handle non-POST requests
    res.status(405).json({ error: `Method ${req.method} not allowed` });
    return;
  }

  const userMessage: string = req.body.message;

  // Process the user message to determine intent and entities
  const { intent, entities } = processMessage(userMessage);

  let responseText: string;
  let options: string[] | undefined;

  // Handle intents
  switch (intent) {
    case 'greeting':
      responseText =
        'Welcome to Panda Express! How can I assist you with navigating the kiosk today?';
      options = [
        'Tell me about combos',
        'How to add an item',
        'What are your hours?',
        'Where are you located?',
      ];
      break;
    case 'combo_info':
      responseText = handleComboInfoIntent();
      options = [
        'How to add an item',
        'What are your hours?',
        'Where are you located?',
        'Other inquiries',
      ];
      break;
    case 'kiosk_help':
      responseText = handleKioskHelpIntent(entities);
      options = [
        'Tell me about combos',
        'What are your hours?',
        'Where are you located?',
        'Other inquiries',
      ];
      break;
    case 'general_inquiry':
      responseText = handleGeneralInquiryIntent(entities);
      options = [
        'Tell me about combos',
        'How to add an item',
        'Other inquiries',
      ];
      break;
    case 'other_inquiries':
      responseText = 'For other inquiries, please call us at +19792687570.';
      options = [
        'Tell me about combos',
        'How to add an item',
        'What are your hours?',
        'Where are you located?',
      ];
      break;
    default:
      responseText =
        "I'm here to help you navigate the kiosk. Could you please specify how I can assist you?";
      options = [
        'Tell me about combos',
        'How to add an item',
        'What are your hours?',
        'Where are you located?',
      ];
  }

  // Send the response back to the frontend
  res.status(200).json({ response: responseText, options });
}

// Intent Handlers

function handleComboInfoIntent(): string {
  return `At Panda Express, we offer several combo options:

- **Bowl**: Choose 1 side and 1 entree.
- **Plate**: Choose 1 side and 2 entrees.
- **Bigger Plate**: Choose 1 side and 3 entrees.

To select a combo, tap on the 'Combos' category and choose the option you prefer.`;
}

function handleKioskHelpIntent(entities: any): string {
  const topic: string | undefined = entities.topic;

  if (topic === 'add_item') {
    return 'To add an item to your order, navigate to the desired category and tap on the item you want to add.';
  }

  if (topic === 'remove_item') {
    return 'To remove an item from your order, tap on the cart icon, find the item you wish to remove, and tap the remove button.';
  }

  if (topic === 'checkout') {
    return 'When you are ready to complete your order, tap on the cart icon and then tap the "Checkout" button.';
  }

  return 'How can I assist you with using the kiosk? You can ask about adding items, removing items, or checking out.';
}

function handleGeneralInquiryIntent(entities: any): string {
  const inquiry: string | undefined = entities.inquiry;

  if (inquiry === 'hours') {
    return 'Our store hours are from 10:00 AM to 9:00 PM daily.';
  }

  if (inquiry === 'location') {
    return 'We are located at 123 Panda Express Lane.';
  }

  return 'What would you like to know? I can assist with questions about store hours, location, and using the kiosk.';
}

// Simple NLU Processor

interface NLUResult {
  intent: string;
  entities: any;
}

function processMessage(message: string): NLUResult {
  const text = message.toLowerCase().trim();

  // Intent recognition
  const intent = identifyIntent(text);
  const entities = extractEntities(intent, text);

  return { intent, entities };
}

// Function to identify the user's intent based on the message
function identifyIntent(text: string): string {
  if (/^(hi|hello|hey)\b/.test(text)) {
    return 'greeting';
  }

  if (/combo|meal options|combos/i.test(text)) {
    return 'combo_info';
  }

  if (/how to|help with|i need help with|add an item|remove an item|checkout/i.test(text)) {
    return 'kiosk_help';
  }

  if (/hours|location|open|address|find you|where are you/i.test(text)) {
    return 'general_inquiry';
  }

  if (/other inquiries?/i.test(text)) {
    return 'other_inquiries';
  }

  return 'unknown';
}

// Function to extract entities based on the identified intent
function extractEntities(intent: string, text: string): any {
  switch (intent) {
    case 'kiosk_help':
      const topic = extractKioskTopic(text);
      return { topic };

    case 'general_inquiry':
      const inquiry = extractGeneralInquiry(text);
      return { inquiry };

    default:
      return {};
  }
}

// Helper function to extract kiosk topics from the user's message
function extractKioskTopic(text: string): string | undefined {
  if (/add|order|select|add an item/i.test(text)) return 'add_item';
  if (/remove|delete|cancel|remove an item/i.test(text)) return 'remove_item';
  if (/checkout|pay|finish|complete/i.test(text)) return 'checkout';
  return undefined;
}

// Helper function to extract general inquiries from the user's message
function extractGeneralInquiry(text: string): string | undefined {
  if (/hours|open|close|closing/i.test(text)) return 'hours';
  if (/location|address|find you|where are you/i.test(text)) return 'location';
  return undefined;
}
