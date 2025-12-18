export type Contact = {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread?: boolean;
  active?: boolean;
};

export type Message = {
  id: number;
  from: "me" | "other";
  text?: string;
  time: string;
  image?: string;
};
