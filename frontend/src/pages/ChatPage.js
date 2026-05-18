import {

  useEffect,
  useState

} from "react";

import {

  useParams

} from "react-router-dom";

import SockJS from "sockjs-client";

import {

  Client

} from "@stomp/stompjs";

import API from "../services/api";

import Navbar from "../components/Navbar";

export default function ChatPage() {

  const { email } = useParams();

  const currentUser =
    localStorage.getItem(
      "userEmail"
    );

  const [messages, setMessages] =
    useState([]);

  const [message, setMessage] =
    useState("");

    const [activeMenu, setActiveMenu] =
  useState(null);

const [editingId, setEditingId] =
  useState(null);

const [editedText, setEditedText] =
  useState("");

  const [stompClient, setStompClient] =
    useState(null);

    const [chatUser, setChatUser] =
  useState(null);

  // FETCH OLD CHAT

  const fetchChat =
    async () => {

      try {

        const res =
          await API.get(

            `/chat/history?user1=${currentUser}&user2=${email}`
          );

        setMessages(res.data);

        await API.post(

  `/chat/mark-seen?senderEmail=${email}&receiverEmail=${currentUser}`
);

      } catch (err) {

        console.log(err);
      }
  };




  const fetchChatUser =
  async () => {

    try {

      const res =
        await API.get(

          `/user/profile/${email}`
        );

      setChatUser(
        res.data.user
      );

    } catch (err) {

      console.log(err);
    }
};




  // WEBSOCKET CONNECT

  useEffect(() => {

    fetchChat();

    fetchChatUser();

    const socket =
      new SockJS(`${import.meta.env.VITE_API_URL}/chat`);

    const client =
      new Client({

        webSocketFactory:
          () => socket,

        reconnectDelay: 5000,

        onConnect: () => {

          client.subscribe(

            `/topic/messages/${currentUser}`,

            (msg) => {

              const newMessage =
                JSON.parse(msg.body);

              setMessages((prev) => [

                ...prev,
                newMessage
              ]);
            }
          );
        }
      });

    client.activate();

    setStompClient(client);

    return () => {

      client.deactivate();
    };

  }, []);

  // SEND MESSAGE

  const sendMessage = () => {

    if (
      !message.trim()
    ) return;

    const chatMessage = {

      senderEmail:
        currentUser,

      receiverEmail:
        email,

      content:
        message
    };

    stompClient.publish({

      destination:
        "/app/sendMessage",

      body:
        JSON.stringify(chatMessage)
    });

    // setMessages((prev) => [

    //   ...prev,
    //   chatMessage
    // ]);

    setMessage("");
  };


  const deleteMessage =
  async (id) => {

    try {

      await API.delete(

        `/chat/delete/${id}`
      );

      setMessages((prev) =>

        prev.filter(
          (msg) => msg.id !== id
        )
      );

    } catch (err) {

      console.log(err);
    }
};


const editMessage =
  async (id) => {

    try {

      const res =
        await API.put(

          `/chat/edit/${id}?content=${editedText}`
        );

      setMessages((prev) =>

        prev.map((msg) =>

          msg.id === id

            ? res.data

            : msg
        )
      );

      setEditingId(null);

      setEditedText("");

    } catch (err) {

      console.log(err);
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

      <div className="
        max-w-5xl
        mx-auto

        mt-10

        p-6
      ">

        {/* HEADER */}

        <div className="
          bg-white/10
          dark:bg-white/5

          backdrop-blur-xl

          rounded-3xl

          p-5

          shadow-2xl

          mb-6
        ">

<div className="
  flex
  items-center
  gap-4
">

  <img

    src={

      chatUser?.profileImage

        ? `${import.meta.env.VITE_API_URL}/${chatUser.profileImage}`

        : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
    }

    alt="profile"

    className="
      w-16
      h-16

      rounded-full

      object-cover

      border-2
      border-white
    "
  />

  <div>

    <h1 className="
      text-3xl
      font-bold
    ">

      {

        chatUser?.fullName ||

        email.split("@")[0]
      }

    </h1>

    <p className="
      text-white/70
    ">

      {email}

    </p>

  </div>

</div>

        </div>

        {/* CHAT BOX */}

        <div className="
          bg-white/10
          dark:bg-white/5

          backdrop-blur-xl

          rounded-3xl

          shadow-2xl

          h-[70vh]

          flex
          flex-col
        ">

          {/* MESSAGES */}

          <div className="
            flex-1

            overflow-y-auto

            p-6

            space-y-4
          ">

            {
              messages.map(
                (msg, index) => (

                  <div
                    key={index}

                    className={`

                      flex

                      ${
                        msg.senderEmail === currentUser

                          ? "justify-end"

                          : "justify-start"
                      }
                    `}
                  >

                    <div className={`

                      max-w-[70%]

                      px-5
                      py-3

                      rounded-3xl

                      shadow-xl

                      break-words

                      ${
                        msg.senderEmail === currentUser

                          ? `
                            bg-pink-500
                          `

                          : `
                            bg-white/20
                          `
                      }
                    `}>

                     <div className="
  flex
  items-start
  gap-3
">

  {/* MESSAGE */}

  <div>

    {

      editingId === msg.id

      ? (

        <div className="
          flex
          gap-2
        ">

          <input

            value={editedText}

            onChange={(e) =>

              setEditedText(
                e.target.value
              )
            }

            className="
              px-3
              py-2

              rounded-xl

              text-black

              outline-none
            "
          />

          <button

            onClick={() =>

              editMessage(
                msg.id
              )
            }

            className="
              bg-green-500

              px-3
              py-2

              rounded-xl
            "
          >
            Save
          </button>

        </div>

      )

      : (

        <p>
          {msg.content}
        </p>
      )
    }

  </div>

  {/* OWN MESSAGE MENU */}

  {

    msg.senderEmail === currentUser && (

      <div className="
        relative
      ">

        <button

          onClick={() =>

            setActiveMenu(

              activeMenu === msg.id

                ? null

                : msg.id
            )
          }

          className="
            text-xl

            hover:text-pink-300
          "
        >
          ⋮
        </button>

        {

          activeMenu === msg.id && (

            <div className="
              absolute

              right-0
              top-8

              bg-white
              text-black

              rounded-2xl

              shadow-2xl

              overflow-hidden

              z-50
            ">

              <button

                onClick={() => {

                  setEditingId(
                    msg.id
                  );

                  setEditedText(
                    msg.content
                  );

                  setActiveMenu(
                    null
                  );
                }}

                className="
                  block
                  w-full

                  px-5
                  py-3

                  text-left

                  hover:bg-gray-200
                "
              >
                ✏ Edit
              </button>

              <button

                onClick={() =>

                  deleteMessage(
                    msg.id
                  )
                }

                className="
                  block
                  w-full

                  px-5
                  py-3

                  text-left

                  hover:bg-gray-200

                  text-red-500
                "
              >
                🗑 Delete
              </button>

            </div>
          )
        }

      </div>
    )
  }

</div>

                    </div>

                  </div>
                )
              )
            }

          </div>

          {/* INPUT */}

          <div className="
            p-5

            border-t
            border-white/10

            flex
            gap-4
          ">

            <input
              type="text"

              placeholder="Type message..."

              value={message}

              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }

              onKeyDown={(e) => {

                if (
                  e.key === "Enter"
                ) {

                  sendMessage();
                }
              }}

              className="
                flex-1

                p-4

                rounded-2xl

                text-black
                dark:text-white

                bg-white
                dark:bg-black/30

                outline-none
              "
            />

            <button
              onClick={sendMessage}

              className="
                px-8
                py-4

                rounded-2xl

                bg-pink-500

                hover:bg-pink-600

                shadow-2xl

                transition-all
                duration-300
              "
            >
              Send 🚀
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}