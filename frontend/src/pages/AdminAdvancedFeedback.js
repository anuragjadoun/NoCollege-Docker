import { useEffect, useState } from "react";

import API from "../services/api";

import Navbar from "../components/Navbar";

import { useNavigate } from "react-router-dom";

export default function AdminAdvancedFeedback() {

  const [feedbacks, setFeedbacks] = useState([]);
  const [userProfiles, setUserProfiles] =
  useState({});

  const navigate = useNavigate();

  useEffect(() => {

    const userEmail =
      localStorage.getItem("userEmail");

    // ONLY ADMIN ACCESS

    if (userEmail !== "anuragjadoun024@gmail.com") {

      alert("Access Denied ❌");

      navigate("/");

      return;
    }

    fetchFeedbacks();

  }, []);

  const fetchFeedbacks = async () => {

    try {

      const res =
        await API.get("/feedback/all");

      setFeedbacks(res.data);

      setFeedbacks(res.data);

// FETCH USER DPs

const profiles = {};

for (const feedback of res.data) {

  if (feedback.email) {

    try {

      const userRes = await API.get(
        `/user/profile/${feedback.email}`
      );

      profiles[feedback.email] =
        userRes.data.user;

    } catch (err) {

      console.log(err);
    }
  }
}

setUserProfiles(profiles);

    } catch (err) {

      console.log(err);

      alert("Failed to load feedbacks ❌");
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

      <div className="p-8">

<h1 className="
  text-5xl
  font-extrabold

  text-center

  mb-12

  drop-shadow-2xl
">
          📬 Advanced Feedback Dashboard
        </h1>

        {feedbacks.length === 0 ? (

<p className="
  text-center

  text-white/80
  dark:text-white/60

  text-xl
">
            No feedback available 😎
          </p>

        ) : (

          <div className="
            grid
            md:grid-cols-2
            lg:grid-cols-3
            gap-8
          ">

            {feedbacks.map((feedback) => (

              <div
                key={feedback.id}
className="

    bg-white/15
    dark:bg-white/5

    backdrop-blur-xl

    border
    border-white/10

    rounded-3xl

    p-6

    shadow-2xl

    hover:scale-[1.03]

    transition-all
    duration-300
"
              >

                <div className="
  flex
  items-center
  gap-4
  mb-4
">

  <img
    src={
      userProfiles[feedback.email]
        ?.profileImage
        ? `${import.meta.env.VITE_API_URL}/${
            userProfiles[
              feedback.email
            ].profileImage
          }`
        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }
    alt="profile"
    className="
      w-16
      h-16
      rounded-full
      object-cover
      border-2
      border-pink-300
      dark:border-cyan-400
    "
  />

  <div>

    <h2 className="
      text-2xl
      font-bold
    ">
      👤 {
        feedback.name ||
        "Unknown User"
      }
    </h2>

    <p className="
      text-sm
      text-pink-100
      dark:text-cyan-200
    ">
      📧 {
        feedback.email ||
        "No Email"
      }
    </p>

  </div>

</div>

                <p className="

  inline-block

  bg-pink-500/30
  dark:bg-cyan-500/20

  px-4
  py-1

  rounded-full

  text-sm

  mb-4

  border
  border-white/10
">
                  {
                    feedback.type ||
                    "General"
                  }
                </p>

    <p className="
  text-white/90
  dark:text-white/70

  leading-relaxed

  mb-4
">
                  {feedback.message}
                </p>

<p className="
  text-xs

  text-pink-100
  dark:text-white/50
">
                  🕒 {
                    feedback.createdAt
                      ? new Date(
                          feedback.createdAt
                        ).toLocaleString()
                      : "No Date"
                  }
                </p>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>
  );
}