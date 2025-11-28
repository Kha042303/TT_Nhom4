import React, { useState } from "react";

// ------------------------------------------------------
// NAVIGATION DEMO
// ------------------------------------------------------
const PAGES = {
  HOME: "home",
  LOGIN: "login",
  REGISTER: "register",
  CHAT: "chat",
};

// ------------------------------------------------------
// APP ROOT
// ------------------------------------------------------
export default function App() {
  const [page, setPage] = useState(PAGES.HOME);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header setPage={setPage} />

      {page === PAGES.HOME && <HomePage />}
      {page === PAGES.LOGIN && <LoginPage setPage={setPage} />}
      {page === PAGES.REGISTER && <RegisterPage setPage={setPage} />}
      {page === PAGES.CHAT && <ChatBox />}

      <Footer />
    </div>
  );
}

// ------------------------------------------------------
// HEADER
// ------------------------------------------------------
function Header({ setPage }) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-indigo-600 cursor-pointer"
            onClick={() => setPage(PAGES.HOME)}>
          BookStore
        </h1>

        <nav className="flex gap-4 text-sm">
          <button onClick={() => setPage(PAGES.HOME)}>Trang chủ</button>
          <button onClick={() => setPage(PAGES.LOGIN)}>Đăng nhập</button>
          <button onClick={() => setPage(PAGES.REGISTER)}>Đăng ký</button>
          <button onClick={() => setPage(PAGES.CHAT)}>Chat người dùng</button>
        </nav>
      </div>
    </header>
  );
}

// ------------------------------------------------------
// HOME PAGE (BOOK DEMO)
// ------------------------------------------------------
function HomePage() {
  const fakeBooks = [
    { id: 1, title: "Sách A", price: 60000 },
    { id: 2, title: "Sách B", price: 90000 },
    { id: 3, title: "Sách C", price: 120000 },
    { id: 4, title: "Sách D", price: 150000 },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-xl font-semibold mb-4">Danh sách sách (Demo)</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {fakeBooks.map((book) => (
          <div key={book.id} className="bg-white shadow rounded p-3">
            <div className="bg-gray-200 h-32 mb-3 rounded"></div>
            <h3 className="font-semibold">{book.title}</h3>
            <p className="text-indigo-600 font-bold">
              {book.price.toLocaleString()} đ
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------
// LOGIN PAGE
// ------------------------------------------------------
function LoginPage({ setPage }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">Đăng nhập</h2>

        <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Email" />
        <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Mật khẩu" type="password" />

        <button className="w-full py-2 bg-indigo-600 text-white rounded-lg">
          Đăng nhập
        </button>

        <p className="text-sm mt-3 text-center">
          Chưa có tài khoản?
          <span className="text-indigo-600 cursor-pointer ml-1"
                onClick={() => setPage(PAGES.REGISTER)}>
            Đăng ký
          </span>
        </p>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// REGISTER PAGE
// ------------------------------------------------------
function RegisterPage({ setPage }) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-sm">
        <h2 className="text-xl font-bold text-center mb-4">Tạo tài khoản</h2>

        <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Tên" />
        <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Email" />
        <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Mật khẩu" type="password" />

        <button className="w-full py-2 bg-indigo-600 text-white rounded-lg">
          Đăng ký
        </button>

        <p className="text-sm mt-3 text-center">
          Đã có tài khoản?
          <span className="text-indigo-600 cursor-pointer ml-1"
                onClick={() => setPage(PAGES.LOGIN)}>
            Đăng nhập
          </span>
        </p>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// CHAT DEMO (FRONTEND ONLY)
// ------------------------------------------------------
function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, user: "admin", text: "Xin chào, bạn cần hỗ trợ gì?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;

    setMessages([...messages, { id: Date.now(), user: "you", text: input }]);
    setInput("");
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white rounded shadow-lg overflow-hidden">
      <div className="bg-indigo-600 text-white px-4 py-2">Chat người dùng</div>

      <div className="h-80 overflow-y-auto p-3 flex flex-col gap-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-3 py-2 rounded-lg shadow max-w-[75%] ${
              msg.user === "you"
                ? "self-end bg-indigo-600 text-white"
                : "self-start bg-white"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      <div className="flex border-t p-2">
        <input
          className="flex-1 px-2 py-1 border rounded mr-2"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="bg-indigo-600 text-white px-4 rounded" onClick={sendMessage}>
          Gửi
        </button>
      </div>
    </div>
  );
}

// ------------------------------------------------------
// FOOTER
// ------------------------------------------------------
function Footer() {
  return (
    <footer className="text-center text-gray-500 text-sm py-4">
      © 2025 BookStore — React Demo UI
    </footer>
  );
}
