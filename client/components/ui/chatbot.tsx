import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<string[]>([]); 
  const [input, setInput] = useState("");

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const sendMessage = () => {
    if (input.trim() === "") return;
    setMessages((prev) => [...prev, input]);
    setInput("");
  };

  return (
    <div>
      {/* Chatbot Toggle Button */}
      <Button
        variant="default"
        className="fixed bottom-5 right-5 rounded-full shadow-lg"
        onClick={toggleChatbot}
      >
        💬
      </Button>

      {/* Chatbot UI */}
      {isOpen && (
        <Card
          className="fixed bottom-16 right-5 w-80 shadow-lg"
        >
          <CardHeader className="bg-gray-100 p-4">
            <h3 className="text-lg font-medium">Chatbot Assistant</h3>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={toggleChatbot}
            >
              ✕
            </Button>
          </CardHeader>

          <CardContent className="flex-1 p-4">
            <ScrollArea className="h-60">
              {messages.length > 0 ? (
                messages.map((message, index) => (
                  <p key={index} className="mb-2">
                    {message}
                  </p>
                ))
              ) : (
                <p className="text-gray-500">How can I assist you today?</p>
              )}
            </ScrollArea>
          </CardContent>

          <CardFooter className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default Chatbot;
