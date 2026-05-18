import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import AiChatBot from "../components/AiChatBot";

export default function Home() {

  const [notes, setNotes] = useState([]);
  const [trendingNotes, setTrendingNotes] =
  useState([]);

  const [trendingIndex, setTrendingIndex] =
  useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [likes, setLikes] = useState({});
  const [comments, setComments] = useState({});
  const [bookmarks, setBookmarks] =
  useState({});
  const [newComment, setNewComment] = useState({});
  const [totalUsers, setTotalUsers] = useState(0);

  // RATING STATES

const [selectedRating, setSelectedRating] =
  useState(0);

const [averageRating, setAverageRating] =
  useState(0);

const [totalRatings, setTotalRatings] =
  useState(0);


  // COMMENT MENU

const [openMenuId, setOpenMenuId] =
  useState(null);


    // EDIT COMMENT

const [editingCommentId, setEditingCommentId] =
  useState(null);

const [editedText, setEditedText] =
  useState("");


    // NOTIFICATION

const [showRatingMessage, setShowRatingMessage] =
  useState(false);

  // FEEDBACK STATES

const [feedbackName, setFeedbackName] = useState("");

const [feedbackEmail, setFeedbackEmail] = useState("");

const [feedbackType, setFeedbackType] = useState("");

const [feedbackMessage, setFeedbackMessage] = useState("");

  // CURRENT CENTER CARD
  const [activeIndex, setActiveIndex] = useState(1);

  const sliderRef = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {

  fetchNotes();

  fetchTrendingNotes();

  fetchUsers();

  fetchRatingStats();

}, []);



useEffect(() => {

  if (
    trendingNotes.length === 0
  ) return;

  const interval =
    setInterval(() => {

      setTrendingIndex((prev) =>

        prev ===
        trendingNotes.length - 1

          ? 0

          : prev + 1
      );

    }, 5000);

  return () =>
    clearInterval(interval);

}, [trendingNotes]);

  // FETCH USERS COUNT
const fetchUsers = async () => {

  try {

    const res = await API.get("/user/count");

    setTotalUsers(res.data);

  } catch (err) {

    console.log("Users count error", err);
  }
};

  //  FETCH NOTES
  const fetchNotes = async () => {
    try {

      const res = await API.get("/notes/all");

      setNotes(res.data);


      const bookmarkStates = {};

for (const note of res.data) {

  try {

    const bookmarkRes =
      await API.get(
        `/bookmarks/check/${note.id}`
      );

    bookmarkStates[note.id] =
      bookmarkRes.data;

  } catch (err) {

    console.log(err);
  }
}

setBookmarks(bookmarkStates);



      res.data.forEach(note => {
        fetchLikes(note.id);
        fetchComments(note.id);
      });

    } catch (err) {
      alert("Error fetching notes ❌");
    }
  };



  const fetchTrendingNotes =
  async () => {

    try {

      const res =
        await API.get(
          "/notes/trending"
        );

      setTrendingNotes(
        res.data
      );

    } catch (err) {

      console.log(err);
    }
};


    // FETCH RATING STATS

const fetchRatingStats = async () => {

  try {

    const res =
      await API.get("/ratings/stats");

    setAverageRating(
      res.data.averageRating
    );

    setTotalRatings(
      res.data.totalRatings
    );

  } catch (err) {

    console.log(err);
  }
};



    // SUBMIT RATING

