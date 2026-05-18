import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function Downloads() {

  const [downloads, setDownloads] = useState([]);

  useEffect(() => {
    fetchDownloads();
  }, []);

  const fetchDownloads = async () => {
  try {
    const res = await API.get("/notes/downloads");
    setDownloads(res.data);
  } catch (err) {
    alert("Error loading downloads ❌");
  }
};

  const handleDelete = async (id) => {
  try {
    if (!window.confirm("Delete this download?")) return;

    await API.delete(`/notes/downloads/${id}`);

    // UI update (no reload)
    setDownloads(downloads.filter(d => d.id !== id));

  } catch (err) {
    alert("Delete failed ❌");
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
            text-4xl
            font-extrabold

            text-center

            mb-10

            drop-shadow-2xl
          ">
          📥 My Downloads
        </h1>

        <div className="flex flex-wrap justify-center gap-6">

          {downloads.map((d) => (
  <div

  key={d.id}

  className="

    bg-white/20
    dark:bg-white/5

    backdrop-blur-xl

    p-5

    rounded-3xl

    shadow-2xl

    border
    border-white/10

    w-80

    hover:scale-[1.03]

    transition-all
    duration-300
  "
>

    <h2 className="
  text-2xl
  font-bold

  break-words
">
  {d.title}
</h2>

    <p className="
  text-sm

  mt-3

  text-white/80
  dark:text-white/60
">


      Downloaded At: {d.downloadedAt}
    </p>

    <div className="flex gap-2 mt-3">

      <a
        href={`http://localhost:8080/${d.filePath}`}
        target="_blank"
        rel="noreferrer"
        className="
  bg-blue-500
  hover:bg-blue-600

  dark:bg-cyan-500
  dark:hover:bg-cyan-600

  px-4
  py-2

  rounded-xl

  shadow-lg

  transition-all
  duration-300
"
      >
        Open File
      </a>

      <button
        onClick={() => handleDelete(d.id)}
        className="
  bg-red-500
  hover:bg-red-600

  dark:bg-rose-500
  dark:hover:bg-rose-600

  px-4
  py-2

  rounded-xl

  shadow-lg

  transition-all
  duration-300
"
      >
        Delete
      </button>

    </div>

  </div>
))}

        </div>
      </div>
    </div>
  );
}