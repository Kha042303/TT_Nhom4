import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import Header from "../components/layout/Header";
import ChatSidebar from "../components/chat/ChatSidebar";
import ChatHeader from "../components/chat/ChatHeader";

import ChatMessages from "../components/chat/ChatMessages";
import type { Contact, Message } from "../components/chat/chat.type";

import { socket } from "../../socket";

import { apiFetch } from "../api/http";
import { profileApi, type User } from "../api/auth.api";
import {
  createChatApi,
  type MessageType as ApiMessageType,
  type UserType as ApiUserType,
} from "../api/chat.api";

function safeGetTokenFromStorage() {
  return (
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("access_token") ||
    ""
  );
}

function formatTime(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function uiAvatarForName(name: string) {
  const encoded = encodeURIComponent(name || "User");
  return `https://ui-avatars.com/api/?name=${encoded}&background=0D8ABC&color=fff`;
}

export default function ChatPage() {
  const nav = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  // ✅ sellerId từ BookDetail: /chat?sellerId=11
  const sellerIdFromQueryRaw = searchParams.get("sellerId");
  const preferredContactId = (() => {
    const n = Number(sellerIdFromQueryRaw);
    return Number.isFinite(n) && n > 0 ? n : null;
  })();

  // ✅ auth theo API bạn gửi (không dùng AuthContext)
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("user");
    return raw ? (JSON.parse(raw) as User) : null;
  });
  const [loading, setLoading] = useState(true);

  const token = safeGetTokenFromStorage();

  useEffect(() => {
    (async () => {
      if (!token) {
        setUser(null);
        setLoading(false);

        // ✅ giữ lại đường dẫn để login xong quay lại đúng chat
        const next = encodeURIComponent(location.pathname + location.search);
        nav(`/signin?next=${next}`, { replace: true });
        return;
      }

      try {
        const u = await profileApi();
        setUser(u);
        localStorage.setItem("user", JSON.stringify(u));
      } catch {
        setUser(null);
        localStorage.removeItem("user");

        const next = encodeURIComponent(location.pathname + location.search);
        nav(`/signin?next=${next}`, { replace: true });
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const myUserId: number | null = user?.user_id ? Number(user.user_id) : null;
  const API_BASE = "http://localhost:3000";
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // ===== scroll refs =====
  const scrollerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  // ===== file input refs =====
  const imagePickerRef = useRef<HTMLInputElement>(null);
  const attachPickerRef = useRef<HTMLInputElement>(null);
  const chatApi = useMemo(() => {
    if (!myUserId || !token) return null;
    return createChatApi({
      baseURL: API_BASE,
      token,
      myUserId,
      socket,
    });
  }, [API_BASE, myUserId, token]);
  const activeContact = useMemo(() => {
    if (!contacts.length) return null;

    if (activeContactId != null) {
      const found = contacts.find((c) => c.id === activeContactId);
      return found || null;
    }
    return contacts[0];
  }, [contacts, activeContactId]);

  const filteredContacts = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter((c) => c.name.toLowerCase().includes(q));
  }, [contacts, search]);
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const onScroll = () => {
      const threshold = 80;
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < threshold;
      setAutoScroll(nearBottom);
    };
    el.addEventListener("scroll", onScroll);
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    if (!autoScroll) return;
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, autoScroll]);
  useEffect(() => {
    if (!chatApi || !myUserId) return;

    chatApi.connectRealtime();

    chatApi
      .listUsers()
      .then((list: ApiUserType[]) => {
        const mapped: Contact[] = list
          .filter((u) => Number(u.user_id) !== myUserId)
          .map((u) => {
            const name = u.full_name || u.email || `User ${u.user_id}`;
            return {
              id: Number(u.user_id),
              name,
              avatar: uiAvatarForName(name),
              lastMessage: "",
              time: "",
              unread: false,
              active: false,
            };
          });

        setContacts(mapped);

        // ✅ Ưu tiên mở đúng sellerId
        if (mapped.length > 0) {
          if (
            preferredContactId &&
            mapped.some((c) => c.id === preferredContactId)
          ) {
            setActiveContactId(preferredContactId);
          } else if (activeContactId == null) {
            setActiveContactId(mapped[0].id);
          }
        }
      })
      .catch(console.error);

    return () => {
      chatApi.disconnectRealtime();
    };
  }, [chatApi, myUserId, preferredContactId]); // ✅ bỏ activeContactId khỏi deps để tránh reload loop

  // ===== Load history when change contact =====
  useEffect(() => {
    if (!chatApi || !activeContact || !myUserId) return;

    chatApi
      .getMessages(activeContact.id)
      .then((list: ApiMessageType[]) => {
        const mapped: Message[] = list.map((m) => {
          const isMe = Number(m.sender_id) === myUserId;
          const imgs = Array.isArray(m.images) ? m.images : [];
          const resolvedImgs = imgs.map(chatApi.resolveImageSrc);

          return {
            id: m.chat_id ?? Number(m.sent_at ?? Date.now()),
            from: isMe ? "me" : "other",
            text: m.message ?? "",
            time: formatTime(m.sent_at),
            ...(resolvedImgs[0] ? { image: resolvedImgs[0] } : {}),
            ...(resolvedImgs.length ? { images: resolvedImgs } : {}),
          } as any;
        });

        setMessages(mapped);
        setAutoScroll(true);
        requestAnimationFrame(() =>
          bottomRef.current?.scrollIntoView({ behavior: "auto" })
        );
      })
      .catch(console.error);
  }, [chatApi, activeContact, myUserId]);

  // ===== Realtime receive =====
  useEffect(() => {
    if (!chatApi || !activeContact || !myUserId) return;

    const unsub = chatApi.onReceiverMessage((msg) => {
      if (
        Number(msg.sender_id) === Number(activeContact.id) &&
        Number(msg.receiver_id) === Number(myUserId)
      ) {
        const imgs = Array.isArray(msg.images) ? msg.images : [];
        const resolvedImgs = imgs.map(chatApi.resolveImageSrc);

        const uiMsg: Message = {
          id: Date.now(),
          from: "other",
          text: msg.message ?? "",
          time: formatTime(msg.sent_at),
          ...(resolvedImgs[0] ? { image: resolvedImgs[0] } : {}),
          ...(resolvedImgs.length ? { images: resolvedImgs } : {}),
        } as any;

        setMessages((prev) => [...prev, uiMsg]);
      }
    });

    return () => unsub();
  }, [chatApi, activeContact, myUserId]);

  // ===== Send (TEXT + IMAGE) =====
  const handleSend = async () => {
    if (!chatApi || !activeContact || !myUserId) return;

    const text = input.trim();
    if (!text && selectedFiles.length === 0) return;

    setInput("");

    // ✅ Nếu có ảnh => upload multipart qua apiFetch (/api/v1/chat/send)
    if (selectedFiles.length > 0) {
      try {
        const form = new FormData();
        form.append("receiver_id", String(activeContact.id));
        form.append("message", text || "");
        selectedFiles.forEach((f) => form.append("images", f));

        setSelectedFiles([]);

        const res = await apiFetch<any>("/chat/send", {
          method: "POST",
          body: form,
        });

        const saved = res?.data;

        const imgs: string[] = Array.isArray(saved?.images) ? saved.images : [];
        const resolvedImgs = imgs.map(chatApi.resolveImageSrc);

        const uiMsg: Message = {
          id: saved?.chat_id ?? Date.now(),
          from: "me",
          text: saved?.message ?? "",
          time: formatTime(saved?.sent_at),
          ...(resolvedImgs[0] ? { image: resolvedImgs[0] } : {}),
          ...(resolvedImgs.length ? { images: resolvedImgs } : {}),
        } as any;

        setMessages((prev) => [...prev, uiMsg]);

        socket.emit("sendMessage", {
          sender_id: saved?.sender_id ?? myUserId,
          receiver_id: saved?.receiver_id ?? activeContact.id,
          message: saved?.message ?? "",
          images: imgs,
          sent_at: saved?.sent_at,
          chat_id: saved?.chat_id,
        });

        return;
      } catch (e) {
        console.error(e);
        return;
      }
    }

    // ✅ Text-only: dùng flow cũ trong chatApi
    const sent = await chatApi.sendMessage({
      receiverId: activeContact.id,
      text,
      files: [],
      persistTextViaHttp: true,
    });

    const uiMsg: Message = {
      id: Date.now(),
      from: "me",
      text: sent.message ?? "",
      time: formatTime(sent.sent_at),
    } as any;

    setMessages((prev) => [...prev, uiMsg]);
  };

  // ===== Guards render =====
  if (loading) return null;
  if (!user || !myUserId) return null;
  if (!token) return null;

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900">
      <Header user={user} loading={loading} />

      <main className="mx-auto max-w-6xl px-3 py-3 h-[calc(100vh-80px)] overflow-hidden">
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden h-full">
          <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] h-full overflow-hidden">
            <div className="h-full overflow-hidden">
              <ChatSidebar
                search={search}
                onSearchChange={setSearch}
                contacts={filteredContacts}
                activeContactId={activeContact?.id ?? 0}
                onSelect={setActiveContactId}
              />
            </div>

            <section className="flex flex-col h-full overflow-hidden">
              {activeContact && <ChatHeader contact={activeContact} />}

              <div ref={scrollerRef} className="flex-1 overflow-y-auto">
                <ChatMessages dateLabel="Hôm nay" messages={messages} />
                <div ref={bottomRef} />
              </div>

              {selectedFiles.length > 0 && (
                <div className="px-4 pt-3 pb-2 border-t bg-white">
                  <div className="flex gap-2 overflow-x-auto">
                    {selectedFiles.map((f, i) => (
                      <div key={i} className="relative shrink-0">
                        <img
                          src={URL.createObjectURL(f)}
                          className="w-16 h-16 rounded-xl object-cover"
                          alt="preview"
                          onLoad={(e) =>
                            URL.revokeObjectURL((e.target as HTMLImageElement).src)
                          }
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-black/70 text-white w-6 h-6 rounded-full text-xs"
                          onClick={() =>
                            setSelectedFiles((prev) => prev.filter((_, idx) => idx !== i))
                          }
                          title="Xoá"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="border-t bg-white px-4 py-3 flex items-center gap-2">
                <input
                  ref={imagePickerRef}
                  type="file"
                  accept="image/*"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) setSelectedFiles((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />

                <input
                  ref={attachPickerRef}
                  type="file"
                  multiple
                  style={{ display: "none" }}
                  onChange={(e) => {
                    const files = Array.from(e.target.files || []);
                    if (files.length > 0) setSelectedFiles((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />

                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-slate-100"
                  title="Chọn ảnh"
                  onClick={() => imagePickerRef.current?.click()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 19V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="m8.5 11.5 2.5 3 3.5-4.5L19 16"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M8.5 8.5h.01"
                      stroke="currentColor"
                      strokeWidth="4"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  className="p-2 rounded-full hover:bg-slate-100"
                  title="Đính kèm"
                  onClick={() => attachPickerRef.current?.click()}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21.44 11.05 12.25 20.24a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.2a2 2 0 1 1-2.83-2.83l8.49-8.49"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      void handleSend();
                    }
                  }}
                  className="flex-1 px-4 py-3 bg-slate-100 rounded-full outline-none"
                  placeholder="Nhập tin nhắn..."
                />

                <button
                  onClick={() => void handleSend()}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full"
                >
                  Gửi
                </button>
                
              </div>
              
            </section>
          </div>
        </div>
        
      </main>
      
    </div>
    
  );
}
