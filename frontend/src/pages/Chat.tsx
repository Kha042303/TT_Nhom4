import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

/* ============================== */
/*      Avatar Generator          */
/* ============================== */

function getInitials(name: string) {
  if (!name) return "?";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (
    parts[0][0].toUpperCase() +
    parts[parts.length - 1][0].toUpperCase()
  );
}

function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 75%, 65%)`;
}

const Avatar = ({ name, size = 40 }: { name: string; size?: number }) => (
  <div
    className="rounded-full flex items-center justify-center text-white font-bold"
    style={{
      width: size,
      height: size,
      backgroundColor: stringToColor(name),
      fontSize: size * 0.35,
    }}
  >
    {getInitials(name)}
  </div>
);

/* ============================== */
/*        Type Definitions        */
/* ============================== */

interface UserType {
  user_id: number;
  full_name: string;
}

interface MessageType {
  sender_id: number;
  receiver_id: number;
  message: string;
}

interface ChatProps {
  user: UserType;
  token: string;
}

/* ============================== */
/*        MAIN COMPONENT          */
/* ============================== */

const ChatPage: React.FC<ChatProps> = ({ user, token }) => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);

  /* ---------------- Check Login ---------------- */
  useEffect(() => {
    if (!user || !token) navigate("/signin");
  }, [user, token]);

  if (!user || !token) return null;

  /* ---------------- Socket Connect ---------------- */
  useEffect(() => {
    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => socket.emit("addUser", user.user_id));

    return () => {
      socket.disconnect();
      socket.off("connect");
    };
  }, []);

  /* ---------------- Realtime Messages ---------------- */
  //@ts-ignore
  useEffect(() => {
    const receiveMessage = (msg: MessageType) => {
      if (!selectedUser) return;

      if (
        msg.sender_id === selectedUser.user_id &&
        msg.receiver_id === user.user_id
      ) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiverMessage", receiveMessage);
    return () => socket.off("receiverMessage", receiveMessage);
  }, [selectedUser]);

  /* ---------------- Load User List ---------------- */
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/list", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.data || []))
      .catch(console.error);
  }, []);

  /* ---------------- Load Chat History ---------------- */
  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get(`http://localhost:3000/api/v1/chat/${selectedUser.user_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setMessages(res.data.data || []))
      .catch(console.error);
  }, [selectedUser]);

  /* ---------------- Auto Scroll ---------------- */
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ---------------- Send Message ---------------- */
  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const text = newMessage.trim();
    setNewMessage("");

    const localMsg = {
      sender_id: user.user_id,
      receiver_id: selectedUser.user_id,
      message: text,
    };

    setMessages((prev) => [...prev, localMsg]);

    axios.post(
      "http://localhost:3000/api/v1/chat/send",
      { receiver_id: selectedUser.user_id, message: text },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    socket.emit("sendMessage", localMsg);
  };

  /* ============================== */
  /*            UI RENDER           */
  /* ============================== */

  return (
    <div className="flex h-screen bg-[#f5f7fb]">

      {/* ---------------- Sidebar ---------------- */}
      <div className="w-[320px] bg-white border-r flex flex-col">

        {/* Search */}
        <div className="p-4 border-b">
          <input
            placeholder="Search…"
            className="w-full p-2 rounded-xl bg-gray-100"
          />
        </div>

        {/* User List */}
        <div className="overflow-y-auto flex-1">
          {users.map((u) => (
            <div
              key={u.user_id}
              onClick={() => setSelectedUser(u)}
              className={`p-4 flex items-center gap-3 cursor-pointer ${
                selectedUser?.user_id === u.user_id
                  ? "bg-blue-100"
                  : "hover:bg-gray-100"
              }`}
            >
              <Avatar name={u.full_name} />

              <div className="flex-1">
                <div className="font-semibold">{u.full_name}</div>
                <div className="text-sm text-gray-500">Nhấn để chat</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------- Chat Area ---------------- */}
      <div className="flex-1 flex flex-col">

        {/* TOP BAR */}
        {selectedUser && (
          <div className="p-4 bg-white border-b flex items-center gap-3">
            <Avatar name={selectedUser.full_name} />
            <div>
              <div className="font-semibold">{selectedUser.full_name}</div>
              <div className="text-green-500 text-sm">Online</div>
            </div>
          </div>
        )}

        {/* MESSAGE LIST */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">

          {messages.map((m, index) => {
            const isMe = m.sender_id === user.user_id;

            return (
              <div
                key={index}
                className={`flex items-end gap-2 ${
                  isMe ? "justify-end" : ""
                }`}
              >
                {!isMe && (
                  <Avatar name={selectedUser?.full_name || ""} size={32} />
                )}

                <div
                  className={`p-3 rounded-xl max-w-[60%] shadow text-sm ${
                    isMe
                      ? "bg-blue-600 text-white rounded-br-none"
                      : "bg-white rounded-bl-none"
                  }`}
                >
                  {m.message}
                </div>

                {isMe && <Avatar name={user.full_name} size={32} />}
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        {/* INPUT BAR */}
        {selectedUser && (
          <div className="p-4 bg-white border-t flex items-center gap-3">
            <input
              placeholder="Aa…"
              className="flex-1 p-3 bg-gray-100 rounded-full outline-none"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />

            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-6 py-2 rounded-full"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
