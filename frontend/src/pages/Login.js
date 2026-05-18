import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  // already logged in user ko redirect karo
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (token) {
//       navigate("/");
//     }
//   }, [navigate]);

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", { email, password });

            //  token save
            localStorage.setItem("token", res.data.token);
      localStorage.setItem("userEmail", email);

      //  FETCH PROFILE AFTER LOGIN
      const profileRes = await API.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${res.data.token}`
        }
      });

      // SAVE PROFILE IMAGE
      if (profileRes.data.user.profileImage) {

        localStorage.setItem(
          "profileImage",
          profileRes.data.user.profileImage
        );
      }
      window.location.href="/home";

      alert("Login Successful 🔥");

      // React navigation (BEST WAY)
       navigate("/home");
    //window.location.href="/home";
    } catch (err) {
      alert("Login Failed ❌");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-r from-purple-600 to-pink-500">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          className="w-full p-2 border mb-3 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 border mb-3 rounded"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}