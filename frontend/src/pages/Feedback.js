import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Feedback() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!message) {
      alert("Please write feedback ❌");
      return;
    }

    try {
      await API.post("/notes/feedback", message, {
        headers: {
          "Content-Type": "text/plain",
        },
      });

      alert("Feedback sent successfully ✅");
      navigate("/");
    } catch (err) {
      alert("Failed to send feedback ❌");
    }
  };

  return (
    <div className="
  min-h-screen

  bg-gradient-to-r
  from-purple-600
  via-pink-500
  to-purple-700

  dark:from-[#0f172a]
  dark:via-[#111827]
  dark:to-black

  text-white
">


      <Navbar />

      <div className="flex justify-center items-center h-[80vh]">

        <div className="

  bg-white/20
  dark:bg-white/5

  backdrop-blur-xl

  p-8

  rounded-3xl

  shadow-2xl

  border
  border-white/10

  w-96

  hover:scale-[1.02]

  transition-all
  duration-300
">

          <h2 className="
  text-3xl
  font-extrabold

  mb-6

  text-center

  drop-shadow-2xl
">
            💬 Send Feedback
          </h2>

          <textarea
            placeholder="Write your feedback..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="

  w-full

  p-4

  rounded-2xl

  text-black
  dark:text-white

  bg-white
  dark:bg-black/30

  border
  border-white/10

  outline-none

  mb-5

  resize-none

  placeholder:text-gray-500
  dark:placeholder:text-gray-400
"
          />

          <button
            onClick={handleSubmit}
            className="

  w-full

  bg-pink-500
  hover:bg-pink-600

  dark:bg-purple-500
  dark:hover:bg-purple-600

  py-3

  rounded-2xl

  shadow-2xl

  transition-all
  duration-300

  hover:scale-[1.02]

  font-bold
"
          >
            Submit 🚀
          </button>

        </div>
      </div>
    </div>
  );
}