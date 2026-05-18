import {

  useEffect,
  useState

} from "react";

import {

  useNavigate

} from "react-router-dom";

import API from "../services/api";

import Navbar from "../components/Navbar";

export default function ChatsPage() {

  const navigate =
    useNavigate();

  const [users, setUsers] =
    useState([]);

  const currentUser =
    localStorage.getItem(
      "userEmail"
    );


    const [unreadCounts, setUnreadCounts] = useState({});

useEffect(() => {

  fetchRecentChats();

  const interval = setInterval(() => {

    fetchRecentChats();

  }, 3000);

  return () => clearInterval(interval);

}, []);

  const fetchRecentChats =
    async () => {

      try {

        const res =
          await API.get(

            `/chat/recent?email=${currentUser}`
          );

        setUsers(
          res.data
        );

        // FETCH UNREAD COUNTS

const counts = {};

for (const user of res.data) {

  try {

    const unreadRes = await API.get(

      `/chat/unread-count/${
        encodeURIComponent(user.email)
      }`
    );

    counts[user.email] = unreadRes.data;

  } catch (err) {

    console.log(err);
  }
}

setUnreadCounts(counts);

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

        mt-10

        p-6
      ">

        <h1 className="
          text-5xl
          font-extrabold

          mb-10
        ">
          💬 Chats
        </h1>

        <div className="
          space-y-5
        ">

          {
            users.map((user) => (

              <div
                key={user.email}

                onClick={() =>

                  navigate(

                    `/chat/${encodeURIComponent(
                      user.email
                    )}`
                  )
                }

                className="
                  flex
                  items-center
                  gap-5

                  p-5

                  rounded-3xl

                  bg-white/10
                  dark:bg-white/5

                  backdrop-blur-xl

                  shadow-2xl

                  hover:scale-[1.02]

                  transition-all
                  duration-300

                  cursor-pointer
                "
              >

                {/* DP */}

                <img
                  src={

                    user.profileImage

                      ? `${import.meta.env.VITE_API_URL}/${user.profileImage}`

                      : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                  }

                  alt="profile"

                  className="
                    w-16
                    h-16

                    rounded-full

                    object-cover

                    border-2
                    border-white
                  "
                />

                {/* INFO */}
<div className="
  flex
  justify-between
  items-center

  w-full
">

  <div>

    <h2 className="
      text-2xl
      font-bold
    ">
<>

  {
    user.fullName ||

    user.email.split("@")[0]
  }

  {

    user.plan === "PRO"

    &&

    " 💎"
  }

  {

    user.plan === "PREMIUM"

    &&

    " 👑"
  }

</>
    </h2>

    <p className="
      text-white/70
      mt-1
    ">
      {user.email}
    </p>

  </div>

  {
    unreadCounts[user.email] > 0 && (

      <div className="
        min-w-[32px]
        h-8

        px-2

        flex
        items-center
        justify-center

        rounded-full

        bg-red-500

        text-white

        text-sm
        font-bold

        shadow-xl
      ">
        {unreadCounts[user.email]}
      </div>
    )
  }

</div>

              </div>
            ))
          }

        </div>

      </div>

    </div>
  );
}