const handleRating = async (stars) => {

  try {

    const userEmail =
      localStorage.getItem("userEmail");

    if (!userEmail) {

      alert("Please login first ❌");

      return;
    }

    await API.post("/ratings/rate", {

      userEmail,

      stars

    });

    setSelectedRating(stars);

    fetchRatingStats();

    //alert("Rating submitted ⭐");

    setShowRatingMessage(true);

setTimeout(() => {

  setShowRatingMessage(false);

}, 3000);



  } catch (err) {

    console.log(err);

    alert("Rating failed ❌");
  }
};

  // FETCH LIKES
  const fetchLikes = async (noteId) => {
    try {

      const res = await API.get(`/notes/likes/${noteId}`);

      setLikes(prev => ({
        ...prev,
        [noteId]: res.data
      }));

    } catch (err) {
      console.log("Like error", err);
    }
  };

  // FETCH COMMENTS
  const fetchComments = async (noteId) => {
    try {

      const res = await API.get(`/notes/comments/${noteId}`);

      setComments(prev => ({
        ...prev,
        [noteId]: res.data
      }));

    } catch (err) {
      console.log("Comment error", err);
    }
  };

  //  SEARCH
  const handleSearch = async () => {
    try {

      const res = await API.get(`/notes/search?keyword=${keyword}`);

      setNotes(res.data);

      res.data.forEach(note => {
        fetchLikes(note.id);
        fetchComments(note.id);
      });

    } catch (err) {
      alert("Search failed ❌");
    }
  };



  const handleShare = async (note) => {

  const shareData = {

    title: note.title,

    text: `Check out these notes on NoCollege 🚀

${note.title}

${note.description}`,

    url: `${window.location.origin}/home?note=${note.id}`
  };

  try {

    // MOBILE SHARE
    if (navigator.share) {

      await navigator.share(shareData);

    } else {

      // DESKTOP COPY LINK
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert(`"${note.title}" link copied 🚀`);
    }

  } catch (err) {

    console.log(err);
  }
};


const handleBookmark = async (
  noteId
) => {

  try {

    const res =
      await API.post(

  `/bookmarks/${noteId}`,

  {},

  {
    headers: {

      Authorization:
        `Bearer ${localStorage.getItem("token")}`
    }
  }
);

    setBookmarks({

      ...bookmarks,

      [noteId]: res.data
    });

  } catch (err) {

    console.log(err);

    alert(
      "Bookmark failed ❌"
    );
  }
};




  //  LIKE
  const handleLike = async (id) => {
    try {

      await API.post(`/notes/like/${id}`);

      fetchLikes(id);

    } catch (err) {
      alert("Like failed ❌");
    }
  };

  //  COMMENT
  const handleComment = async (id) => {
    try {

      if (!newComment[id]) return;

      await API.post(`/notes/comment/${id}`, newComment[id], {
        headers: {
          "Content-Type": "text/plain"
        }
      });

      setNewComment({
        ...newComment,
        [id]: ""
      });

      fetchComments(id);

    } catch (err) {
      alert("Comment failed ❌");
    }
  };



    // START EDIT

const handleStartEdit = (comment) => {

  setEditingCommentId(comment.id);

  setEditedText(comment.text);

  setOpenMenuId(null);
};


        // DELETE COMMENT

const handleDeleteComment = async (
  commentId,
  noteId
) => {

  try {

    await API.delete(
      `/notes/comment/delete/${commentId}`
    );

    fetchComments(noteId);

  } catch (err) {

    console.log(err);

    alert("Delete failed ❌");
  }
};


      // SAVE EDIT COMMENT

const handleSaveEdit = async (
  commentId,
  noteId
) => {

  try {

    await API.put(

      `/notes/comment/edit/${commentId}`,

      editedText,

      {
        headers: {
          "Content-Type": "text/plain"
        }
      }
    );

    setEditingCommentId(null);

    setEditedText("");

    fetchComments(noteId);

  } catch (err) {

    console.log(err);

    alert("Edit failed ❌");
  }
};


  // DOWNLOAD
  const handleDownload = async (id, title) => {

  try {

    //  BACKEND DOWNLOAD API
    const response = await API.get(`/notes/download/${id}`, {
      responseType: "blob",
    });

    //  FILE DOWNLOAD
    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `${title}.pdf`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(url);

  } catch (err) {

    console.log(err);

    alert("Download failed ❌");
  }
};


  // SEND FEEDBACK

const handleFeedbackSubmit = async () => {

  if (
    !feedbackName ||
    !feedbackEmail ||
    !feedbackType ||
    !feedbackMessage
  ) {

    alert("Please fill all fields ❌");

    return;
  }

  try {

    await API.post("/feedback/send", {

      name: feedbackName,

      email: feedbackEmail,

      type: feedbackType,

      message: feedbackMessage,

      createdAt: new Date()

    });

    alert("Feedback sent successfully ✅");

    // RESET FORM

    setFeedbackName("");

    setFeedbackEmail("");

    setFeedbackType("");

    setFeedbackMessage("");

  } catch (err) {

    console.log(err);

    alert("Feedback failed ❌");
  }
};

  //  SLIDER MOVE
  const scrollLeft = () => {

    if (activeIndex > 0) {

      const newIndex = activeIndex - 1;

      setActiveIndex(newIndex);

      sliderRef.current.scrollTo({
        left: newIndex * 420,
        behavior: "smooth"
      });
    }
  };

  const scrollRight = () => {

    if (activeIndex < notes.length - 1) {

      const newIndex = activeIndex + 1;

      setActiveIndex(newIndex);

      sliderRef.current.scrollTo({
        left: newIndex * 420,
        behavior: "smooth"
      });
    }
  };

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

  transition-all
  duration-500
