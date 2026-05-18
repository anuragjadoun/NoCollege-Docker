import { useEffect, useState } from "react";

import API from "../services/api";

import Navbar from "../components/Navbar";

export default function Bookmarks() {

  const [notes, setNotes] =
    useState([]);

  useEffect(() => {

    fetchBookmarks();

  }, []);

  const fetchBookmarks = async () => {

    try {

      const res =
        await API.get("/bookmarks");

      setNotes(res.data);

    } catch (err) {

      console.log(err);

      alert(
        "Failed to load bookmarks ❌"
      );
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

      transition-all
      duration-500
    ">

      <Navbar />

      <div className="p-10">

        <h1 className="
          text-5xl
          font-extrabold
          text-center
          mb-14
        ">
          🔖 My Bookmarks
        </h1>

        {

          notes.length === 0

          ? (

            <p className="
              text-center
              text-2xl
              text-white/70
            ">
              No bookmarked notes yet 😢
            </p>

          )

          : (

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              lg:grid-cols-3
              gap-10
            ">

              {

                notes.map((note) => (

                  <div
                    key={note.id}

                    className="
                      bg-white/10
                      dark:bg-white/5

                      backdrop-blur-xl

                      border
                      border-white/10

                      rounded-3xl

                      p-6

                      shadow-2xl

                      transition-all
                      duration-300

                      hover:scale-105
                    "
                  >

                    <h2 className="
                      text-3xl
                      font-bold
                    ">
                      {note.title}
                    </h2>

                    <p className="
                      mt-4
                      text-white/80
                      leading-7
                    ">
                      {note.description}
                    </p>

                    <a
                      href={`http://localhost:8080/${note.filePath}`}

                      target="_blank"

                      rel="noreferrer"

                      className="
                        inline-block
                        mt-6

                        bg-pink-500
                        hover:bg-pink-600

                        px-5
                        py-3

                        rounded-2xl

                        shadow-xl

                        transition-all
                        duration-300
                      "
                    >
                      📥 Download
                    </a>

                  </div>
                ))
              }

            </div>
          )
        }

      </div>

    </div>
  );
}