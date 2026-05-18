import { useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file || !title || !description) {
      alert("All fields required ❌");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      await API.post("/notes/upload", formData);

      alert("Upload successful ✅");
      navigate("/");
    } catch (err) {
      alert("Upload failed ❌");
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
            📤 Upload Notes
          </h2>

          <input
            type="text"
            placeholder="Title"
            className="

  w-full

  p-3

  mb-4

  rounded-2xl

  text-black
  dark:text-white

  bg-white
  dark:bg-black/30

  border
  border-white/10

  outline-none

  placeholder:text-gray-500
  dark:placeholder:text-gray-400
"
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="

  w-full

  p-3

  mb-4

  rounded-2xl

  text-black
  dark:text-white

  bg-white
  dark:bg-black/30

  border
  border-white/10

  outline-none

  placeholder:text-gray-500
  dark:placeholder:text-gray-400
"
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            type="file"
            className="
  w-full

  mb-5

  text-white
  dark:text-white/80

  file:mr-4
  file:px-4
  file:py-2

  file:rounded-xl

  file:border-0

  file:bg-pink-500
  dark:file:bg-purple-500

  file:text-white

  hover:file:bg-pink-600
  dark:hover:file:bg-purple-600

  file:transition-all
"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button
            onClick={handleUpload}
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
            Upload 🚀
          </button>

        </div>
      </div>
    </div>
  );
}