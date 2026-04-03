import { useState, useRef, useEffect } from "react";

import { MessageCircle, X, Send, Bot, User, Minimize2, Sparkles } from "lucide-react";



type Message = {

  role: "user" | "assistant";

  content: string;

  timestamp: Date;

};



const SYSTEM_PROMPT = `You are CivicBot, a helpful AI assistant for CivicAI — a civic complaint management platform in India.



You help citizens with:

- How to submit complaints about civic issues (potholes, garbage, electricity, water, etc.)

- Which department handles which type of issue

- How to track their complaint status using their complaint ID

- Understanding complaint priority levels (high/medium/low)

- General civic awareness and rights as a citizen

- Navigating the CivicAI platform



Department guide:

- Potholes, roads, broken footpaths → Public Works Department

- Garbage, waste, sanitation → Sanitation Department

- Street lights, power cuts, electricity → Electricity Department

- Water supply, pipe leaks, drainage → Water Department

- Parks, trees, green spaces → Horticulture Department

- Noise, pollution, illegal construction → General/Municipal



Keep responses concise, friendly, and helpful. Use simple language.

If asked something unrelated to civic issues or the platform, politely redirect to civic topics.

Always encourage citizens to report issues — every complaint makes the city better!`;



const SUGGESTIONS = [

  "How do I submit a complaint?",

  "My road has a pothole",

  "No water supply since 2 days",

  "How to track my complaint?",

  "Garbage not collected",

  "Street light not working",

];



