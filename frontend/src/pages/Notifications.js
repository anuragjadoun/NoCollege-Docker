import { useEffect, useState } from "react";

import API from "../services/api";

import Navbar from "../components/Navbar";

export default function Notifications() {

  const [notifications, setNotifications] =
    useState([]);

  useEffect(() => {

    fetchNotifications();

    markRead();

  }, []);

  // FETCH NOTIFICATIONS

  const fetchNotifications = async () => {

    try {

      const res =
        await API.get("/notifications");

      setNotifications(res.data);

    } catch (err) {

      console.log(err);
    }
  };

  // MARK AS READ

  const markRead = async () => {

    try {

      await API.put(
        "/notifications/mark-read"
      );

    } catch (err) {

      console.log(err);
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

      <div className="
        max-w-4xl
        mx-auto
        p-6
      ">

<h1 className="
  text-5xl
  font-extrabold

  mb-10

  drop-shadow-2xl
">
          🔔 Notifications
        </h1>

        {notifications.length === 0 ? (

<div className="

  bg-white/20
  dark:bg-white/5

  backdrop-blur-xl

  rounded-3xl

  p-10

  text-center

  border
  border-white/10

  shadow-2xl
">

            <h2 className="text-2xl">
              No notifications yet 😎
            </h2>

          </div>

        ) : (

          <div className="space-y-5">

            {notifications.map((n) => (

              <div
                key={n.id}
className="

  bg-white/20
  dark:bg-white/5

  backdrop-blur-xl

  border
  border-white/10

  rounded-3xl

  p-6

  shadow-2xl

  hover:scale-[1.02]

  transition-all
  duration-300
" >

<p className="
  text-lg

  font-semibold

  leading-relaxed

  text-white
  dark:text-white/90
">
                  {n.message}
                </p>

<p className="
  text-sm

  text-pink-100
  dark:text-white/60

  mt-4
">
                  🕒 {
                    new Date(
                      n.createdAt
                    ).toLocaleString()
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