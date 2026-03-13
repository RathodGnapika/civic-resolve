import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitComplaint, type Complaint } from "@/lib/complaints";
import { CheckCircle, MapPin, User, FileText, ArrowRight, Sparkles, Building, Flag } from "lucide-react";

const priorityStyle: Record<string, { bg: string; color: string; border: string }> = {
  high:   { bg:"#fee2e2", color:"#dc2626", border:"rgba(220,38,38,0.2)" },
  medium: { bg:"#fef3c7", color:"#d97706", border:"rgba(217,119,6,0.2)" },
  low:    { bg:"#dcfce7", color:"#16a34a", border:"rgba(22,163,74,0.2)" },
};

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [name, setName]           = useState("");
  const [location, setLocation]   = useState("");
  const [text, setText]           = useState("");
  const [submitted, setSubmitted] = useState<Complaint | null>(null);
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !location.trim() || !text.trim()) return;
    setLoading(true);
    try {
      const complaint = await submitComplaint(name, location, text);
      setSubmitted(complaint);
    } catch (error) {
      alert("Error: " + error);
    } finally {
      setLoading(false);
    }
  };

  /* ── SUCCESS STATE ── */
  if (submitted) {
    const pri = priorityStyle[submitted.priority?.toLowerCase()] || priorityStyle.low;
    return (
      <div style={{ minHeight:"calc(100vh - 64px)", display:"flex", alignItems:"flex-start", justifyContent:"center", padding:"48px 24px", background:"#f0f4f8" }}>
        <div style={{
          background:"#fff", border:"1px solid #e2e8f0", borderRadius:20,
          boxShadow:"0 12px 40px rgba(15,32,68,0.13)", width:"100%", maxWidth:500,
          overflow:"hidden", animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both"
        }}>
          <div style={{ height:4, background:"linear-gradient(90deg,#16a34a,#22c55e)" }} />

          <div style={{ padding:"40px 36px 28px", textAlign:"center", borderBottom:"1px solid #f1f5f9" }}>
            <div style={{ width:64, height:64, borderRadius:"50%", background:"#dcfce7", border:"2px solid rgba(22,163,74,0.2)", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <CheckCircle size={30} color="#16a34a" strokeWidth={2} />
            </div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#0f2044", marginBottom:8, letterSpacing:"-0.02em" }}>
              Complaint Submitted!
            </h1>
            <p style={{ color:"#64748b", fontSize:"0.875rem", lineHeight:1.6 }}>
              Your complaint has been registered and classified by AI automatically.
            </p>
          </div>

          <div style={{ padding:"24px 36px 32px" }}>
            {/* AI badge */}
            <div style={{ display:"flex", alignItems:"center", gap:8, padding:"10px 14px", background:"#f5f3ff", border:"1px solid rgba(124,58,237,0.15)", borderRadius:10, marginBottom:20 }}>
              <Sparkles size={15} color="#7c3aed" />
              <span style={{ fontSize:"0.8rem", color:"#7c3aed", fontWeight:600 }}>AI classified your complaint automatically</span>
            </div>

            {/* detail rows */}
            {[
              { icon:FileText, label:"Complaint ID", value: <span style={{ fontFamily:"monospace", fontSize:"0.78rem", background:"#f1f5f9", padding:"2px 8px", borderRadius:5 }}>#{typeof submitted.id === "string" ? submitted.id.slice(0,16)+"..." : submitted.id}</span> },
              { icon:MapPin,   label:"Location",     value: submitted.location },
              { icon:Building, label:"Department",   value: <span style={{ background:"#f5f3ff", color:"#7c3aed", border:"1px solid rgba(124,58,237,0.15)", borderRadius:6, padding:"2px 9px", fontSize:"0.72rem", fontWeight:700 }}>{submitted.department}</span> },
              { icon:Flag,     label:"Priority",     value: <span style={{ background:pri.bg, color:pri.color, border:`1px solid ${pri.border}`, borderRadius:6, padding:"2px 9px", fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase" as const }}>{submitted.priority}</span> },
              { icon:CheckCircle, label:"Status",    value: <span style={{ background:"#f1f5f9", color:"#64748b", border:"1px solid rgba(100,116,139,0.2)", borderRadius:6, padding:"2px 9px", fontSize:"0.72rem", fontWeight:700 }}>Pending</span> },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"11px 0", borderBottom:"1px solid #f8fafc" }}>
                <div style={{ display:"flex", alignItems:"center", gap:7, color:"#64748b", fontSize:"0.82rem", fontWeight:500 }}>
                  <Icon size={14} color="#94a3b8" /> {label}
                </div>
                <div style={{ color:"#0f172a", fontWeight:600, fontSize:"0.875rem" }}>{value}</div>
              </div>
            ))}

            {/* action buttons */}
            <div style={{ display:"flex", gap:10, marginTop:24 }}>
              <button onClick={() => { setSubmitted(null); setName(""); setLocation(""); setText(""); }} style={{
                flex:1, padding:"11px", borderRadius:9, background:"#f8fafc",
                border:"1.5px solid #e2e8f0", color:"#334155", fontWeight:600,
                fontSize:"0.88rem", cursor:"pointer", fontFamily:"DM Sans,sans-serif", transition:"all 0.2s"
              }}>
                Submit Another
              </button>
              <button onClick={() => navigate("/track")} style={{
                flex:1, padding:"11px", borderRadius:9, background:"#1a3a6b",
                border:"none", color:"#fff", fontWeight:700,
                fontSize:"0.88rem", cursor:"pointer", fontFamily:"DM Sans,sans-serif",
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                boxShadow:"0 2px 8px rgba(26,58,107,0.25)", transition:"all 0.2s"
              }}>
                Track Status <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
        <style>{`@keyframes fadeUp{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}`}</style>
      </div>
    );
  }

  /* ── FORM STATE ── */
  return (
    <div style={{
      minHeight:"calc(100vh - 64px)", display:"flex", alignItems:"flex-start",
      justifyContent:"center", padding:"48px 24px", background:"#f0f4f8",
      position:"relative", overflow:"hidden"
    }}>
      <div style={{ position:"absolute", top:-80, right:-80, width:300, height:300, borderRadius:"50%", background:"rgba(37,99,235,0.05)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-60, left:-60, width:280, height:280, borderRadius:"50%", background:"rgba(249,115,22,0.04)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:520, position:"relative", zIndex:1 }}>
        <div style={{
          background:"#fff", border:"1px solid #e2e8f0", borderRadius:20,
          boxShadow:"0 12px 40px rgba(15,32,68,0.13)", overflow:"hidden",
          animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both"
        }}>
          <div style={{ height:4, background:"linear-gradient(90deg,#0f2044 0%,#2563eb 50%,#f97316 100%)" }} />

          {/* header */}
          <div style={{ padding:"32px 36px 22px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#eff6ff", border:"1px solid #dbeafe", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <FileText size={20} color="#2563eb" strokeWidth={2} />
              </div>
              <div>
                <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.4rem", fontWeight:800, color:"#0f2044", letterSpacing:"-0.02em" }}>
                  Report a Civic Issue
                </h1>
                <p style={{ color:"#64748b", fontSize:"0.82rem", marginTop:2 }}>
                  AI will automatically categorize and prioritize it
                </p>
              </div>
            </div>
          </div>

          {/* AI info banner */}
          <div style={{ margin:"20px 36px 0", padding:"10px 14px", background:"#f5f3ff", border:"1px solid rgba(124,58,237,0.15)", borderRadius:10, display:"flex", alignItems:"center", gap:8 }}>
            <Sparkles size={14} color="#7c3aed" />
            <span style={{ fontSize:"0.78rem", color:"#7c3aed", fontWeight:600 }}>AI auto-detects department & priority from your description</span>
          </div>

          {/* form */}
          <div style={{ padding:"24px 36px 36px" }}>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom:18 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:7 }}>
                  <User size={13} color="#64748b" /> Your Name
                </label>
                <Input placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required
                  style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a" }} />
              </div>

              <div style={{ marginBottom:18 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:7 }}>
                  <MapPin size={13} color="#64748b" /> Location
                </label>
                <Input placeholder="Market Road, Sector 5, Hyderabad" value={location} onChange={e => setLocation(e.target.value)} required
                  style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a" }} />
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:7 }}>
                  <FileText size={13} color="#64748b" /> Complaint Description
                </label>
                <Textarea placeholder="Describe the issue in detail... e.g. 'There is a large pothole on Main Street causing accidents'" rows={4} value={text} onChange={e => setText(e.target.value)} required
                  style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a", resize:"vertical", fontFamily:"DM Sans,sans-serif" }} />
                <p style={{ fontSize:"0.75rem", color:"#94a3b8", marginTop:5 }}>
                  Tip: mention keywords like "pothole", "garbage", "electricity" for better AI classification
                </p>
              </div>

              <button type="submit" disabled={loading} style={{
                width:"100%", padding:"14px", borderRadius:10, fontWeight:700, fontSize:"0.95rem",
                background: loading ? "#94a3b8" : "#1a3a6b", color:"#fff", border:"none",
                cursor: loading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:"0 2px 8px rgba(26,58,107,0.25)", transition:"all 0.2s",
                fontFamily:"DM Sans,sans-serif"
              }}>
                {loading ? (
                  <><div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} /> Submitting...</>
                ) : (
                  <><Sparkles size={16} /> Submit Complaint <ArrowRight size={15} /></>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
