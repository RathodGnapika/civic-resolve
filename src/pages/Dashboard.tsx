import { useState, useMemo, useEffect, useRef } from "react";
import { getComplaints, type Complaint } from "@/lib/complaints";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Clock, CheckCircle, FileText, RefreshCw, Shield, TrendingUp, Filter } from "lucide-react";

const priorityConfig: Record<string, { color: string; bg: string; dot: string }> = {
  high:   { color: "#ff6b6b", bg: "#1a0a0a", dot: "#ff6b6b" },
  medium: { color: "#ffd93d", bg: "#1a1500", dot: "#ffd93d" },
  low:    { color: "#6bcb77", bg: "#0a1a0c", dot: "#6bcb77" },
};

const statusConfig: Record<string, { color: string; bg: string }> = {
  pending:     { color: "#94a3b8", bg: "#0f172a" },
  in_progress: { color: "#4cc9f0", bg: "#0a1628" },
  resolved:    { color: "#6bcb77", bg: "#0a1a0c" },
  closed:      { color: "#a78bfa", bg: "#120a1a" },
  rejected:    { color: "#ff6b6b", bg: "#1a0a0a" },
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<number>(0);
  useEffect(() => {
    const target = value;
    const duration = 1000;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      ref.current = Math.round(ease * target);
      setDisplay(ref.current);
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <>{display}</>;
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  const fetchComplaints = async () => {
    const data = await getComplaints();
    setComplaints(data);
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchComplaints();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const stats = useMemo(() => ({
    total:    complaints.length,
    high:     complaints.filter(c => c.priority === "high").length,
    pending:  complaints.filter(c => c.status === "pending").length,
    resolved: complaints.filter(c => c.status === "resolved").length,
  }), [complaints]);

  const filtered = useMemo(() => {
    if (filter === "all") return complaints;
    return complaints.filter(c => c.priority === filter || c.status === filter);
  }, [complaints, filter]);

  const handleStatusChange = async (id: string, status: string) => {
    await (supabase as any).from("complaints").update({ status }).eq("id", id);
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status } : c));
  };

  const statCards = [
    { label: "Total",     value: stats.total,    icon: FileText,     accent: "#4cc9f0", track: "#0a1628" },
    { label: "High Risk", value: stats.high,     icon: AlertTriangle, accent: "#ff6b6b", track: "#1a0a0a" },
    { label: "Pending",   value: stats.pending,  icon: Clock,         accent: "#ffd93d", track: "#1a1500" },
    { label: "Resolved",  value: stats.resolved, icon: CheckCircle,   accent: "#6bcb77", track: "#0a1a0c" },
  ];

  const filters = [
    { key: "all",         label: "All" },
    { key: "high",        label: "🔴 High" },
    { key: "pending",     label: "⏳ Pending" },
    { key: "in_progress", label: "🔵 In Progress" },
    { key: "resolved",    label: "✅ Resolved" },
  ];

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", minHeight:"80vh", flexDirection:"column", gap:20 }}>
      <div style={{ position:"relative", width:56, height:56 }}>
        <div style={{ position:"absolute", inset:0, border:"3px solid #0f2035", borderTopColor:"#4cc9f0", borderRadius:"50%", animation:"spin 0.7s linear infinite" }} />
        <div style={{ position:"absolute", inset:8, border:"2px solid #0f2035", borderBottomColor:"#a78bfa", borderRadius:"50%", animation:"spin 1.1s linear infinite reverse" }} />
      </div>
      <p style={{ color:"#475569", fontFamily:"DM Sans,sans-serif", fontSize:"0.9rem" }}>Loading dashboard...</p>
      <style>{`@keyframes spin { to { transform:rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight:"100vh", padding:"0 0 60px", fontFamily:"DM Sans,sans-serif" }}>

      {/* ── TOP BAR ── */}
      <div style={{
        background:"#050d1a",
        borderBottom:"1px solid #0f2035",
        padding:"24px 40px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        position:"sticky", top:64, zIndex:10,
        opacity: mounted ? 1 : 0,
        transform: mounted ? "translateY(0)" : "translateY(-10px)",
        transition:"opacity 0.5s ease, transform 0.5s ease"
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:16 }}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:"linear-gradient(135deg, #4cc9f0 0%, #7b2ff7 100%)",
            display:"flex", alignItems:"center", justifyContent:"center",
            boxShadow:"0 0 20px rgba(76,201,240,0.3)"
          }}>
            <Shield size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin:0, fontSize:"1.4rem", fontWeight:800, fontFamily:"Syne,sans-serif", color:"#f1f5f9", letterSpacing:"-0.03em" }}>
              Command Center
            </h1>
            <p style={{ margin:0, fontSize:"0.78rem", color:"#475569" }}>
              CivicAI — Admin Dashboard
            </p>
          </div>
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:12 }}>
          {/* Live indicator */}
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"6px 14px", background:"rgba(107,203,119,0.08)", border:"1px solid rgba(107,203,119,0.2)", borderRadius:20 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:"#6bcb77", boxShadow:"0 0 8px #6bcb77", animation:"ping 1.5s ease-in-out infinite" }} />
            <span style={{ fontSize:"0.72rem", color:"#6bcb77", fontWeight:700, letterSpacing:"0.05em" }}>LIVE</span>
          </div>

          <button onClick={() => { setRefreshing(true); fetchComplaints(); }} style={{
            display:"flex", alignItems:"center", gap:8, padding:"8px 18px",
            background:"#0a1628", border:"1px solid #1a2d4a",
            borderRadius:10, color:"#4cc9f0", cursor:"pointer", fontSize:"0.82rem", fontWeight:600,
            transition:"all 0.2s"
          }}>
            <RefreshCw size={14} style={{ animation: refreshing ? "spin 0.8s linear infinite" : "none" }} />
            Refresh
          </button>
        </div>
      </div>

      <div style={{ padding:"32px 40px" }}>

        {/* ── STAT CARDS ── */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))", gap:16, marginBottom:32 }}>
          {statCards.map(({ label, value, icon: Icon, accent, track }, i) => (
            <div key={label} style={{
              background:"#050d1a",
              border:`1px solid #0f2035`,
              borderRadius:16,
              padding:"24px 20px",
              position:"relative",
              overflow:"hidden",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition:`opacity 0.5s ${i * 0.1}s ease, transform 0.5s ${i * 0.1}s ease`,
              cursor:"default"
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = accent + "44";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px ${accent}18`;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#0f2035";
              (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
            }}>
              {/* bg circle */}
              <div style={{ position:"absolute", top:-30, right:-30, width:100, height:100, borderRadius:"50%", background:accent, opacity:0.05, filter:"blur(20px)" }} />

              {/* top row */}
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:16 }}>
                <span style={{ fontSize:"0.72rem", fontWeight:700, color:"#475569", textTransform:"uppercase", letterSpacing:"0.08em" }}>{label}</span>
                <div style={{ padding:8, borderRadius:10, background: track }}>
                  <Icon size={16} color={accent} />
                </div>
              </div>

              {/* number */}
              <div style={{ fontSize:"2.8rem", fontWeight:800, fontFamily:"Syne,sans-serif", color:accent, lineHeight:1, marginBottom:12 }}>
                <AnimatedNumber value={value} />
              </div>

              {/* progress bar */}
              <div style={{ height:3, background:"#0f2035", borderRadius:2, overflow:"hidden" }}>
                <div style={{
                  height:"100%", borderRadius:2, background:accent,
                  width: stats.total > 0 ? `${(value/stats.total)*100}%` : "0%",
                  transition:"width 1.2s cubic-bezier(0.16,1,0.3,1)",
                  boxShadow:`0 0 8px ${accent}`
                }} />
              </div>
            </div>
          ))}
        </div>

        {/* ── QUICK STATS ROW ── */}
        <div style={{
          display:"flex", gap:12, marginBottom:24, flexWrap:"wrap",
          opacity: mounted ? 1 : 0,
          transition:"opacity 0.6s 0.4s ease"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", background:"#050d1a", border:"1px solid #0f2035", borderRadius:10 }}>
            <TrendingUp size={14} color="#4cc9f0" />
            <span style={{ fontSize:"0.78rem", color:"#64748b" }}>
              Resolution rate: <strong style={{ color:"#6bcb77" }}>
                {stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0}%
              </strong>
            </span>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:8, padding:"8px 16px", background:"#050d1a", border:"1px solid #0f2035", borderRadius:10 }}>
            <AlertTriangle size={14} color="#ffd93d" />
            <span style={{ fontSize:"0.78rem", color:"#64748b" }}>
              High priority: <strong style={{ color:"#ffd93d" }}>
                {stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0}%
              </strong>
            </span>
          </div>
        </div>

        {/* ── COMPLAINTS TABLE ── */}
        <div style={{
          background:"#050d1a",
          border:"1px solid #0f2035",
          borderRadius:16,
          overflow:"hidden",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0)" : "translateY(20px)",
          transition:"opacity 0.6s 0.5s ease, transform 0.6s 0.5s ease"
        }}>

          {/* table header */}
          <div style={{ padding:"20px 24px", borderBottom:"1px solid #0f2035", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <Filter size={16} color="#475569" />
              <h2 style={{ margin:0, fontFamily:"Syne,sans-serif", fontSize:"1rem", fontWeight:700, color:"#f1f5f9" }}>
                Complaints
              </h2>
              <span style={{ background:"rgba(76,201,240,0.1)", border:"1px solid rgba(76,201,240,0.2)", borderRadius:20, padding:"2px 10px", fontSize:"0.7rem", color:"#4cc9f0", fontWeight:700 }}>
                {filtered.length}
              </span>
            </div>

            {/* filter pills */}
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {filters.map(f => (
                <button key={f.key} onClick={() => setFilter(f.key)} style={{
                  padding:"5px 14px", borderRadius:20, fontSize:"0.73rem", fontWeight:600,
                  cursor:"pointer", letterSpacing:"0.02em", transition:"all 0.2s",
                  background: filter === f.key ? "#4cc9f0" : "transparent",
                  border: filter === f.key ? "1px solid #4cc9f0" : "1px solid #1a2d4a",
                  color: filter === f.key ? "#020814" : "#64748b",
                  boxShadow: filter === f.key ? "0 4px 14px rgba(76,201,240,0.3)" : "none",
                }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding:60, textAlign:"center" }}>
              <FileText size={36} color="#1a2d4a" style={{ margin:"0 auto 12px", display:"block" }} />
              <p style={{ color:"#475569", fontSize:"0.9rem" }}>No complaints found.</p>
            </div>
          ) : (
            <div style={{ overflowX:"auto" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ borderBottom:"1px solid #0f2035" }}>
                    {["#","Name","Issue","Location","Dept","Priority","Status","Date"].map(h => (
                      <th key={h} style={{ padding:"10px 16px", textAlign:"left", fontSize:"0.65rem", fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#334155", whiteSpace:"nowrap" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c, i) => {
                    const pri = priorityConfig[c.priority?.toLowerCase()] || priorityConfig.low;
                    const sta = statusConfig[c.status?.toLowerCase()] || statusConfig.pending;
                    return (
                      <tr key={c.id}
                        style={{ borderBottom:"1px solid #070f1c", transition:"background 0.15s", animation:`rowIn 0.3s ${i*0.025}s both` }}
                        onMouseEnter={e => (e.currentTarget.style.background = "#08131f")}
                        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>

                        <td style={{ padding:"12px 16px", fontSize:"0.72rem", color:"#334155", fontFamily:"monospace" }}>
                          {c.id.slice(0,6)}
                        </td>

                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ fontSize:"0.85rem", fontWeight:600, color:"#e2e8f0" }}>{c.name}</span>
                        </td>

                        <td style={{ padding:"12px 16px", maxWidth:180, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                          <span style={{ fontSize:"0.82rem", color:"#64748b" }}>{c.complaint_text}</span>
                        </td>

                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ fontSize:"0.82rem", color:"#64748b" }}>{c.location}</span>
                        </td>

                        <td style={{ padding:"12px 16px" }}>
                          <span style={{ fontSize:"0.7rem", fontWeight:700, padding:"3px 9px", borderRadius:5, background:"rgba(139,92,246,0.1)", color:"#a78bfa", border:"1px solid rgba(139,92,246,0.2)", textTransform:"uppercase", letterSpacing:"0.05em" }}>
                            {c.department}
                          </span>
                        </td>

                        <td style={{ padding:"12px 16px" }}>
                          <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                            <div style={{ width:6, height:6, borderRadius:"50%", background:pri.dot, boxShadow:`0 0 6px ${pri.dot}` }} />
                            <span style={{ fontSize:"0.72rem", fontWeight:700, color:pri.color, textTransform:"uppercase", letterSpacing:"0.05em" }}>
                              {c.priority}
                            </span>
                          </div>
                        </td>

                        <td style={{ padding:"12px 16px" }}>
                          <select value={c.status} onChange={e => handleStatusChange(c.id, e.target.value)} style={{
                            padding:"5px 10px", borderRadius:7, fontSize:"0.75rem", fontWeight:700,
                            background: sta.bg, color: sta.color, border:`1px solid ${sta.color}33`,
                            cursor:"pointer", outline:"none", textTransform:"capitalize",
                            fontFamily:"DM Sans,sans-serif"
                          }}>
                            <option value="pending">⏳ Pending</option>
                            <option value="in_progress">🔵 In Progress</option>
                            <option value="resolved">✅ Resolved</option>
                            <option value="closed">🔒 Closed</option>
                            <option value="rejected">❌ Rejected</option>
                          </select>
                        </td>

                        <td style={{ padding:"12px 16px", fontSize:"0.75rem", color:"#334155", whiteSpace:"nowrap" }}>
                          {c.created_at ? new Date(c.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short" }) : "—"}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin   { to { transform: rotate(360deg); } }
        @keyframes ping   { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.6;transform:scale(1.3)} }
        @keyframes rowIn  { from{opacity:0;transform:translateX(-8px)} to{opacity:1;transform:translateX(0)} }
      `}</style>
    </div>
  );
}
