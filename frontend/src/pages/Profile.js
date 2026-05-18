import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Profile() {

  const [user, setUser] = useState(null);

  const [stats, setStats] = useState({
    uploads: 0,
    downloads: 0
  });

  const [activeTab, setActiveTab] = useState("uploads");

  const [data, setData] = useState([]);

  // 🔥 STATES
  const [showEdit, setShowEdit] = useState(false);

  const [fullName, setFullName] = useState("");

  const [bio, setBio] = useState("");

  const [profileImage, setProfileImage] = useState("");

  // 🔥 NEW IMAGE FILE STATE
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {

    if (activeTab === "uploads") {

      fetchUploads();

    } else {

      fetchDownloads();
    }

  }, [activeTab, user]);

  // 🔥 FETCH PROFILE
  const fetchProfile = async () => {

    try {

      const res = await API.get("/user/profile");

      setUser(res.data.user);

      setStats(res.data);

      setFullName(res.data.user.fullName || "");

      setBio(res.data.user.bio || "");

      setProfileImage(res.data.user.profileImage || "");

    } catch (err) {

      alert("Error loading profile ❌");
    }
  };

  // 🔥 FETCH UPLOADS
  const fetchUploads = async () => {

    try {

      const res = await API.get("/notes/all");

      const myEmail = user?.email;

      const filtered = res.data.filter(
        n => n.user?.email === myEmail
      );

      setData(filtered);

    } catch {

      alert("Error loading uploads ❌");
    }
  };

  // 🔥 FETCH DOWNLOADS
  const fetchDownloads = async () => {

    try {

      const res = await API.get("/notes/downloads");

      setData(res.data);

    } catch {

      alert("Error loading downloads ❌");
    }
  };

  // 🔥 UPDATE PROFILE
  const updateProfile = async () => {

  try {

    const token = localStorage.getItem("token");

    await API.put(
      "/user/profile/update",
      {
        fullName,
        bio,
        //profileImage
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // UPDATE UI STATE

setUser((prev) => ({

  ...prev,

  fullName,

  bio

}));

// UPDATE LOCAL STORAGE

localStorage.setItem(
  "userName",
  fullName
);

    alert("Profile updated successfully 🔥");

    setShowEdit(false);

    fetchProfile();

  } catch (err) {

    console.log(err);

    alert("Profile update failed ❌");
  }
};

  // 🔥 REAL IMAGE UPLOAD
  const uploadProfileImage = async () => {

    if (!imageFile) {

      alert("Please select image ❌");

      return;
    }

    try {

      const formData = new FormData();

      formData.append("file", imageFile);

      const token = localStorage.getItem("token");

        const res = await API.post(
        "/user/profile/upload-image",
        formData,
        {
            headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
            },
        }
        );

      setUser(res.data);

        localStorage.setItem(
        "profileImage",
        res.data.profileImage
      );

      window.location.reload();

      alert("Profile image updated 🔥");

      localStorage.setItem(
        "profileImage",
        profileImage
      );

      fetchProfile();

    } catch (err) {

      alert("Image upload failed ❌");
    }
  };

  if (!user)
    return (
      <p className="text-center mt-10">
        Loading...
      </p>
    );

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

      <div className="flex justify-center mt-10 pb-10">

        <div className="
  bg-white/20
  dark:bg-white/5

  backdrop-blur-lg

  p-6

  rounded-2xl

  shadow-2xl

  border
  border-white/10

  w-[700px]
">

          {/* PROFILE */}
          <div className="flex items-start gap-6">

            <img
              src={
                user.profileImage
                  ? `${import.meta.env.VITE_API_URL}/${user.profileImage}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-28 h-28 rounded-full border-4 border-white object-cover"
            />

            <div className="flex-1">

<h2 className="text-3xl font-bold">

  <>

    {
      fullName ||
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

              <p className="
                  text-sm

                  text-white/80
                  dark:text-white/60

                  mt-1
                ">

                {user.email}

              </p>

              {/* TABS */}
              <div className="flex gap-8 mt-4 text-lg font-semibold">

                <button
                  onClick={() => setActiveTab("uploads")}
                  className={`cursor-pointer ${
                    activeTab === "uploads"
                      ? "underline"
                      : ""
                  }`}
                >
                  {stats.uploads} Uploads
                </button>

                <button
                  onClick={() => setActiveTab("downloads")}
                  className={`cursor-pointer ${
                    activeTab === "downloads"
                      ? "underline"
                      : ""
                  }`}
                >
                  {stats.downloads} Downloads
                </button>

              </div>

              {/* BIO */}
              <p className="
                  mt-4

                  text-white/90
                  dark:text-white/70

                  leading-relaxed
                ">

                {bio || "No bio added yet..."}

              </p>

              {/* 🔥 IMAGE UPLOAD */}
              <div className="mt-4 flex gap-3 items-center">

                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files[0])}
                  className="text-sm"
                />

                <button
                  onClick={uploadProfileImage}
                  className="
  bg-blue-500
  hover:bg-blue-600

  dark:bg-cyan-500
  dark:hover:bg-cyan-600

  px-4
  py-2

  rounded-xl

  transition-all
  duration-300

  shadow-xl
"
                >
                  Upload DP
                </button>

              </div>

              {/* EDIT BUTTON */}
              <button
                onClick={() => setShowEdit(true)}
                className="
  mt-4

  bg-pink-500
  hover:bg-pink-600

  dark:bg-purple-500
  dark:hover:bg-purple-600

  px-5
  py-2

  rounded-xl

  transition-all
  duration-300

  shadow-xl
"
              >
                Edit Profile
              </button>

            </div>

          </div>

          {/* DATA SECTION */}
          <div className="mt-8">

            {data.length === 0 ? (

              <p>No data found</p>

            ) : (

              data.map((item, index) => {

                const fileUrl = item.filePath
                  ? `${import.meta.env.VITE_API_URL}/${item.filePath}`
                  : "#";

                return (

                  <a
                    key={index}
                    href={fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="
  block

  bg-white/10
  dark:bg-white/5

  p-4

  rounded-xl

  mt-3

  hover:bg-white/20
  dark:hover:bg-white/10

  transition-all
  duration-300

  hover:scale-[1.02]

  border
  border-white/10
"
                  >

                    <p className="font-bold text-lg">

                      {item.title || "Open File"}

                    </p>

                  </a>
                );
              })
            )}

          </div>

        </div>

      </div>

      {/* 🔥 EDIT MODAL */}
      {showEdit && (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

          <div className="
  bg-white
  dark:bg-[#111827]

  text-black
  dark:text-white

  p-6

  rounded-2xl

  w-[400px]

  shadow-2xl

  border
  border-white/10
">

            <h2 className="text-2xl font-bold mb-4 text-center">

              Edit Profile

            </h2>

            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full border p-2 rounded mb-3"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Write your bio..."
              className="w-full border p-2 rounded mb-3 h-24"
            />

            <div className="flex gap-3">

              <button
                onClick={updateProfile}
                className="flex-1 bg-pink-500 text-white py-2 rounded-xl"
              >
                Save
              </button>

              <button
                onClick={() => {

  setFullName(
    user?.fullName || ""
  );

  setBio(
    user?.bio || ""
  );

  setShowEdit(false);
}}
                className="flex-1 bg-gray-400 text-white py-2 rounded-xl"
              >
                Cancel
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}