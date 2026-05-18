import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function AdminFeedback() {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const res = await API.get("/notes/feedback/all");
      setFeedbacks(res.data);
    } catch (err) {
      alert("Access Denied ❌");
      navigate("/");
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

      <div className="p-6">
        <h1 className="
  text-5xl
  font-extrabold

  text-center

  mb-10

  drop-shadow-2xl
">
          🛠 Admin Feedback Panel
        </h1>

        {feedbacks.length === 0 ? (
          <p className="
  text-center

  text-white/80
  dark:text-white/60

  text-xl
">
            No feedback yet 😅
          </p>
        ) : (
          <div className="flex flex-wrap justify-center gap-6">
            {feedbacks.map((f) => (
              <div
                key={f.id}
                className="

  bg-white/20
  dark:bg-white/5

  backdrop-blur-xl

  p-6

  rounded-3xl

  shadow-2xl

  border
  border-white/10

  w-80

  hover:scale-[1.03]

  transition-all
  duration-300
">
                
                
                <p className="
  text-yellow-300
  dark:text-cyan-300

  font-bold

  break-words
">
                  {f.userEmail}
                </p>

                <p className="
  mt-4

  text-white/90
  dark:text-white/70

  leading-relaxed
">
  {f.message}
</p>

                <p className="
  text-xs

  mt-5

  text-white/70
  dark:text-white/50
">
                  {f.createdAt}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}