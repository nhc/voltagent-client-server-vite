import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
};

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToVoltAgent = async (content: string) => {
    try {
      // Format conversation history for the backend
      const conversationHistory = messages.map((msg) => ({
        role: msg.isUser ? "user" : "assistant",
        content: msg.content,
      }));

      const response = await fetch("http://localhost:3000/stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: content,
          conversationHistory,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from VoltAgent");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedResponse = "";
      setIsStreaming(true);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        // Split the chunk by double newlines to handle multiple SSE messages
        const messages = chunk.split("\n\n");

        for (const message of messages) {
          if (message.startsWith("data: ")) {
            try {
              const jsonData = JSON.parse(message.slice(6)); // Remove 'data: ' prefix
              if (jsonData.type === "text") {
                accumulatedResponse += jsonData.text;

                // Update the last message with the accumulated response
                setMessages((prev) => {
                  const newMessages = [...prev];
                  const lastMessage = newMessages[newMessages.length - 1];
                  if (lastMessage && !lastMessage.isUser) {
                    lastMessage.content = accumulatedResponse;
                  }
                  return newMessages;
                });
              }
            } catch (e) {
              console.error("Error parsing SSE message:", e);
            }
          }
        }
      }

      return accumulatedResponse;
    } catch (error) {
      console.error("Error communicating with VoltAgent:", error);
      return "Sorry, I encountered an error while processing your message.";
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Add an empty AI message that will be updated as the stream comes in
    const aiMessage: Message = {
      id: crypto.randomUUID(),
      content: "",
      isUser: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, aiMessage]);

    try {
      await sendMessageToVoltAgent(inputValue);
    } catch (error) {
      console.error("Error:", error);
      // Update the AI message with an error message
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && !lastMessage.isUser) {
          lastMessage.content =
            "Sorry, I encountered an error while processing your message.";
        }
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.isUser ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.isUser
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <span className="text-xs opacity-70 mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
              <p className="text-sm">Thinking...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-gray-200 p-4 bg-white"
      >
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;
