import { useNavigate } from "react-router-dom";
import { useState , useEffect} from "react";
import API from "../services/api";

export default function Navbar() {

  const [darkMode, setDarkMode] = useState(

  localStorage.getItem("theme") === "dark"

);

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] =
  useState(0);

      const [notifications, setNotifications] =
  useState([]);

const [showNotifications,
  setShowNotifications] =
  useState(false);

  const userEmail = localStorage.getItem("userEmail");

      useEffect(() => {

  fetchNotifications();

  fetchUnreadCount();

}, []);

const fetchNotifications =
  async () => {

    try {

      const res =
        await API.get("/notifications");

      setNotifications(res.data);

    } catch (err) {

      console.log(err);
    }
};


const fetchUnreadCount =
  async () => {

    try {

      const email =
        localStorage.getItem(
          "userEmail"
        );

      const res =
        await API.get(

          `/chat/unread-count?email=${email}`
        );

      setUnreadCount(
        res.data
      );

    } catch (err) {

      console.log(err);
    }
};

  const handleLogout = () => {

    localStorage.clear();

    window.location.href = "/";
  };

  return (

    <div
      className="
  sticky
  top-0
  z-50
  flex
  justify-between
  items-center
  px-10
  py-2

  bg-black/10
  dark:bg-black/40

  backdrop-blur-2xl

  border-b
  border-white/10

  dark:border-white/5

  shadow-lg
"
    >

      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        className="cursor-pointer select-none"
      >

        <h1
            className="
              leading-none
              bg-gradient-to-r
              from-pink-100
              via-white
              to-purple-100
              bg-clip-text
              text-transparent
            "
            style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: "34px",
              fontWeight: "700",
              letterSpacing: "-1px"
            }}
          >
            NoCollege
          </h1>

        {/* <p
          className="
            text-[10px]
            uppercase
            tracking-[5px]
            text-pink-100/60
            ml-1
            mt-1
          "
        >
          Learn • Share • Grow
        </p> */}

      </div>


      

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-5">

        <button

  onClick={() => navigate("/upgrade")}

  className="

    relative

    px-5
    py-2.5

    rounded-2xl

    font-bold

    text-white

    bg-gradient-to-r
    from-yellow-400
    via-orange-500
    to-pink-500

    shadow-[0_0_25px_rgba(255,180,0,0.7)]

    hover:scale-105

    transition-all
    duration-300

    animate-pulse

    border
    border-white/20
  "
>
  👑 Upgrade