export default function ChatBot() {

  const [open, setOpen]         = useState(false);

  const [minimized, setMin]     = useState(false);

  const [messages, setMessages] = useState<Message[]>([{

    role: "assistant",

    content: "Hi! I'm CivicBot 👋 I'm here to help you report civic issues, find the right department, and navigate the platform. How can I help you today?",

    timestamp: new Date(),

  }]);

  const [input, setInput]   = useState("");

  const [loading, setLoad]  = useState(false);

  const [unread, setUnread] = useState(0);

  const bottomRef = useRef<HTMLDivElement>(null);

  const inputRef  = useRef<HTMLInputElement>(null);



  useEffect(() => {

    if (open) { setUnread(0); setTimeout(() => inputRef.current?.focus(), 100); }

  }, [open]);



  useEffect(() => {

    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages, open]);



  const sendMessage = async (text: string) => {

    if (!text.trim() || loading) return;

    const userMsg: Message = { role: "user", content: text.trim(), timestamp: new Date() };

    setMessages(prev => [...prev, userMsg]);

    setInput("");

    setLoad(true);



    try {

      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;



      // Build conversation history for Gemini

      const history = messages.map(m => ({

        role: m.role === "assistant" ? "model" : "user",

        parts: [{ text: m.content }]

      }));



      const response = await fetch(url, {

        method: "POST",

        headers: { "Content-Type": "application/json" },

        body: JSON.stringify({

          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },

          contents: [

            ...history,

            { role: "user", parts: [{ text: text.trim() }] }

          ],

          generationConfig: {

            maxOutputTokens: 400,

            temperature: 0.7,

          }

        }),

      });



      const data = await response.json();



      if (response.status === 429) {

        setMessages(prev => [...prev, { role:"assistant", content:"⏳ You're sending messages too fast! Please wait 30 seconds and try again.", timestamp: new Date() }]);

        setLoad(false);

        return;

      }



      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text

        || "Sorry, I couldn't process that. Please try again!";



      setMessages(prev => [...prev, { role: "assistant", content: reply, timestamp: new Date() }]);

      if (!open) setUnread(n => n + 1);

    } catch (err: any) {

      const is429 = err?.message?.includes("429") || false;

      setMessages(prev => [...prev, {

        role: "assistant",

        content: is429

          ? "⏳ I'm getting too many requests right now. Please wait 30 seconds and try again!"

          : "I'm having trouble connecting right now. Please check your internet and try again!",

        timestamp: new Date(),

      }]);

    } finally {

      setLoad(false);

    }

  };



  const fmt = (d: Date) => d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });



  return (

    <>

      {/* FLOATING BUBBLE */}

      {!open && (

        <button onClick={() => setOpen(true)} style={{

          position:"fixed", bottom:28, right:28, zIndex:1000,

          width:58, height:58, borderRadius:"50%",

          background:"#0f2044", border:"none", cursor:"pointer",

          display:"flex", alignItems:"center", justifyContent:"center",

          boxShadow:"0 4px 20px rgba(15,32,68,0.35)",

          animation:"popIn 0.4s cubic-bezier(0.16,1,0.3,1) both",

          transition:"all 0.25s"

        }}

        onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.transform="scale(1.1)"; el.style.boxShadow="0 8px 28px rgba(15,32,68,0.45)"; }}

        onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.transform="scale(1)"; el.style.boxShadow="0 4px 20px rgba(15,32,68,0.35)"; }}>

          <MessageCircle size={24} color="#fff" strokeWidth={2} />

          {unread > 0 && (

            <div style={{ position:"absolute", top:-4, right:-4, width:20, height:20, borderRadius:"50%", background:"#ef4444", border:"2px solid #fff", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"0.65rem", fontWeight:800, color:"#fff" }}>

              {unread}

            </div>

          )}

          <div style={{ position:"absolute", inset:0, borderRadius:"50%", border:"2px solid rgba(15,32,68,0.35)", animation:"ping 2s ease-in-out infinite" }} />

        </button>

      )}



      {/* CHAT WINDOW */}

      {open && (

        <div style={{

          position:"fixed", bottom:28, right:28, zIndex:1000,

          width:370, borderRadius:20,

          background:"#fff", border:"1px solid #e2e8f0",

          boxShadow:"0 20px 60px rgba(15,32,68,0.18)",

          display:"flex", flexDirection:"column", overflow:"hidden",

          height: minimized ? "auto" : 540,

          animation:"slideUp 0.35s cubic-bezier(0.16,1,0.3,1) both",

          fontFamily:"'Plus Jakarta Sans', sans-serif",

        }}>



          {/* header */}

          <div style={{ background:"#0f2044", padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>

            <div style={{ display:"flex", alignItems:"center", gap:10 }}>

              <div style={{ width:36, height:36, borderRadius:10, background:"rgba(255,255,255,0.12)", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>

                <Bot size={18} color="#fff" />

                <div style={{ position:"absolute", bottom:1, right:1, width:8, height:8, borderRadius:"50%", background:"#22c55e", border:"1.5px solid #0f2044" }} />

              </div>

              <div>

                <div style={{ fontWeight:700, fontSize:"0.88rem", color:"#fff", display:"flex", alignItems:"center", gap:6 }}>

                  CivicBot

                  <span style={{ background:"rgba(255,255,255,0.15)", borderRadius:4, padding:"1px 6px", fontSize:"0.6rem", fontWeight:700, letterSpacing:"0.05em", color:"rgba(255,255,255,0.8)" }}>AI</span>

                </div>

                <div style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.5)", marginTop:1 }}>Always here to help</div>

              </div>

            </div>

            <div style={{ display:"flex", gap:6 }}>

              <button onClick={() => setMin(m => !m)} style={{ width:28, height:28, borderRadius:7, background:"rgba(255,255,255,0.1)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>

                <Minimize2 size={13} />

              </button>

              <button onClick={() => setOpen(false)} style={{ width:28, height:28, borderRadius:7, background:"rgba(255,255,255,0.1)", border:"none", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff" }}>

                <X size={13} />

              </button>

            </div>

          </div>



          {!minimized && (<>

            {/* messages */}

            <div style={{ flex:1, overflowY:"auto", padding:"16px 14px", display:"flex", flexDirection:"column", gap:12, background:"#f8fafc" }}>

              {messages.map((m, i) => (

                <div key={i} style={{ display:"flex", gap:8, flexDirection: m.role === "user" ? "row-reverse" : "row", alignItems:"flex-end" }}>

                  <div style={{ width:28, height:28, borderRadius:8, flexShrink:0, background: m.role === "assistant" ? "#0f2044" : "#2563eb", display:"flex", alignItems:"center", justifyContent:"center" }}>

                    {m.role === "assistant" ? <Bot size={14} color="#fff" /> : <User size={14} color="#fff" />}

                  </div>

                  <div style={{ maxWidth:"78%", display:"flex", flexDirection:"column", gap:3, alignItems: m.role === "user" ? "flex-end" : "flex-start" }}>

                    <div style={{

                      padding:"10px 13px",

                      borderRadius: m.role === "user" ? "14px 14px 4px 14px" : "14px 14px 14px 4px",

                      background: m.role === "user" ? "#0f2044" : "#fff",

                      color: m.role === "user" ? "#fff" : "#0f172a",

                      fontSize:"0.84rem", lineHeight:1.55,

                      border: m.role === "assistant" ? "1px solid #e2e8f0" : "none",

                      boxShadow:"0 1px 3px rgba(0,0,0,0.07)",

                      whiteSpace:"pre-wrap", wordBreak:"break-word"

                    }}>

                      {m.content}

                    </div>

                    <span style={{ fontSize:"0.62rem", color:"#94a3b8" }}>{fmt(m.timestamp)}</span>

                  </div>

                </div>

              ))}



              {/* typing dots */}

              {loading && (

                <div style={{ display:"flex", gap:8, alignItems:"flex-end" }}>

                  <div style={{ width:28, height:28, borderRadius:8, background:"#0f2044", display:"flex", alignItems:"center", justifyContent:"center" }}>

                    <Bot size={14} color="#fff" />

                  </div>

                  <div style={{ padding:"10px 14px", borderRadius:"14px 14px 14px 4px", background:"#fff", border:"1px solid #e2e8f0", display:"flex", gap:4, alignItems:"center" }}>

                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#94a3b8", animation:"bounce 1s 0s infinite" }} />

                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#94a3b8", animation:"bounce 1s 0.15s infinite" }} />

                    <div style={{ width:6, height:6, borderRadius:"50%", background:"#94a3b8", animation:"bounce 1s 0.3s infinite" }} />

                  </div>

                </div>

              )}

              <div ref={bottomRef} />

            </div>



            {/* suggestions — only on first message */}

            {messages.length <= 1 && (

              <div style={{ padding:"8px 12px", borderTop:"1px solid #f1f5f9", background:"#fff" }}>

                <p style={{ fontSize:"0.68rem", color:"#94a3b8", fontWeight:600, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:6 }}>Quick questions</p>

                <div style={{ display:"flex", flexWrap:"wrap", gap:5 }}>

                  {SUGGESTIONS.map(s => (

                    <button key={s} onClick={() => sendMessage(s)} style={{

                      padding:"4px 10px", borderRadius:20, fontSize:"0.72rem", fontWeight:600,

                      background:"#f1f5f9", border:"1px solid #e2e8f0", color:"#334155",

                      cursor:"pointer", transition:"all 0.15s", fontFamily:"'Plus Jakarta Sans',sans-serif"

                    }}

                    onMouseEnter={e => { const el = e.currentTarget; el.style.background="#eff6ff"; el.style.borderColor="#dbeafe"; el.style.color="#2563eb"; }}

                    onMouseLeave={e => { const el = e.currentTarget; el.style.background="#f1f5f9"; el.style.borderColor="#e2e8f0"; el.style.color="#334155"; }}>

                      {s}

                    </button>

                  ))}

                </div>

              </div>

            )}



            {/* input */}

            <div style={{ padding:"12px 14px", borderTop:"1px solid #e2e8f0", background:"#fff", display:"flex", gap:8, alignItems:"center" }}>

              <input

                ref={inputRef}

                value={input}

                onChange={e => setInput(e.target.value)}

                onKeyDown={e => e.key === "Enter" && !e.shiftKey && sendMessage(input)}

                placeholder="Ask about civic issues..."

                disabled={loading}

                style={{ flex:1, padding:"9px 12px", borderRadius:10, border:"1.5px solid #e2e8f0", fontSize:"0.83rem", background:"#f8fafc", color:"#0f172a", outline:"none", fontFamily:"'Plus Jakarta Sans',sans-serif", transition:"border-color 0.2s" }}

                onFocus={e => e.target.style.borderColor="#2563eb"}

                onBlur={e => e.target.style.borderColor="#e2e8f0"}

              />

              <button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} style={{

                width:36, height:36, borderRadius:10, flexShrink:0,

                background: input.trim() && !loading ? "#0f2044" : "#e2e8f0",

                border:"none", cursor: input.trim() && !loading ? "pointer" : "not-allowed",

                display:"flex", alignItems:"center", justifyContent:"center", transition:"all 0.2s"

              }}>

                <Send size={15} color={input.trim() && !loading ? "#fff" : "#94a3b8"} />

              </button>

            </div>



            {/* footer */}

            <div style={{ padding:"6px 14px 10px", background:"#fff", display:"flex", alignItems:"center", justifyContent:"center", gap:4 }}>

              <Sparkles size={10} color="#94a3b8" />

              <span style={{ fontSize:"0.62rem", color:"#94a3b8" }}>Powered by Gemini AI</span>

            </div>

          </>)}

        </div>

      )}



      <style>{`

        @keyframes popIn   { from{opacity:0;transform:scale(0.5)} to{opacity:1;transform:scale(1)} }

        @keyframes slideUp { from{opacity:0;transform:translateY(20px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }

        @keyframes ping    { 0%,100%{transform:scale(1);opacity:0.6} 50%{transform:scale(1.25);opacity:0} }

        @keyframes bounce  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }

      `}</style>

    </>

  );

}

