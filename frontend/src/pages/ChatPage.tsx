import React, { useMemo, useState } from "react";
import Header from "../components/layout/Header";
import { useAuth } from "../context/AuthContext";

import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";
import ChatMessages from "../components/chat/ChatMessages";
import ChatComposer from "../components/chat/ChatComposer";

import type { Contact, Message } from "../components/chat/chat.type";

export default function ChatPage() {
  const { user, loading } = useAuth();

  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");

  // Demo data (UI-only)
  const contacts: Contact[] = useMemo(
    () => [
      {
        id: 1,
        name: "Minh Anh",
        avatar:
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=200&auto=format&fit=crop&q=60",
        lastMessage: "Bạn có muốn đổi lấy cuốn Thói Quen Nguy...",
        time: "2p",
        unread: true,
        active: true,
      },
      {
        id: 2,
        name: "Trần Hùng",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=60",
        lastMessage: "Sách này bìa cứng hay mềm vậy bạn?",
        time: "1h",
      },
      {
        id: 3,
        name: "Linh Chi",
        avatar:
          "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=60",
        lastMessage: "Ok mai mình qua lấy nhé.",
        time: "1d",
      },
      {
        id: 4,
        name: "Hoàng Nam",
        avatar:
          "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
        lastMessage: "Cảm ơn bạn nhiều!",
        time: "3d",
      },
    ],
    []
  );

  const [activeContactId, setActiveContactId] = useState(1);
  const activeContact =
    contacts.find((c) => c.id === activeContactId) || contacts[0];

  const messages: Message[] = useMemo(
    () => [
      {
        id: 1,
        from: "other",
        text: 'Chào bạn, mình thấy bạn đang cuốn "Thư Viện Nửa Đêm". Sách còn mới không bạn?',
        time: "10:30 AM",
      },
      {
        id: 2,
        from: "me",
        text: "Chào Minh Anh, đúng rồi! Sách mình mới đọc một lần nên còn rất mới, bìa không bị gập nhé.",
        time: "10:32 AM",
      },
      {
        id: 3,
        from: "other",
        text: 'Tuyệt quá. Bạn có muốn đổi lấy cuốn "Thói Quen Nguyên Tử" không? Đây là ảnh sách của mình nè:',
        time: "10:35 AM",
        image:
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&auto=format&fit=crop&q=60",
      },
      {
        id: 4,
        from: "me",
        text: "Nghe hay đấy! Mình cũng đang tìm cuốn đó. Chốt nhé! 👍",
        time: "10:36 AM",
      },
    ],
    []
  );

  const filteredContacts = contacts.filter((c) =>
    c.name.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Header user={user} loading={loading} />

      <main className="mx-auto max-w-6xl px-3 py-3">
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden h-[calc(100vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] h-full">
            <ChatSidebar
              search={search}
              onSearchChange={setSearch}
              contacts={filteredContacts}
              activeContactId={activeContactId}
              onSelect={setActiveContactId}
            />

            <section className="flex flex-col">
              <ChatHeader
                contact={activeContact}
                interestedBook={{
                  cover:
                    "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?w=200&auto=format&fit=crop&q=60",
                  title: "Thư Viện Nửa Đêm",
                }}
              />

              <ChatMessages
                dateLabel="Hôm nay, 20 Tháng 10"
                messages={messages}
              />

              <ChatComposer
                value={input}
                onChange={setInput}
                onSend={() => {
                  // UI-only: nối BE sau
                  setInput("");
                }}
              />
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
