import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import "tailwindcss/tailwind.css";
import "./App.css";

function ChatBot() {
  const Api = import.meta.env.VITE_GEMINI_API_KEY;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim()) {
      const newMessages = [...messages, { text: input, user: true }];
      setMessages(newMessages);
      setInput("");

      try {
        setLoading(true);
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${Api}`,
          {
            contents: [
              {
                parts: [
                  {
                    text: input,
                  },
                ],
              },
            ],
          }
        );
        const botResponse = response.data.candidates[0].content.parts[0].text;
        console.log(botResponse);

        setLoading(false);
        setMessages([...newMessages, { text: botResponse, user: false }]);
      } catch (error) {
        console.error("Error sending message:", error);
        setLoading(false);
        setMessages([
          ...newMessages,
          { text: "Error: Could not get response from AI", user: false },
        ]);
      }
    }
  };

  return (
    <div className="flex flex-col justify-around items-center h-screen bg-gradient-to-r from-green-400 to-blue-500">
      <h1 className="mb-8 font-bold text-[3rem] drop-shadow-lg text-blue-50">
        AI ChatBot
      </h1>
      <div className="bg-white w-full max-w-lg md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl shadow-lg rounded-lg h-full my-10 overflow-hidden relative ">
        <div className="p-4 h-full overflow-y-auto pb-32 thin-scroll">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.user ? "justify-end" : "justify-start"
              } mb-2`}
            >
              <div
                className={`rounded-lg p-2 shadow-md overflow-x-hidden flex flex-wrap ${
                  msg.user ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}
          {loading && (
            <div className="wrapper">
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="circle"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <div className="shadow"></div>
              <span>Loading</span>
            </div>
          )}
        </div>
        <div className="p-4  flex absolute bottom-0 right-0 left-0">
          <input
            type="text"
            className="flex-1 p-2 border border-gray-300 rounded-lg outline-none"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <button
            className="ml-2 bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition-all"
            onClick={handleSendMessage}
          >
            <IoSend />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBot;
