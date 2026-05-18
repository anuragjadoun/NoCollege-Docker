import { useState } from "react";

import API from "../services/api";

export default function AiChatBot() {

  const [open, setOpen] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [messages, setMessages] =
    useState([
      {
        sender: "ai",
        text: "Hi 👋 I am Jimmy. Ask me anything 😎"
      }
    ]);

  // SEND MESSAGE

  const sendMessage = async () => {

    if (!message.trim()) return;

    const userMessage = {
      sender: "user",
      text: message
    };

    setMessages(prev => [
      ...prev,
      userMessage
    ]);

    const currentMessage = message;

    setMessage("");

    setLoading(true);

    try {

      const res = await API.post(
        "/ai/chat",
        {
          message: currentMessage
        }
      );

      const aiMessage = {
        sender: "ai",
        text: res.data
      };

      setMessages(prev => [
        ...prev,
        aiMessage
      ]);

    } catch (err) {

      setMessages(prev => [
        ...prev,
        {
          sender: "ai",
          text: "AI error ❌"
        }
      ]);
    }

    setLoading(false);
  };

  return (

    <>

      {/* FLOAT BUTTON */}

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="
  fixed
  bottom-6
  right-6
  bg-gradient-to-r
  from-purple-700
  to-pink-600
  hover:scale-110
  transition
  duration-300
  text-white
  rounded-full
  w-16
  h-16
  text-xl
  font-extrabold
  shadow-2xl
  border-4
  border-white/30
  z-[9999]
"
      >
        🤖
      </button>

      {/* CHAT WINDOW */}

      {open && (

        <div className="
          fixed
          bottom-24
          right-6
          w-96
          h-[550px]
          bg-white
          rounded-3xl
          shadow-2xl
          flex
          flex-col
          overflow-hidden
          z-50
        ">

          {/* HEADER */}

          <div className="
            bg-gradient-to-r
            from-purple-600
            to-pink-500
            text-white
            p-4
            font-bold
            text-lg
          ">
            🤖 NoCollege AI Assistant
          </div>

          {/* MESSAGES */}

          <div className="
            flex-1
            overflow-y-auto
            p-4
            bg-gray-100
          ">

            {messages.map((m, i) => (

              <div
                key={i}
                className={`
                  mb-4
                  flex
                  ${
                    m.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }
                `}
              >

                <div
                  className={`
                    px-4
                    py-3
                    rounded-2xl
                    max-w-[80%]
                    text-sm
                    whitespace-pre-wrap
                    ${
                      m.sender === "user"
                        ? "bg-pink-500 text-white"
                        : "bg-white text-black"
                    }
                  `}
                >
                  {m.text}
                </div>

              </div>

            ))}

            {loading && (

              <div className="
                text-gray-500
                text-sm
              ">
                AI typing...
              </div>

            )}

          </div>

          {/* INPUT */}

          <div className="
            p-3
            border-t
            flex
            gap-2
          ">

            <input
              type="text"
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  sendMessage();
                }
              }}
              placeholder="Ask anything..."
              className="
                flex-1
                border
                rounded-xl
                px-3
                py-2
                outline-none
                text-black
                bg-white
              "
            />

            <button
              onClick={sendMessage}
              className="
                bg-pink-500
                hover:bg-pink-600
                text-white
                px-4
                rounded-xl
              "
            >
              Send
            </button>

          </div>

        </div>

      )}

    </>
  );
}