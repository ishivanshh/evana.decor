"use client";
import { useEffect, useState } from "react";
type Message = { _id: string; name: string; email: string; subject: string; message: string; createdAt: string };
export default function MessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => { void fetch("/api/admin/messages").then(response => response.json()).then(data => setMessages(data.messages ?? [])); }, []);
  return <div><p className="eyebrow">A note from a customer</p><h1 className="font-display mt-2 text-5xl">Messages</h1><div className="mt-7 space-y-4">{messages.map(message => <article key={message._id} className="border border-[#e8e1d8] bg-[#fbf8f3] p-5"><div className="flex flex-wrap justify-between gap-2"><h2 className="font-display text-2xl">{message.subject}</h2><time className="text-xs text-[#82776d]">{new Date(message.createdAt).toLocaleString("en-IN")}</time></div><p className="mt-1 text-xs text-[#82776d]">{message.name} · <a href={`mailto:${message.email}`} className="underline">{message.email}</a></p><p className="mt-4 whitespace-pre-wrap text-sm leading-6">{message.message}</p></article>)}{messages.length === 0 && <p className="border border-[#e8e1d8] bg-[#fbf8f3] p-8 text-center text-sm text-[#82776d]">No messages yet.</p>}</div></div>;
}
