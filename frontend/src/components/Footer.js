import { useNavigate } from "react-router-dom";

export default function Footer() {

  const navigate = useNavigate();

  return (

    <footer
      className="
  w-full
  mt-24

  bg-black/20
  dark:bg-black/40

  backdrop-blur-xl

  border-t
  border-white/10
  dark:border-white/5

  text-white

  transition-all
  duration-500
"
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-14
          grid
          md:grid-cols-3
          gap-10
        "
      >

        {/* LEFT */}
        <div>

          <h2
            className="
              text-4xl
              font-extrabold
              bg-gradient-to-r
              from-pink-100
              via-white
              to-purple-100
              bg-clip-text
              text-transparent
            "
          >
            NoCollege
          </h2>

          <p
            className="
              mt-4
              text-white/70 dark:text-gray-300
              leading-7
            "
          >
            A student community platform where
            learners share notes, connect with
            others, and grow together.
          </p>

        </div>

        {/* CENTER */}
        <div>

          <h3 className="text-2xl font-bold mb-5">
            Quick Links
          </h3>

          <div className="flex flex-col gap-3 text-white/80">

            <p
              onClick={() => navigate("/home")}
              className="cursor-pointer hover:text-white transition"
            >
              Home
            </p>

            <p
              onClick={() => navigate("/upload")}
              className="cursor-pointer hover:text-white transition"
            >
              Upload Notes
            </p>

            <p
              onClick={() => navigate("/profile")}
              className="cursor-pointer hover:text-white transition"
            >
              Profile
            </p>

            <p
              onClick={() =>
                window.scrollTo({
                  top: document.body.scrollHeight,
                  behavior: "smooth"
                })
              }
              className="cursor-pointer hover:text-white transition"
            >
              Feedback
            </p>

          </div>

        </div>

        {/* RIGHT */}
        <div>

          <h3 className="text-2xl font-bold mb-5">
            About Creator
          </h3>

          <p className="text-white/70 dark:text-gray-300 leading-7">

            Designed and developed with passion
            for students and developers.

          </p>

          <p className="mt-5 text-pink-200 font-semibold">
            Made with ❤️ by Anurag Jadoun
          </p>

        </div>

      </div>

      {/* BOTTOM */}
      <div
        className="
          border-t
          border-white/10
          py-5
          text-center
          text-white/60 dark:text-gray-400
          text-sm
        "
      >

        © 2026 NoCollege. All rights reserved.

      </div>

    </footer>
  );
}