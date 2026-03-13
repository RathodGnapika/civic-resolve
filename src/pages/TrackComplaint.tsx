import { useState } from "react";
import { Input } from "@/components/ui/input";
import { getComplaintById, type Complaint } from "@/lib/complaints";
import { Search, AlertCircle, MapPin, User, Building, Flag, Clock, CheckCircle, FileText } from "lucide-react";

const priorityStyle: Record<string, { bg: string; color: string; border: string }> = {
  high:   { bg:"#fee2e2", color:"#dc2626", border:"rgba(220,38,38,0.2)" },
  medium: { bg:"#fef3c7", color:"#d97706", border:"rgba(217,119,6,0.2)" },
  low:    { bg:"#dcfce7", color:"#16a34a", border:"rgba(22,163,74,0.2)" },
};
const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  pending:     { bg:"#f1f5f9", color:"#64748b", border:"rgba(100,116,139,0.2)" },
  in_progress: { bg:"#eff6ff", color:"#2563eb", border:"rgba(37,99,235,0.2)" },
  resolved:    { bg:"#dcfce7", color:"#16a34a", border:"rgba(22,163,74,0.2)" },
  closed:      { bg:"#f5f3ff", color:"#7c3aed", border:"rgba(124,58,237,0.2)" },
  rejected:    { bg:"#fee2e2", color:"#dc2626", border:"rgba(220,38,38,0.2)" },
};

function Badge({ label, style }: { label: string; style: { bg: string; color: string; border: string } }) {
  return (
    <span style={{ background:style.bg, color:style.color, border:`1px solid ${style.border}`, borderRadius:6, padding:"3px 10px", fontSize:"0.72rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.05em" }}>
      {label}
    </span>
  );
}

function ResultRow({ icon: Icon, label, children }: { icon: any; label: string; children: React.ReactNode }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0", borderBottom:"1px solid #f1f5f9" }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, color:"#64748b", fontSize:"0.82rem", fontWeight:500 }}>
        <Icon size={14} color="#94a3b8" />
        {label}
      </div>
      <div style={{ color:"#0f172a", fontSize:"0.875rem", fontWeight:600, textAlign:"right", maxWidth:260 }}>
        {children}
      </div>
    </div>
  );
}

