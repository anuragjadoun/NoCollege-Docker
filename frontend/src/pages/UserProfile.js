import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import API from "../services/api";

export default function UserProfile() {

  const { email } = useParams();

  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [uploads, setUploads] = useState(0);

  const [downloads, setDownloads] = useState(0);

  const [showReportModal, setShowReportModal] =
    useState(false);

  const [selectedReason, setSelectedReason] =
    useState("");

  useEffect(() => {

    fetchUserProfile();

  }, []);

  const fetchUserProfile = async () => {

    try {

      const res = await API.get(
        `/user/profile/${email}`
      );

      setUser(res.data.user);

      setUploads(res.data.uploads);

      setDownloads(res.data.downloads);

    } catch (err) {

      alert("User not found ❌");
    }
  };

  if (!user) {

    return (

      <p className="text-center text-white mt-10">
        Loading...
      </p>
    );
  }

  return (

    <>

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

        <div className="flex justify-center mt-10">

          <div className="

            bg-white/20
            dark:bg-white/5

            backdrop-blur-xl

            p-8

            rounded-3xl

            shadow-2xl

            border
            border-white/10

            w-[650px]

            hover:scale-[1.01]

            transition-all
            duration-300
          ">

            <div className="flex items-center gap-6">

              {/* PROFILE IMAGE */}
              <img
                src={
                  user.profileImage
                    ? `${import.meta.env.VITE_API_URL}/${user.profileImage}`
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                alt="profile"
                className="
                  w-28
                  h-28
                  rounded-full
                  border-4
                  border-white
                  object-cover
                "
              />

              <div>

                {/* NAME */}
                <h2 className="text-4xl font-bold">

                  <>
                    {
                      user.fullName ||
                      "NoCollege User"
                    }

                    {
                      user.plan?.toUpperCase() === "PRO"
                      &&
                      " 💎"
                    }

                    {
                      user.plan?.toUpperCase() === "PREMIUM"
                      &&
                      " 👑"
                    }
                  </>

                </h2>

                {/* EMAIL */}
                <p className="
                  mt-2

                  text-white/90
                  dark:text-white/60
                ">

                  {user.email}

                </p>

                {/* STATS */}
                <div className="
                  flex
                  gap-8
                  mt-4
                  font-bold
                ">

                  <p>{uploads} Uploads</p>

                  <p>{downloads} Downloads</p>

                </div>

                {/* BIO */}
                <p className="
                  mt-4

                  text-lg

                  text-white/90
                  dark:text-white/70
                ">

                  {user.bio || "No bio added yet..."}

                </p>

                {/* CHAT BUTTON */}
                <button

                  onClick={() =>

                    navigate(

                      `/chat/${encodeURIComponent(
                        user.email
                      )}`
                    )
                  }

                  className="
                    mt-6

                    px-8
                    py-3

                    rounded-2xl

                    bg-pink-500
                    hover:bg-pink-600

                    dark:bg-purple-500
                    dark:hover:bg-purple-600

                    shadow-2xl

                    transition-all
                    duration-300

                    hover:scale-105

                    font-bold
                  "
                >
                  💬 Chat
                </button>

                {/* REPORT BUTTON */}
                <button

                  onClick={() => {

                    setShowReportModal(true);
                  }}

                  className="

                    mt-6

                    ml-4

                    px-8
                    py-3

                    rounded-2xl

                    bg-red-500
                    hover:bg-red-600

                    dark:bg-red-600
                    dark:hover:bg-red-700

                    shadow-2xl

                    transition-all
                    duration-300

                    hover:scale-105

                    font-bold

                    text-white
                  "
                >
                  🚨 Report User
                </button>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* REPORT MODAL */}

      {
        showReportModal && (

          <div className="

            fixed
            inset-0

            bg-black/50

            flex
            items-center
            justify-center

            z-50
          ">

            <div className="

              bg-white
              dark:bg-[#111827]

              p-8

              rounded-3xl

              shadow-2xl

              w-[400px]

              text-black
              dark:text-white
            ">

              <h2 className="

                text-2xl
                font-bold

                mb-6
              ">
                🚨 Report User
              </h2>

              <div className="space-y-4">

                {
                  [

                    "Spam uploads",

                    "Abusive content",

                    "Fake notes",

                    "Harassment",

                    "Copyright violation",

                    "Other"

                  ].map((reason) => (

                    <button

                      key={reason}

                      onClick={() =>
                        setSelectedReason(reason)
                      }

                      className={`

                        w-full

                        p-3

                        rounded-2xl

                        text-left

                        transition-all
                        duration-300

                        ${
                          selectedReason === reason

                            ? "bg-red-500 text-white"

                            : "bg-gray-200 dark:bg-white/10"
                        }
                      `}
                    >
                      {reason}
                    </button>
                  ))
                }

              </div>

              <div className="

                flex
                justify-end

                gap-4

                mt-8
              ">

                <button

                  onClick={() => {

                    setShowReportModal(false);

                    setSelectedReason("");
                  }}

                  className="

                    px-6
                    py-2

                    rounded-2xl

                    bg-gray-400

                    text-white
                  "
                >
                  Cancel
                </button>

                <button

                  onClick={async () => {

                    if (!selectedReason) {

                      alert(
                        "Please select a reason"
                      );

                      return;
                    }

                    try {

                      await API.post(

                        "/report/user",

                        {

                          reportedUserEmail:
                            user.email,

                          reason:
                            selectedReason,

                          message:
                            selectedReason
                        }
                      );

                      alert(
                        "User reported successfully 🚨"
                      );

                      setShowReportModal(false);

                      setSelectedReason("");

                    } catch (err) {

                      alert(
                        "Failed to report user ❌"
                      );
                    }
                  }}

                  className="

                    px-6
                    py-2

                    rounded-2xl

                    bg-red-500
                    hover:bg-red-600

                    text-white

                    font-bold
                  "
                >
                  Submit
                </button>

              </div>

            </div>

          </div>
        )
      }

    </>
  );
}