">

      <Navbar />


      <div className="px-6 mt-4">

  <div className="

    inline-block

    bg-red-600
    dark:bg-red-700

    text-white

    px-6
    py-3

    rounded-2xl

    shadow-2xl

    font-bold

    animate-pulse
  ">

    🚀 New exciting features coming soon...

  </div>

</div>


      {/*  HERO SECTION */}

        <div className="w-full flex justify-center mt-10 px-4">

          <div
  className="
    w-full
    max-w-6xl

    rounded-3xl

    bg-white/10
    dark:bg-white/5

    backdrop-blur-xl

    border
    border-white/10
    dark:border-white/5

    shadow-2xl

    p-10

    flex
    flex-col
    items-center
    text-center

    mb-14

    transition-all
    duration-500
  "
>

            <h1
              className="
                text-4xl
                md:text-6xl
                font-extrabold
                text-white
                leading-tight
              "
            >
              Share Notes.
              <br />

              <span className="text-pink-200">
                Help Students.
              </span>

              <br />

              Grow Together.
            </h1>

            <p
              className="
                text-white/80
                mt-6
                text-lg
                max-w-2xl
              "
            >
              NoCollege is a student community platform
              where learners can upload notes, discover
              study resources, interact with others,
              and grow together.
            </p>

            <div className="flex gap-4 mt-8 flex-wrap justify-center">

              <button
                onClick={() =>
                  window.scrollTo({
                    top: 700,
                    behavior: "smooth"
                  })
                }
                className="
                  px-8
                  py-3
                  rounded-full
                  bg-white
                  text-purple-700
                  font-bold
                  hover:scale-105
                  transition
                  duration-300
                  shadow-lg
                "
              >
                Explore Notes
              </button>

              <button
                onClick={() => navigate("/upload")}
                className="
                  px-8
                  py-3
                  rounded-full
                  bg-pink-500
                  text-white
                  font-bold
                  hover:scale-105
                  transition
                  duration-300
                  shadow-lg
                "
              >
                Upload Notes
              </button>

            </div>

          </div>

        </div>


        



      <div className="p-6 overflow-hidden">

        {/*  SEARCH */}
        <div className="flex justify-center mb-6 gap-3 flex-wrap">

          <input
  type="text"
  placeholder="Search notes..."
  value={keyword}
  onChange={(e) => setKeyword(e.target.value)}
  className="
    p-3
    rounded-2xl
    w-72

    text-black
    dark:text-white

    bg-white
    dark:bg-black/30

    placeholder:text-gray-500
    dark:placeholder:text-gray-400

    shadow-2xl
    outline-none

    border
    border-white/10
  "
/>

          <button
  onClick={handleSearch}
  className="
    bg-pink-500
    dark:bg-pink-600

    hover:bg-pink-600
    dark:hover:bg-pink-700

    transition

    px-5
    py-2

    rounded-2xl

    shadow-xl

    hover:scale-105

    duration-300
  "
>
            Search 🔍
          </button>

          <button
  onClick={fetchNotes}
  className="
    bg-gray-600
    dark:bg-gray-700

    hover:bg-gray-700
    dark:hover:bg-gray-800

    transition

    px-5
    py-2

    rounded-2xl

    shadow-xl

    hover:scale-105

    duration-300
  "
>
            Reset
          </button>

        </div>

        {/*  TITLE */}
        <h1 className="
          text-5xl
          font-extrabold
          text-center
          mb-12
          drop-shadow-2xl
        ">
          🔥 Global Notes Feed
        </h1>




        {/*  CONTROLS */}
        <div className="flex justify-center gap-4 mb-8">

          <button
            onClick={scrollLeft}
            className="
  bg-white/20
  dark:bg-white/10

  hover:bg-white/30
  dark:hover:bg-white/20

  px-5
  py-2

  rounded-full

  text-2xl

  backdrop-blur-lg

  transition-all
  duration-300

  hover:scale-110
