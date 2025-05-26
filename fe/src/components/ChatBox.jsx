import React, { useState } from "react";

const ChatBox = () => {
  const [messages, setMessages] = useState([
    { sender: "ai", text: "Xin chào! Tôi là trợ lý AI sức khỏe. Bạn cần tư vấn gì?" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat-google/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages(msgs => [...msgs, { sender: "ai", text: data.reply }]);
    } catch (e) {
      setMessages(msgs => [...msgs, { sender: "ai", text: "Xin lỗi, hệ thống AI đang bận." }]);
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 16, width: 350 }}>
      <div style={{ height: 200, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ textAlign: msg.sender === "user" ? "right" : "left" }}>
            <b>{msg.sender === "user" ? "Bạn" : "AI"}:</b> {msg.text}
          </div>
        ))}
        {loading && <div><i>AI đang trả lời...</i></div>}
      </div>
      <input
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === "Enter" && sendMessage()}
        style={{ width: "80%" }}
        placeholder="Nhập câu hỏi..."
        disabled={loading}
      />
      <button onClick={sendMessage} disabled={loading}>Gửi</button>
    </div>
  );
};

export default ChatBox;