</button>

        <button
  onClick={() => {

    const newTheme = !darkMode;

    setDarkMode(newTheme);

    if (newTheme) {

      document.documentElement
        .classList.add("dark");

      localStorage.setItem(
        "theme",
        "dark"
      );

    } else {

      document.documentElement
        .classList.remove("dark");

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }}

  className="
  w-12
  h-12
  rounded-full

  bg-white/20
  dark:bg-white/10

  backdrop-blur-lg

  text-white
  text-xl

  flex
  items-center
  justify-center

  hover:scale-110
  hover:rotate-12

  transition-all
  duration-300

  border
  border-white/10
"
>

  {darkMode ? "🌙" : "☀️"}

</button>

        {/* UPLOAD BUTTON */}
        <button
          onClick={() => navigate("/upload")}
          className="
  px-5
  py-2
  rounded-full

  bg-white/95
  dark:bg-white/10

  text-purple-700
  dark:text-white

  font-semibold

  shadow-md

  hover:scale-105

  hover:bg-white
  dark:hover:bg-white/20

  transition-all
  duration-300

  border
  border-white/10
"
        >
          Upload
        </button>


          
{/* NOTIFICATION BELL */}

<div className="relative">

  <button
    onClick={async () => {

      // try {

      //   await API.put(
      //     "/notifications/mark-read"
      //   );

      // } catch (err) {

      //   console.log(err);
      // }

      navigate("/notifications");
    }}
    className="
      relative
      text-white
      text-3xl
      hover:scale-110
      transition
    "
  >

    🔔

    {/* COUNT BADGE */}

    {notifications.filter(
      n => !n.read
    ).length > 0 && (

      <span
        className="
          absolute
          -top-2
          -right-2
          bg-red-500
          text-white
          text-xs
          rounded-full
          w-5
          h-5
          flex
          items-center
          justify-center
        "
      >

        {
          notifications.filter(
            n => !n.read
          ).length
        }

      </span>

    )}

  </button>

</div>

        {/* PROFILE */}
        <div className="relative">

          <img
            src={
              localStorage.getItem("profileImage")
                ? `${import.meta.env.VITE_API_URL}/${localStorage.getItem("profileImage")}`
                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
            }
            alt="profile"
            onClick={() => setOpen(!open)}
            className="
              w-14
              h-14
              rounded-full
              object-cover
              border-2
              border-white/70
              cursor-pointer
              hover:scale-105
              transition-all
              duration-300
              shadow-lg
            "
          />

          {/* DROPDOWN */}
          {open && (

            <div
              className="
  absolute
  right-0
  mt-3
  w-56
  rounded-2xl
  overflow-hidden

  bg-white/95
  dark:bg-[#111827]/95

  backdrop-blur-xl

  text-black
  dark:text-white

  shadow-2xl

  border
  border-white/20
  dark:border-white/10
"
            >

              <p
                onClick={() => {
                  navigate("/profile");
                  setOpen(false);
                }}
                className="
                  px-5
                  py-3
                  hover:bg-pink-100 dark:hover:bg-white/10
                  cursor-pointer
                  transition
                "
              >
                Profile
              </p>

              <p
                onClick={() => {
                  navigate("/my-uploads");
                  setOpen(false);
                }}
                className="
                  px-5
                  py-3
                  hover:bg-pink-100 dark:hover:bg-white/10
                  cursor-pointer
                  transition
                "
              >
                My Uploads
              </p>

              <p
                onClick={() => {
                  navigate("/downloads");
                  setOpen(false);
                }}
                className="
                  px-5
                  py-3
                  hover:bg-pink-100 dark:hover:bg-white/10
                  cursor-pointer
                  transition
                "
              >
                Downloads
              </p>

              <button

  onClick={() =>
    navigate("/bookmarks")
  }

  className="
    block
    w-full
    text-left

    px-5
    py-3

    hover:bg-white/10

    transition-all
    duration-300
  "
>
  Bookmarks
</button>



<button

  onClick={() =>
    navigate("/chats")
  }

  className="
    w-full

    flex
    items-center
    justify-between

    px-5
    py-3

    hover:bg-white/10

    transition-all
    duration-300
  "
>

  <span>
    Chats
  </span>

  {

    unreadCount > 0 && (

      <span className="

        min-w-[28px]
        h-[28px]

        flex
        items-center
        justify-center

        rounded-full

        bg-red-500

        text-white

        text-sm
        font-bold

        px-2
      ">

        {unreadCount}

      </span>
    )
  }

</button>

              <p
                onClick={() => {
                  navigate("/feedback");
                  setOpen(false);
                }}
                className="
                  px-5
                  py-3
                  hover:bg-pink-100 dark:hover:bg-white/10
                  cursor-pointer
                  transition
                "
              >
                Send Feedback
              </p>

{/* ADMIN */}

{userEmail === "anurag11@gmail.com" && (

  <>

    <p
      onClick={() => {

        navigate("/admin-advanced-feedback");

        setOpen(false);
      }}

      className="
        px-5
        py-3

        hover:bg-yellow-100
        dark:hover:bg-white/10

        cursor-pointer

        transition
      "
    >
      Admin Panel
    </p>

    <p
      onClick={() => {

        navigate("/admin-reports");

        setOpen(false);
      }}

      className="
        px-5
        py-3

        hover:bg-red-100
        dark:hover:bg-white/10

        cursor-pointer

        transition

        text-black
        dark:text-white
      "
    >
       User Reports
    </p>

  </>

)}

              {/* LOGOUT */}
              <p
                onClick={handleLogout}
                className="
                  px-5
                  py-3
                  hover:bg-red-100 dark:hover:bg-red-500/20
                  text-red-600
                  font-semibold
                  cursor-pointer
                  transition
                "
              >
                Logout
              </p>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}