export default function TrackComplaint() {
  const [idInput, setIdInput] = useState("");
  const [result, setResult]   = useState<Complaint | null | "not_found">(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idInput.trim()) return;
    setLoading(true);
    setTimeout(async () => {
      const complaint = await getComplaintById(idInput.trim());
      setResult(complaint || "not_found");
      setLoading(false);
    }, 400);
  };

  return (
    <div style={{
      minHeight:"calc(100vh - 64px)", display:"flex", alignItems:"flex-start",
      justifyContent:"center", padding:"48px 24px", background:"#f0f4f8",
      position:"relative", overflow:"hidden"
    }}>
      {/* bg accents */}
      <div style={{ position:"absolute", top:-80, right:-80, width:320, height:320, borderRadius:"50%", background:"rgba(37,99,235,0.05)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-80, left:-80, width:300, height:300, borderRadius:"50%", background:"rgba(249,115,22,0.04)", pointerEvents:"none" }} />

      <div style={{ width:"100%", maxWidth:520, position:"relative", zIndex:1 }}>

        {/* card */}
        <div style={{
          background:"#fff", border:"1px solid #e2e8f0", borderRadius:20,
          boxShadow:"0 12px 40px rgba(15,32,68,0.13)",
          overflow:"hidden",
          animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both"
        }}>
          {/* stripe */}
          <div style={{ height:4, background:"linear-gradient(90deg,#0f2044 0%,#2563eb 50%,#f97316 100%)" }} />

          {/* header */}
          <div style={{ padding:"32px 36px 24px", borderBottom:"1px solid #f1f5f9", background:"#f8fafc" }}>
            <div style={{ display:"flex", alignItems:"center", gap:14, marginBottom:4 }}>
              <div style={{ width:44, height:44, borderRadius:12, background:"#eff6ff", border:"1px solid #dbeafe", display:"flex", alignItems:"center", justifyContent:"center" }}>
                <Search size={20} color="#2563eb" strokeWidth={2} />
              </div>
              <div>
                <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.4rem", fontWeight:800, color:"#0f2044", letterSpacing:"-0.02em" }}>
                  Track Complaint
                </h1>
                <p style={{ color:"#64748b", fontSize:"0.82rem", marginTop:2 }}>
                  Enter your Complaint ID to check status
                </p>
              </div>
            </div>
          </div>

          {/* body */}
          <div style={{ padding:"28px 36px" }}>

            {/* search bar */}
            <form onSubmit={handleSearch} style={{ display:"flex", gap:8, marginBottom:24 }}>
              <div style={{ flex:1, position:"relative" }}>
                <Search size={15} color="#94a3b8" style={{ position:"absolute", left:12, top:"50%", transform:"translateY(-50%)", pointerEvents:"none" }} />
                <Input
                  placeholder="Enter your complaint UUID..."
                  value={idInput}
                  onChange={e => setIdInput(e.target.value)}
                  style={{ paddingLeft:36, background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:9, fontSize:"0.88rem", color:"#0f172a", width:"100%" }}
                />
              </div>
              <button type="submit" disabled={loading} style={{
                padding:"0 18px", borderRadius:9, background: loading ? "#94a3b8" : "#1a3a6b",
                color:"#fff", border:"none", fontWeight:700, fontSize:"0.88rem",
                cursor: loading ? "not-allowed" : "pointer", flexShrink:0,
                fontFamily:"DM Sans,sans-serif", transition:"all 0.2s",
                display:"flex", alignItems:"center", gap:6
              }}>
                {loading ? (
                  <div style={{ width:16, height:16, border:"2px solid rgba(255,255,255,0.3)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
                ) : <><Search size={14} /> Search</>}
              </button>
            </form>

            {/* not found */}
            {result === "not_found" && (
              <div style={{
                display:"flex", alignItems:"flex-start", gap:12,
                padding:"16px", borderRadius:10,
                background:"#fef2f2", border:"1px solid rgba(220,38,38,0.15)",
                animation:"fadeUp 0.4s ease both"
              }}>
                <AlertCircle size={18} color="#dc2626" style={{ flexShrink:0, marginTop:1 }} />
                <div>
                  <p style={{ fontWeight:700, color:"#dc2626", fontSize:"0.88rem", marginBottom:2 }}>Complaint not found</p>
                  <p style={{ color:"#94a3b8", fontSize:"0.8rem" }}>Double-check the ID and try again.</p>
                </div>
              </div>
            )}

            {/* result */}
            {result && result !== "not_found" && (
              <div style={{ animation:"fadeUp 0.4s ease both" }}>
                {/* status banner */}
                <div style={{
                  padding:"14px 16px", borderRadius:10, marginBottom:20,
                  background: result.status?.toLowerCase() === "resolved" ? "#f0fdf4" : "#eff6ff",
                  border: `1px solid ${result.status?.toLowerCase() === "resolved" ? "rgba(22,163,74,0.2)" : "rgba(37,99,235,0.15)"}`,
                  display:"flex", alignItems:"center", gap:10
                }}>
                  {result.status?.toLowerCase() === "resolved"
                    ? <CheckCircle size={18} color="#16a34a" />
                    : <Clock size={18} color="#2563eb" />}
                  <div>
                    <p style={{ fontWeight:700, fontSize:"0.88rem", color: result.status?.toLowerCase() === "resolved" ? "#16a34a" : "#1a3a6b" }}>
                      {result.status?.toLowerCase() === "resolved" ? "Issue Resolved" : "Complaint is being processed"}
                    </p>
                    <p style={{ fontSize:"0.78rem", color:"#64748b", marginTop:1 }}>Last updated: {result.created_at ? new Date(result.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" }) : "—"}</p>
                  </div>
                </div>

                {/* detail rows */}
                <div>
                  <ResultRow icon={FileText} label="Complaint ID">
                    <span style={{ fontFamily:"monospace", fontSize:"0.78rem", background:"#f1f5f9", padding:"2px 8px", borderRadius:5 }}>
                      #{typeof result.id === "string" ? result.id.slice(0,12) + "..." : result.id}
                    </span>
                  </ResultRow>
                  <ResultRow icon={User} label="Name">{result.name}</ResultRow>
                  <ResultRow icon={MapPin} label="Location">{result.location}</ResultRow>
                  <ResultRow icon={FileText} label="Description">
                    <span style={{ color:"#64748b", fontWeight:400, fontSize:"0.82rem", lineHeight:1.5 }}>{result.complaint_text}</span>
                  </ResultRow>
                  <ResultRow icon={Building} label="Department">
                    <span style={{ background:"#f5f3ff", color:"#7c3aed", border:"1px solid rgba(124,58,237,0.15)", borderRadius:6, padding:"2px 9px", fontSize:"0.72rem", fontWeight:700 }}>
                      {result.department}
                    </span>
                  </ResultRow>
                  <ResultRow icon={Flag} label="Priority">
                    <Badge label={result.priority || "low"} style={priorityStyle[result.priority?.toLowerCase()] || priorityStyle.low} />
                  </ResultRow>
                  <ResultRow icon={Clock} label="Status">
                    <Badge label={(result.status || "pending").replace("_"," ")} style={statusStyle[result.status?.toLowerCase()] || statusStyle.pending} />
                  </ResultRow>
                </div>
              </div>
            )}

            {/* hint */}
            {!result && (
              <div style={{ textAlign:"center", padding:"20px 0" }}>
                <div style={{ width:52, height:52, borderRadius:14, background:"#f8fafc", border:"1px solid #e2e8f0", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 12px" }}>
                  <Search size={22} color="#cbd5e1" />
                </div>
                <p style={{ color:"#94a3b8", fontSize:"0.82rem" }}>Enter a complaint ID above to see details</p>
              </div>
            )}
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
