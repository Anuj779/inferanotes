"use client";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Send, Bot, User, LoaderCircle } from "lucide-react";

export default function VideoChat({ noteId }) {
  const { api } = useAuth();
  const [messages, setMessages] = useState([
    { role: "model", content: "Hi! I'm your AI tutor. Ask me anything about this video!" }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = input.trim();
    setInput("");
    
    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setLoading(true);
    
    try {
      const response = await api("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          noteId,
          message: userMsg,
          history: messages.slice(1) // exclude first intro message
        })
      });
      
      setMessages([...newMessages, { role: "model", content: response.reply }]);
    } catch (err) {
      setMessages([...newMessages, { role: "model", content: "Sorry, I ran into an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="video-chat-container" style={{ display: "flex", flexDirection: "column", height: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", marginTop: "24px" }}>
      <div style={{ padding: "16px", borderBottom: "1px solid var(--border)", background: "var(--surface-hover)", fontWeight: 600 }}>
        Chat with this Video
      </div>
      
      <div style={{ flex: 1, padding: "16px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px", maxHeight: "400px" }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: "flex", gap: "8px", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", maxWidth: "85%" }}>
            {msg.role === "model" && <div style={{ background: "#3ea6ff", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><Bot size={14} /></div>}
            
            <div style={{ background: msg.role === "user" ? "#3ea6ff" : "var(--surface-hover)", color: msg.role === "user" ? "#fff" : "var(--foreground)", padding: "10px 14px", borderRadius: "12px", fontSize: "14px", lineHeight: "1.4" }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: "8px", alignSelf: "flex-start", opacity: 0.5 }}>
            <LoaderCircle size={16} className="spin" /> Thinking...
          </div>
        )}
        <div ref={endRef} />
      </div>
      
      <form onSubmit={sendMessage} style={{ display: "flex", padding: "12px", borderTop: "1px solid var(--border)", background: "var(--surface-hover)", gap: "8px" }}>
        <input 
          type="text" 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question about the video..."
          disabled={loading}
          style={{ flex: 1, padding: "10px 14px", borderRadius: "20px", border: "1px solid var(--border)", background: "var(--background)", color: "var(--foreground)" }}
        />
        <button type="submit" disabled={!input.trim() || loading} style={{ background: "#3ea6ff", color: "#fff", border: "none", width: "40px", height: "40px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !loading ? "pointer" : "default", opacity: input.trim() && !loading ? 1 : 0.5 }}>
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
