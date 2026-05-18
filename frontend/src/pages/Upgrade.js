import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import API from "../services/api";

export default function Upgrade() {

    const [user, setUser] = useState(null);


const handlePayment = async (

  amount,
  planName

) => {

  try {

    // CREATE ORDER FROM BACKEND

    const orderRes =
      await API.post(

        `/payment/create-order?amount=${amount}`
      );

    const orderData = orderRes.data;

    const options = {

      key:
        "rzp_test_SR3xvwe3pu7GXU",

      amount:
        orderData.amount,

      currency:
        orderData.currency,

      name:
        "NoCollege",

      description:
        `${planName} Subscription`,

      image:
        "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",

      order_id:
        orderData.id,

      prefill: {

        name:
          localStorage.getItem(
            "userName"
          ),

        email:
          localStorage.getItem(
            "userEmail"
          ),

        contact:
          "9876543210"
      },

handler:
  async function (
    response
  ) {

    try {

      // ACTIVATE PLAN

      await API.post(

        `/payment/activate-plan?plan=${planName}`
      );

      alert(

        `${planName} Activated ✅`
      );

      window.location.reload();

    } catch (err) {

      console.log(err);

      alert(
        "Plan activation failed ❌"
      );
    }
  },

      theme: {
        color: "#ec4899"
      }
    };

    const razor =
      new window.Razorpay(
        options
      );

    razor.open();

  } catch (err) {

    console.log(err);

    alert(
      "Payment failed ❌"
    );
  }
};




const fetchUser = async () => {

  try {

    const email =
      localStorage.getItem(
        "userEmail"
      );

    const res =
      await API.get(
        `/user/profile/${email}`
      );

    setUser(res.data.user);

  } catch (err) {

    console.log(err);
  }
};

const cancelPlan = async () => {

  try {

    await API.post(
      "/payment/cancel-plan"
    );

    alert(
      "Plan Cancelled ❌"
    );

    window.location.reload();

  } catch (err) {

    alert(
      "Failed to cancel ❌"
    );
  }
};






useEffect(() => {

  fetchUser();

}, []);  





  const plans = [

    {
      name: "Free",
      price: "₹0",
      features: [
        "Basic uploads",
        "Community access",
        "Limited features"
      ],
      button: "Current Plan",
      disabled: true
    },

    {
      name: "Pro",
      price: "₹99/month",
      features: [
        "Unlimited uploads",
        "Priority support",
        "Premium badge",
        "Advanced features"
      ],
      button: "Upgrade to Pro",
      premium: true
    },

    {
      name: "Premium",
      price: "₹299/month",
      features: [
        "Everything in Pro",
        "AI features",
        "Private notes",
        "Future premium tools"
      ],
      button: "Go Premium",
      ultra: true
    }

    
  ];

  return (

    <div className="

      min-h-screen

      bg-gradient-to-r
      from-purple-600
      via-pink-500
      to-purple-700

      dark:from-[#020617]
      dark:via-[#0f172a]
      dark:to-black

      text-white
    ">

      <Navbar />

      <div className="

        max-w-7xl
        mx-auto

        px-6
        py-16
      ">

        <h1 className="

          text-6xl
          font-extrabold
          text-center

          mb-6
        ">
          👑 Upgrade Your Experience
        </h1>

        <p className="

          text-center
          text-white/80

          text-xl

          mb-16
        ">
          Unlock premium features and support the platform 🚀
        </p>

        <div className="

          grid

          md:grid-cols-3

          gap-10
        ">

          {plans.map((plan, index) => (

            <div

              key={index}

              className={`

                relative

                rounded-3xl

                p-8

                backdrop-blur-2xl

                border

                shadow-2xl

                transition-all
                duration-300

                hover:scale-105

                ${
                  plan.premium

                    ? "bg-yellow-500/20 border-yellow-300"

                    : plan.ultra

                    ? "bg-pink-500/20 border-pink-300"

                    : "bg-white/10 border-white/20"
                }
              `}
            >

              {

                plan.premium && (

                  <div className="

                    absolute
                    -top-4
                    right-5

                    bg-yellow-400

                    text-black

                    px-4
                    py-1

                    rounded-full

                    font-bold
                    text-sm
                  ">
                    MOST POPULAR
                  </div>
                )
              }

              <h2 className="

                text-4xl
                font-extrabold

                mb-4
              ">
                {plan.name}
              </h2>

              <p className="

                text-5xl
                font-bold

                mb-8
              ">
                {plan.price}
              </p>

              <ul className="space-y-4 mb-10">

                {plan.features.map((feature, i) => (

                  <li
                    key={i}

                    className="

                      text-lg
                      text-white/90
                    "
                  >
                    ✅ {feature}
                  </li>
                ))}
              </ul>

{

  plan.name === "Pro"

  &&

  user?.plan?.toUpperCase() === "PRO"

  ? (

    <button

      onClick={cancelPlan}

      className="

        w-full

        py-4

        rounded-2xl

        font-bold

        text-lg

        bg-red-500

        hover:bg-red-600
      "
    >
      Cancel Pro
    </button>

  )

  :

  plan.name === "Premium"

  &&

  user?.plan?.toUpperCase() === "PREMIUM"

  ? (

    <button

      onClick={cancelPlan}

      className="

        w-full

        py-4

        rounded-2xl

        font-bold

        text-lg

        bg-red-500

        hover:bg-red-600
      "
    >
      Cancel Premium
    </button>

  )

  :

  (

    <button

      disabled={plan.disabled}

      onClick={() => {

        if (plan.name === "Pro") {

          handlePayment(
            99,
            "Pro"
          );
        }

        if (
          plan.name === "Premium"
        ) {

          handlePayment(
            299,
            "Premium"
          );
        }
      }}

      className={`

        w-full

        py-4

        rounded-2xl

        font-bold

        text-lg

        transition-all
        duration-300

        ${
          plan.disabled

            ? "bg-white/20 cursor-not-allowed"

            : plan.premium

            ? "bg-yellow-400 text-black hover:scale-105"

            : "bg-pink-500 hover:bg-pink-600"
        }
      `}
    >
      {plan.button}
    </button>
  )
}

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}