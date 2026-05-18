import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Register() {

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [otp, setOtp] =
    useState("");

  const [otpSent, setOtpSent] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();

  // SEND OTP

  const handleSendOtp = async () => {

    if (!name || !email || !password) {

      alert("Please fill all fields ❌");

      return;
    }

    try {

      setLoading(true);

      await API.post("/auth/send-otp", {

        name,
        email,
        password

      });

      setOtpSent(true);

      alert("OTP sent to your email 📩");

    } catch (err) {

      console.log(err);

      alert("Failed to send OTP ❌");
    }

    setLoading(false);
  };

  // VERIFY OTP

  const handleVerifyOtp = async () => {

    if (!otp) {

      alert("Please enter OTP ❌");

      return;
    }

    try {

      setLoading(true);

      await API.post("/auth/verify-otp", {

        name,
        email,
        password,
        otp

      });

      alert("Registration successful 🎉");

      navigate("/login");

    } catch (err) {

      console.log(err);

      alert("Invalid OTP ❌");
    }

    setLoading(false);
  };

  return (

    <div className="
      h-screen
      flex
      items-center
      justify-center
      bg-gradient-to-r
      from-purple-600
      to-pink-500
    ">

      <div className="
        bg-white
        p-8
        rounded-2xl
        shadow-xl
        w-80
      ">

        <h2 className="
          text-2xl
          font-bold
          mb-4
          text-center
        ">
          Register
        </h2>

        {/* NAME */}

        <input
          className="
            w-full
            p-2
            border
            mb-3
            rounded
          "
          placeholder="Name"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
        />

        {/* EMAIL */}

        <input
          className="
            w-full
            p-2
            border
            mb-3
            rounded
          "
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {/* PASSWORD */}

        <input
          type="password"
          className="
            w-full
            p-2
            border
            mb-3
            rounded
          "
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {/* OTP FIELD */}

        {otpSent && (

          <input
            className="
              w-full
              p-2
              border
              mb-3
              rounded
            "
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
          />

        )}

        {/* BUTTON */}

        {!otpSent ? (

          <button
            onClick={handleSendOtp}
            disabled={loading}
            className="
              w-full
              bg-purple-600
              text-white
              p-2
              rounded
              hover:bg-purple-700
            "
          >

            {
              loading
                ? "Sending OTP..."
                : "Send OTP"
            }

          </button>

        ) : (

          <button
            onClick={handleVerifyOtp}
            disabled={loading}
            className="
              w-full
              bg-green-600
              text-white
              p-2
              rounded
              hover:bg-green-700
            "
          >

            {
              loading
                ? "Verifying..."
                : "Verify OTP"
            }

          </button>

        )}

        <p
          onClick={() =>
            navigate("/login")
          }
          className="
            text-sm
            text-center
            mt-3
            cursor-pointer
            text-blue-500
          "
        >

          Already have an account? Login

        </p>

      </div>

    </div>
  );
}