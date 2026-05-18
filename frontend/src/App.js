import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Upload from "./pages/Upload";
import MyUploads from "./pages/MyUploads";
import Feedback from "./pages/Feedback";
import AdminAdvancedFeedback from "./pages/AdminAdvancedFeedback";
import Downloads from "./pages/Downloads";
import AdminFeedback from "./pages/AdminFeedback";
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Bookmarks from "./pages/Bookmark";
import Notifications from "./pages/Notifications";
import { useEffect, useState } from "react";
import ChatPage from "./pages/ChatPage";
import ChatsPage from "./pages/ChatsPage";
import Upgrade from "./pages/Upgrade";
import AdminReports from "./pages/AdminReports";

function App() {
  const token = localStorage.getItem("token");

  const [darkMode, setDarkMode] = useState(

  localStorage.getItem("theme") === "dark"

);

useEffect(() => {

  if (darkMode) {

    document.documentElement.classList.add("dark");

    localStorage.setItem("theme", "dark");

  } else {

    document.documentElement.classList.remove("dark");

    localStorage.setItem("theme", "light");
  }

}, [darkMode]);

  return (
    <BrowserRouter>

  <div className="
    min-h-screen
    transition-all
    duration-500
    bg-gradient-to-r
    from-purple-600
    to-pink-500

    dark:from-[#0f172a]
    dark:via-[#111827]
    dark:to-black
  ">
      <Routes>

        {/* DEFAULT */}
        <Route
          path="/"
          element={token ? <Home /> : <Register />}
        />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* PROTECTED ROUTES */}
        <Route path="/home" element={token ? <Home /> : <Navigate to="/login" />} />
        <Route path="/upload" element={token ? <Upload /> : <Navigate to="/login" />} />
        <Route path="/my-uploads" element={token ? <MyUploads /> : <Navigate to="/login" />} />
        <Route path="/feedback" element={token ? <Feedback /> : <Navigate to="/login" />} />
        <Route path="/downloads" element={token ? <Downloads /> : <Navigate to="/login" />} />
        <Route path="/admin-feedback" element={token ? <AdminFeedback /> : <Navigate to="/login" />} />
        <Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/user/:email" element={token ? <UserProfile /> : <Navigate to="/login" />} />

        <Route
            path="/admin-advanced-feedback"
            element={<AdminAdvancedFeedback />}
          />

          <Route
          path="/notifications"
          element={
            token
              ? <Notifications />
              : <Navigate to="/login" />
          }
        />

        <Route
          path="/bookmarks"
          element={
            token
              ? <Bookmarks />
              : <Navigate to="/login" />
          }
        />

        <Route
            path="/chat/:email"
            element={
              token
                ? <ChatPage />
                : <Navigate to="/login" />
            }
          />

          <Route
          path="/chats"
          element={
            token
              ? <ChatsPage />
              : <Navigate to="/login" />
          }
        />


        <Route
  path="/upgrade"
  element={<Upgrade />}
/>


            <Route
              path="/admin-reports"
              element={<AdminReports />}
            />

      </Routes>
      </div>
      
    </BrowserRouter>
    
  );
}

export default App;