"
          >
            ←
          </button>

          <button
            onClick={scrollRight}
            className="
  bg-white/20
  dark:bg-white/10

  hover:bg-white/30
  dark:hover:bg-white/20

  px-5
  py-2

  rounded-full

  text-2xl

  backdrop-blur-lg

  transition-all
  duration-300

  hover:scale-110
"
          >
            →
          </button>

        </div>

        {/*  NETFLIX SLIDER */}
        <div
          ref={sliderRef}
          className="
            flex
            gap-6
            overflow-hidden
            px-6
            py-10
            justify-center
            items-start
            w-full
          "
        >

         {notes
  .filter((note) => {

    if (selectedCategory === "") return true;

    const category = selectedCategory.toLowerCase();

    return (

      note.title?.toLowerCase().includes(category)

      ||

      note.description?.toLowerCase().includes(category)

    );

  })
  .slice(

  activeIndex === 0
    ? 0
    : activeIndex === notes.length - 1
    ? notes.length - 3
    : activeIndex - 1,

  activeIndex === 0
    ? 3
    : activeIndex === notes.length - 1
    ? notes.length
    : activeIndex + 2

)
  .map((note, index) => {

            const realIndex =

  activeIndex === 0
    ? index
    : activeIndex === notes.length - 1
    ? notes.length - 3 + index
    : activeIndex - 1 + index;

const isActive = realIndex === activeIndex;

            return (

              <div
                key={note.id}
                className={`
  relative
  flex-shrink-0

  h-[580px]

  rounded-3xl

  backdrop-blur-lg

  border
  border-white/10
  dark:border-white/5

  bg-white/20
  dark:bg-white/5

  shadow-2xl

  transition-all
  duration-500

  overflow-hidden
                  
                  ${isActive
                      ? "scale-100 opacity-100 w-[95vw] md:w-[420px] z-20"
                      : "scale-90 opacity-50 w-[85vw] md:w-[320px] mt-10"
                    }
                `}
              >

                {/* GLASS */}
                <div className="
                  absolute
                  inset-0
                  bg-white/5
                  pointer-events-none
                ">
                </div>

                <div className="p-6 relative z-10">

                  {/* TITLE */}
                  <h2 className="
                    text-3xl
                    font-bold
                    mb-3
                    break-words
                  ">
                    {note.title}
                  </h2>

                  {/* DESCRIPTION */}
                  <p className="text-gray-100 min-h-[70px]">
                    {note.description}
                  </p>

                  {/* USER */}
                  <p
                    onClick={() =>
                      navigate(`/user/${encodeURIComponent(note.user?.email)}`)
                    }
                    className="
                      text-yellow-300
                      cursor-pointer
                      hover:underline
                      mt-4
                    "
                  >
                    Uploaded by: {note.user?.email}
                  </p>

                  {/* ACTIONS */}
                  <div className="
                    flex
                    justify-between
                    items-center
                    mt-6
                  ">

                    <button
                      onClick={() => handleDownload(note.id, note.title)}
                      className="
                        bg-blue-500
                        hover:bg-blue-600
                        px-4
                        py-2
                        rounded-2xl
                        shadow-xl
                      "
                    >
                      Download
                    </button>


<button
  onClick={() => handleShare(note)}
className="
  flex
  items-center
  justify-center

  w-12
  h-12

  rounded-full

  bg-white/40
  dark:bg-white/20

  backdrop-blur-xl

  border-2
  border-white/40

  text-white
  text-lg

  shadow-2xl
  shadow-blue-500/20

  hover:scale-110

  hover:bg-blue-500
  dark:hover:bg-pink-500

  hover:shadow-blue-400/40
  dark:hover:shadow-pink-400/40

  transition-all
  duration-300
"
>
  🚀
</button>



<button
  onClick={() =>
    handleBookmark(note.id)
  }

  className={`
    flex
    items-center
    justify-center

    w-12
    h-12

    rounded-full

    backdrop-blur-xl

    border-2

    transition-all
    duration-300

    hover:scale-110

    shadow-2xl

    text-lg

    ${
      bookmarks[note.id]

        ? `
          bg-yellow-400
          border-yellow-300
          text-black

          dark:bg-yellow-300
          dark:border-yellow-200
        `

        : `
          bg-white/40
          dark:bg-white/20

          border-white/40

          text-white

          hover:bg-yellow-400
          dark:hover:bg-yellow-300
        `
    }
  `}
>
  🔖
</button>

                    <button
                      onClick={() => handleLike(note.id)}
                      className="
                        bg-red-500
                        hover:bg-red-600
                        px-4
                        py-2
                        rounded-2xl
                        shadow-xl
                      "
                    >
                      ❤️ {likes[note.id] || 0}
                    </button>

                  </div>

                  {/* COMMENT INPUT */}
                  <div className="mt-6">

                    <input
                      type="text"
                      placeholder="Add comment..."
                      value={newComment[note.id] || ""}
                      onChange={(e) =>
                        setNewComment({
                          ...newComment,
                          [note.id]: e.target.value,
                        })
                      }
                      className="
                        w-full
                        p-3

                        rounded-2xl

                        text-black
                        dark:text-white

                        bg-white
                        dark:bg-black/30

                        placeholder:text-gray-500
                        dark:placeholder:text-gray-400

                        outline-none

                        border
                        border-white/10
                      "
                    />

                    <button
                      onClick={() => handleComment(note.id)}
                      className="
                        bg-green-500
                        hover:bg-green-600
                        px-4
                        py-2
                        mt-3
                        rounded-2xl
                        shadow-xl
                      "
                    >
                      Comment
                    </button>

                    {/* COMMENT COUNT */}
                    <p className="text-sm mt-4">
                      💬 {comments[note.id]?.length || 0} Comments
                    </p>

                    {/* COMMENTS */}
                    <div className="
                      max-h-40
                      overflow-y-auto
                      mt-3
                      pr-2
                    ">

                      {comments[note.id]?.map((c, i) => (

                        <p
                          key={i}
                          className="text-sm mb-2
                          break-words
                          whitespace-pre-wrap"
                        >

                          <span
                              className="
                                cursor-pointer
                                hover:underline
                                font-bold
                                text-white
                              "
                              onClick={() =>
                                navigate(`/user/${encodeURIComponent(c.userEmail)}`)
                              }
                            >
                              {c.userEmail}
                            </span>

                          :

                              {editingCommentId === c.id ? (

                                <span>

                                  <input
                                  type="text"
                                  value={editedText}
                                  onChange={(e) =>
                                    setEditedText(e.target.value)
                                  }
                                  className="
                                    text-black
                                    dark:text-white

                                    bg-white
                                    dark:bg-black/30

                                    px-2
                                    py-1

                                    rounded-lg
                                    ml-2

                                    border
                                    border-white/10
                                  "
                                />

                                  <button
                                    onClick={() =>
                                      handleSaveEdit(c.id, note.id)
                                    }
                                    className="
                                      ml-2
                                      text-green-300
                                      font-bold
                                    "
                                  >
                                    Save
                                  </button>

                                  <button
                                    onClick={() =>
                                      setEditingCommentId(null)
                                    }
                                    className="
                                      ml-2
                                      text-red-300
                                      font-bold
                                    "
                                  >
                                    Cancel
                                  </button>

                                </span>

                              ) : (

                                c.text

                              )}


                                {/* COMMENT MENU */}

                                {localStorage.getItem("userEmail")
                                  === c.userEmail && (

                                  <div className="
                                    inline-block
                                    relative
                                    ml-2
                                  ">

                                    {/* 3 DOTS */}

                                    <button
                                      onClick={() =>
                                        setOpenMenuId(
                                          openMenuId === c.id
                                            ? null
                                            : c.id
                                        )
                                      }
                                      className="
                                        text-white
                                        font-bold
                                        px-2
                                      "
                                    >
                                      ⋮
                                    </button>

    {/* DROPDOWN */}

    {openMenuId === c.id && (

      <div className="
        absolute
        right-0
        mt-1
        bg-white
        text-black
        rounded-xl
        shadow-xl
        overflow-hidden
        z-50
        min-w-[100px]
      ">

        <button
  onClick={() =>
    handleStartEdit(c)
  }
  className="
    block
    w-full
    text-left
    px-4
    py-2
    hover:bg-gray-100
    text-sm
  "
>
  ✏ Edit
</button>

        <button
          onClick={() =>
            handleDeleteComment(
              c.id,
              note.id
            )
          }
          className="
            block
            w-full
            text-left
            px-4
            py-2
            hover:bg-red-100
            text-red-500
            text-sm
          "
        >
          🗑 Delete
        </button>

      </div>

    )}

  </div>

)}

                        </p>

                      ))}

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

        </div>


                {/* 🔥 TRENDING NOTES */}

{
  trendingNotes.length > 0 && (

    <div className="

      w-full

      mb-16

      flex
      flex-col
      items-center
    ">

      <h2 className="

        text-5xl
        font-extrabold

        mb-10

        text-center
      ">
        🔥 Trending Notes
      </h2>

      <div className="

        relative

        w-[95vw]
        md:w-[900px]

        h-[320px]

        overflow-hidden

        rounded-3xl

        bg-white/10
        dark:bg-white/5

        backdrop-blur-xl

        border
        border-white/10

        shadow-2xl
      ">

        <div
          className="

            flex

            transition-all
            duration-700
          "

          style={{

            transform:
              `translateX(-${
                trendingIndex * 100
              }%)`
          }}
        >

          {
            trendingNotes.map(
              (note) => (

                <div
                  key={note.id}

                  className="

                    min-w-full

                    h-[320px]

                    flex
                    flex-col
                    justify-center
                    items-center

                    px-10

                    text-center
                  "
                >

                  <h3 className="

                    text-4xl
                    font-extrabold
                  ">
                    {note.title}
                  </h3>

                  <p className="

                    mt-6

                    text-lg

                    text-white/80

                    max-w-2xl
                  ">
                    {note.description}
                  </p>

                  <button
                    onClick={() =>
                      handleDownload(
                        note.id,
                        note.title
                      )
                    }

                    className="

                      mt-8

                      bg-gradient-to-r
                      from-pink-500
                      to-purple-600

                      px-8
                      py-4

                      rounded-full

                      shadow-2xl

                      hover:scale-105

                      transition-all
                      duration-300
                    "
                  >
                    📥 Download Note
                  </button>

                </div>
              )
            )
          }

        </div>

      </div>

    </div>
  )
}


        {/*  ABOUT SECTION */}

        <div className="max-w-6xl mx-auto px-4 mt-24 mb-14">

          <div
            className="
              grid
              md:grid-cols-2
              gap-8
              items-center
            "
          >

            {/* LEFT */}
            <div
              className="
  bg-white/10
  dark:bg-white/5

  backdrop-blur-xl

  border
  border-white/10
  dark:border-white/5

  rounded-3xl

  p-8

  shadow-2xl

  transition-all
  duration-500
"
            >

              <h2 className="text-4xl font-extrabold mb-5">
                📚 About NoCollege
              </h2>

              <p className="text-white/80 text-lg leading-8">

                NoCollege is a modern student platform
                where learners can upload notes,
                discover study resources,
                connect with students,
                and grow together through knowledge sharing.

              </p>

            </div>

            {/* RIGHT */}
            <div className="grid gap-5">

              <div
                className="
  bg-white/10
  dark:bg-white/5

  backdrop-blur-xl

  rounded-2xl

  p-6

  border
  border-white/10
  dark:border-white/5

  shadow-xl

  transition-all
  duration-500

  hover:scale-105
"
              >

                <h3 className="text-2xl font-bold mb-2">
                  🚀 Fast Sharing
                </h3>

                <p className="text-white/70">
                  Upload and access notes instantly.
                </p>

              </div>

              <div
                className="
  bg-white/10
  dark:bg-white/5

  backdrop-blur-xl

  rounded-2xl

  p-6

  border
  border-white/10
  dark:border-white/5

  shadow-xl

  transition-all
  duration-500

  hover:scale-105
"
              >

                <h3 className="text-2xl font-bold mb-2">
                  👨‍🎓 Student Community
                </h3>

                <p className="text-white/70">
                  Learn together with real students.
                </p>

              </div>

              <div
                className="
  bg-white/10
  dark:bg-white/5

  backdrop-blur-xl

  rounded-2xl

  p-6

  border
  border-white/10
  dark:border-white/5

  shadow-xl

  transition-all
  duration-500

  hover:scale-105
"
              >

                <h3 className="text-2xl font-bold mb-2">
                  🔒 Secure Platform
                </h3>

                <p className="text-white/70">
                  Safe login and personalized profiles.
                </p>

              </div>

            </div>

          </div>

        </div>



      </div>


          {/*  CATEGORIES SECTION */}

<div className="w-full px-6 md:px-16 mt-24 mb-16">

  <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-12 text-center">
    📚 Explore Categories

  </h1>

  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">

    {[
  "Java",
  "Web Dev",
  "DBMS",
  "DSA",
  "Spring Boot",
  "Python"
].map((category, index) => (

  <div
    key={index}
    onClick={() => {

  if (selectedCategory === category) {

    setSelectedCategory("");

  } else {

    setSelectedCategory(category);

  }

}}
    className="
  bg-white/10
  backdrop-blur-lg
  border
  border-white/10
  rounded-3xl
  p-6
  text-center
  shadow-xl
  hover:scale-105
  hover:bg-white/20
  transition
  duration-300
  cursor-pointer
"
  >

    <h2 className="text-xl font-bold">
      {category}
    </h2>

  </div>

))}

  </div>

</div>


      
        {/*  FEEDBACK SECTION */}

        <div className="max-w-5xl mx-auto px-4 mb-20">

          <div
            className="
  bg-white/10
  dark:bg-white/5

  backdrop-blur-xl

  border
  border-white/10
  dark:border-white/5

  rounded-3xl

  p-10

  shadow-2xl

  transition-all
  duration-500
"
          >

            {/* TITLE */}
            <h2
              className="
                text-5xl
                font-extrabold
                text-center
                mb-4
              "
            >
              💬 Feedback
            </h2>

            <p
              className="
                text-center
                text-white/70
                mb-10
                text-lg
              "
            >
              Help us improve NoCollege by sharing
              your thoughts and suggestions.
            </p>

            {/* FORM */}
            <div className="grid md:grid-cols-2 gap-6">

              {/* NAME */}
              <input
              type="text"
              placeholder="Your Name"
              value={feedbackName}
              onChange={(e) =>
                setFeedbackName(e.target.value)
              }
              className="
  p-4

  rounded-2xl

  text-black
  dark:text-white

  bg-white
  dark:bg-black/30

  outline-none

  shadow-xl

  border
  border-white/10
"
            />

              {/* EMAIL */}
              <input
  type="email"
  placeholder="Your Email"
  value={feedbackEmail}
  onChange={(e) =>
    setFeedbackEmail(e.target.value)
  }
  className="
    p-4

    rounded-2xl

    text-black
    dark:text-white

    bg-white
    dark:bg-black/30

    outline-none

    shadow-xl

    border
    border-white/10
  "
/>

            </div>

            {/* TYPE */}
            <select
  value={feedbackType}
  onChange={(e) =>
    setFeedbackType(e.target.value)
  }
  className="
    w-full
    mt-6
    p-4

    rounded-2xl

    text-black
    dark:text-white

    bg-white
    dark:bg-black/30

    outline-none

    shadow-xl

    border
    border-white/10
  "
>

                <option value="">
                  Feedback Type
                </option>

                <option value="Suggestion">
                  Suggestion
                </option>

                <option value="Bug Report">
                  Bug Report
                </option>

                <option value="UI Feedback">
                  UI Feedback
                </option>

                <option value="Feature Request">
                  Feature Request
                </option>

              </select>



            {/* MESSAGE */}
            <textarea
  placeholder="Write your feedback..."
  rows="6"
  value={feedbackMessage}
  onChange={(e) =>
    setFeedbackMessage(e.target.value)
  }
  className="
    w-full
    mt-6
    p-4

    rounded-2xl

    text-black
    dark:text-white

    bg-white
    dark:bg-black/30

    outline-none

    shadow-xl

    resize-none

    border
    border-white/10
  "
/>

            {/* BUTTON */}
            <div className="flex justify-center mt-8">

              <button
                className="
  px-10
  py-4

  rounded-full

  bg-gradient-to-r
  from-pink-500
  to-purple-600

  dark:from-[#111827]
  dark:to-black

  hover:scale-105

  transition-all
  duration-300

  shadow-2xl

  dark:shadow-pink-500/20

  border
  border-white/10

  font-bold
  text-lg

  text-white
"

                onClick={handleFeedbackSubmit}

              >
                Send Feedback 🚀
              </button>

            </div>

          </div>

        </div>


        {/* ⭐ WEBSITE RATING */}

<div className="
  flex
  flex-col
  items-center
  justify-center
  mt-20
  mb-20
">

  <h2 className="
    text-4xl
    font-bold
    text-white
    mb-4
  ">
    ⭐ Rate NoCollege
  </h2>

  <p className="
    text-pink-100
    text-lg
    mb-6
  ">
    Help others by rating this platform 😎
  </p>

  {/* STARS */}

  <div className="
    flex
    gap-3
    mb-6
  ">

    {[1, 2, 3, 4, 5].map((star) => (

      <button
        key={star}
        onClick={() => handleRating(star)}
        className={`
          text-5xl
          transition
          duration-300
          hover:scale-125

          ${
            star <= selectedRating
              ? "text-yellow-300"
              : "text-white/40"
          }
        `}
      >
        ★
      </button>

    ))}

  </div>

  {/* STATS */}

  <div className="
  bg-white/10
  dark:bg-white/5

  backdrop-blur-lg

  border
  border-white/10
  dark:border-white/5

  rounded-3xl

  px-10
  py-6

  shadow-2xl

  text-center

  transition-all
  duration-500
">

    <h3 className="
      text-5xl
      font-bold
      text-yellow-300
      mb-2
    ">
      {averageRating} ⭐
    </h3>

    <p className="
      text-pink-100
      text-lg
    ">
      Based on {totalRatings} ratings
    </p>

  </div>

</div>


        


        {/*  WEBSITE STATS */}

        <div className="max-w-6xl mx-auto px-4 mb-16">

          <div
            className="
              grid
              grid-cols-2
              md:grid-cols-4
              gap-6
            "
          >

            {/* NOTES */}
            <div
              className="
  bg-white/10
  dark:bg-white/5

  backdrop-blur-xl

  border
  border-white/10
  dark:border-white/5

  rounded-3xl

  p-8

  text-center

  shadow-2xl

  transition-all
  duration-500

  hover:scale-105
"
            >

              <h2 className="text-5xl font-extrabold text-white">
                {notes.length}+
              </h2>

              <p className="mt-3 text-white/80 text-lg">
                📄 Notes
              </p>

            </div>

            {/* LIKES */}
            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-8
                text-center
                shadow-2xl
              "
            >

              <h2 className="text-5xl font-extrabold text-white">

                {Object.values(likes).reduce((a, b) => a + b, 0)}+

              </h2>

              <p className="mt-3 text-white/80 text-lg">
                ❤️ Likes
              </p>

            </div>

            {/* COMMENTS */}
            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-8
                text-center
                shadow-2xl
              "
            >

              <h2 className="text-5xl font-extrabold text-white">

                {
                  Object.values(comments)
                    .reduce((a, b) => a + b.length, 0)
                }+

              </h2>

              <p className="mt-3 text-white/80 text-lg">
                💬 Comments
              </p>

            </div>

            {/* USERS */}
            <div
              className="
                bg-white/10
                backdrop-blur-xl
                border
                border-white/10
                rounded-3xl
                p-8
                text-center
                shadow-2xl
              "
            >

              <h2 className="text-5xl font-extrabold text-white">
                {totalUsers}+
              </h2>

              <p className="mt-3 text-white/80 text-lg">
                👨‍🎓 Students
              </p>

            </div>

          </div>

        </div>

      <Footer />

      <AiChatBot />

    </div>

    {showRatingMessage && (

      <div className="
  fixed
  top-6
  right-6

  z-50

  bg-gradient-to-r
  from-pink-500
  to-purple-600

  dark:from-[#111827]
  dark:to-black

  text-white

  px-6
  py-4

  rounded-2xl

  shadow-2xl

  animate-bounce

  border
  border-white/10
">

        <h2 className="font-bold text-lg">
          ⭐ Thank You!
        </h2>

        <p className="text-sm mt-1">
          We truly appreciate your support 💛
        </p>

        

      </div>

    )}

</>
  );
}