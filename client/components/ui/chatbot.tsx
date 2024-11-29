import React, { useState, useEffect, useRef } from 'react';

// Define the message type
interface Message {
  sender: 'user' | 'bot';
  text: string;
  options?: string[];
}

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = async (messageText: string) => {
    const userMessage = messageText.trim();
    if (userMessage === '') return; // Prevent sending empty messages

    // Add user's message to the messages state
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);

    try {
      // Send the message to the backend API
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch chatbot response');
      }

      const data = await response.json();

      // Add the bot's response to the messages state
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: data.response, options: data.options },
      ]);
    } catch (error) {
      console.error(error);
      // Handle error (e.g., display an error message)
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, something went wrong.' },
      ]);
    }
  };

  useEffect(() => {
    // Auto-scroll to the bottom when new messages are added
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Send a greeting message when the chatbot is opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Simulate bot greeting
      setMessages([
        {
          sender: 'bot',
          text: 'Welcome to Panda Express! How can I assist you with navigating the kiosk today?',
          options: [
            'Tell me about combos',
            'How to add an item',
            'What are your hours?',
            'Where are you located?',
          ],
        },
      ]);
    }
  }, [isOpen]);

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <button
        className="fixed bottom-5 right-5 bg-red-500 text-white rounded-full p-4 shadow-lg"
        onClick={toggleChatbot}
        aria-label="Toggle Chatbot"
      >
        💬
      </button>

      {/* Chatbot UI */}
      {isOpen && (
        <div className="fixed bottom-16 right-5 w-80 h-96 bg-white shadow-lg flex flex-col">
          {/* Header */}
          <div className="bg-red-500 p-4 text-white flex justify-between items-center">
            <h3 className="text-lg font-medium">Chatbot Assistant</h3>
            <button
              className="text-white"
              onClick={toggleChatbot}
              aria-label="Close Chatbot"
            >
              ✕
            </button>
          </div>

          {/* Chat Content */}
          <div
            className="flex-1 p-4 overflow-y-auto"
            ref={messageContainerRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  message.sender === 'user' ? 'text-right' : 'text-left'
                }`}
              >
                <div
                  className={`inline-block p-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {message.text}
                </div>
                {/* Display options if available */}
                {message.options && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {message.options.map((option, idx) => (
                      <button
                        key={idx}
                        className="bg-gray-300 text-gray-800 px-2 py-1 rounded"
                        onClick={() => sendMessage(option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
};

export default Chatbot;
