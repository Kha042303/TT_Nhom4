import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../../socket";
import { useNavigate } from "react-router-dom";

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

const ChatPage: React.FC<ChatProps> = (props) => {
  const { user, token } = props;
  const navigate = useNavigate();
  useEffect(() => {
    if (!user || !token) {
      navigate("/signin");
    }
  }, [user, token]);
  if (!user || !token) return null;
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    socket.auth = { token };
    socket.connect();

    socket.on("connect", () => {
      console.log("SOCKET CONNECTED");
      socket.emit("addUser", user.user_id);
    });

    return () => {
      socket.disconnect();
      socket.off("connect");
    };
  }, [token, user.user_id]);
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

    return () => {
      socket.off("receiverMessage", receiveMessage);
    };
  }, [selectedUser, user.user_id]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/user/list", {
        headers: { "auth-token": token },
      })
      .then((res) => {
        console.log("USER LIST:", res.data);
        setUsers(res.data.data || []);
      })
      .catch((err) => console.error("LOAD USERS ERROR:", err));
  }, [token]);
  useEffect(() => {
    if (!selectedUser) return;

    axios
      .get(`http://localhost:3000/api/v1/chat/${selectedUser.user_id}`, {
        headers: { "auth-token": token },
      })
      .then((res) => {
        console.log("CHAT HISTORY:", res.data);
        setMessages(res.data.data || []);
      })
      .catch((err) => console.error("LOAD CHAT HISTORY ERROR:", err));
  }, [selectedUser, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim() || !selectedUser) return;

    const text = newMessage;
    setNewMessage("");

    const localMsg: MessageType = {
      sender_id: user.user_id,
      receiver_id: selectedUser.user_id,
      message: text,
    };

    setMessages((prev) => [...prev, localMsg]);

    axios.post(
      "http://localhost:3000/api/v1/chat/send",
      { receiver_id: selectedUser.user_id, message: text },
      { headers: { "auth-token": token } }
    );
    socket.emit("sendMessage", {
      sender_id: user.user_id,
      receiver_id: selectedUser.user_id,
      message: text,
    });
  };

  return (
    <div className="flex h-screen">
      {/* LEFT SIDEBAR */}
      <div className="w-1/4 p-4 bg-gray-100 border-r">
        <h2 className="font-bold text-lg mb-4">Users</h2>

        {users.map((u) => (
          <div
            key={u.user_id}
            onClick={() => setSelectedUser(u)}
            className={`p-3 rounded cursor-pointer mb-2 ${
              selectedUser?.user_id === u.user_id
                ? "bg-blue-500 text-white"
                : "bg-white"
            }`}
          >
            {u.full_name}
          </div>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="w-3/4 p-4 flex flex-col">
        {selectedUser && (
          <h2 className="bg-white p-3 rounded shadow mb-3 font-semibold">
            Chat with: {selectedUser.full_name}
          </h2>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col gap-2">
          {messages.map((m, i) => {
            const isMe = m.sender_id === user.user_id;

            return (
              <div
                key={i}
                className={`max-w-[60%] p-3 rounded-xl shadow text-sm ${
                  isMe
                    ? "self-end bg-blue-500 text-white rounded-br-none"
                    : "self-start bg-white rounded-bl-none"
                }`}
              >
                {m.message}
              </div>
            );
          })}

          <div ref={bottomRef}></div>
        </div>

        {selectedUser && (
          <div className="mt-3 flex">
            <input
              className="flex-1 border rounded-xl p-3"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button
              onClick={handleSend}
              className="ml-2 px-5 bg-blue-600 text-white rounded-xl"
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
