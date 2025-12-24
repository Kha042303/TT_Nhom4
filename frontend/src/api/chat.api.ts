// src/api/chat.api.ts
import axios, { type AxiosInstance } from "axios";

import type { Socket } from "socket.io-client";

export interface UserType {
  user_id: number;
  email: string;
  full_name: string;
}

export interface MessageType {
  sender_id: number;
  receiver_id: number;
  message: string | null;
  images?: string[]; 
  sent_at?: string;
  chat_id?: number;
}

export type Unsubscribe = () => void;

export interface CreateChatApiOptions {
  baseURL: string;      // ví dụ: "http://localhost:3000"
  token: string;        // Bearer token
  myUserId: number;     // user.user_id
  socket: Socket;       // socket singleton bạn đang import "../../socket"
}

export interface SendMessageInput {
  receiverId: number;
  text?: string;              // nội dung text
  files?: File[];             // ảnh dạng File (input[type=file])
  images?: string[];          // nếu bạn đã có base64 hoặc url sẵn
  persistTextViaHttp?: boolean; // giữ flow cũ: text-only thì gọi /chat/send
}


export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result)); // data:image/...;base64,...
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function filesToBase64(files: File[]): Promise<string[]> {
  return Promise.all(files.map(fileToBase64));
}

export function normalizeMessage(raw: any): MessageType {
  let images: string[] | undefined;

  if (Array.isArray(raw?.images)) {
    images = raw.images;
  } else if (typeof raw?.images === "string") {
    try {
      const parsed = JSON.parse(raw.images);
      if (Array.isArray(parsed)) images = parsed;
    } catch {
      images = undefined;
    }
  }

  return {
    sender_id: Number(raw?.sender_id),
    receiver_id: Number(raw?.receiver_id),
    message: raw?.message ?? null,
    images,
    sent_at: raw?.sent_at,
    chat_id: raw?.chat_id,
  };
}

export function resolveImageSrc(baseURL: string, src: string) {
  if (src.startsWith("/images/")) return `${baseURL}${src}`;
  return src; // base64 hoặc url đầy đủ
}

export function createChatApi(opts: CreateChatApiOptions) {
  const http: AxiosInstance = axios.create({
    baseURL: opts.baseURL,
    headers: { Authorization: `Bearer ${opts.token}` },
  });

  const s = opts.socket;
  function connectRealtime() {
    s.auth = { token: opts.token };
    if (!s.connected) s.connect();
    s.on("connect", () => s.emit("addUser", opts.myUserId));
  }

  function disconnectRealtime() {
    s.off("connect");
    s.disconnect();
  }
  function onReceiverMessage(handler: (msg: MessageType) => void): Unsubscribe {
    const cb = (msg: any) => handler(normalizeMessage(msg));
    s.on("receiverMessage", cb);
    return () => s.off("receiverMessage", cb);
  }

  async function listUsers(): Promise<UserType[]> {
    const res = await http.get("/api/v1/user/list");
    return res.data?.data ?? [];
  }

  async function getMessages(receiverId: number): Promise<MessageType[]> {
    const res = await http.get(`/api/v1/chat/${receiverId}`);
    const list = res.data?.data ?? [];
    return list.map(normalizeMessage);
  }

  async function persistTextMessageHttp(receiverId: number, text: string) {
    await http.post("/api/v1/chat/send", { receiver_id: receiverId, message: text });
  }


  async function sendMessage(input: SendMessageInput): Promise<MessageType> {
    const text = (input.text ?? "").trim();
    const receiverId = input.receiverId;
    const persistTextViaHttp = input.persistTextViaHttp ?? true;

    const imagesFromFiles =
      input.files && input.files.length > 0 ? await filesToBase64(input.files) : [];

    const images = [...(input.images ?? []), ...imagesFromFiles].filter(Boolean);

    if (!receiverId) throw new Error("receiverId is required");
    if (!text && images.length === 0) throw new Error("Message text or images is required");

    if (persistTextViaHttp && text && images.length === 0) {
      await persistTextMessageHttp(receiverId, text);
    }

    const payload: MessageType = {
      sender_id: opts.myUserId,
      receiver_id: receiverId,
      message: text || null,
      images: images.length > 0 ? images : undefined,
    };

    s.emit("sendMessage", payload);
    return payload;
  }

  return {
    // socket
    connectRealtime,
    disconnectRealtime,
    onReceiverMessage,

    // http
    listUsers,
    getMessages,

    // send
    sendMessage,

    // helpers (để render ảnh)
    normalizeMessage,
    resolveImageSrc: (src: string) => resolveImageSrc(opts.baseURL, src),
  };
}
