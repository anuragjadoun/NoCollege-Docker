import { useEffect, useState } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

export default function MyUploads() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetchMyNotes();
  }, []);

  const fetchMyNotes = async () => {
    try {
      const res = await API.get("/notes/my");
      setNotes(res.data);
    } catch (err) {
      alert("Error loading uploads ❌");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/notes/delete/${id}`);
      alert("Deleted successfully ✅");

      // refresh list
      fetchMyNotes();
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

  mb-10

  text-center

  drop-shadow-2xl
">
          📂 My Uploads
        </h1>

        <div className="flex flex-wrap justify-center gap-6">

          {notes.map((note) => (
            <div
              key={note.id}
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
  {note.title}
</h2>


              <p className="
  mt-3

  text-white/80
  dark:text-white/60

  leading-relaxed
">
  {note.description}
</p>




              <button
                onClick={() => handleDelete(note.id)}
                className="

  bg-red-500
  hover:bg-red-600

  dark:bg-rose-500
  dark:hover:bg-rose-600

  px-4
  py-2

  rounded-xl

  mt-4

  shadow-lg

  transition-all
  duration-300
"
              >
                Delete 
              </button>

            </div>
          ))}

        </div>
      </div>
    </div>
  );
}