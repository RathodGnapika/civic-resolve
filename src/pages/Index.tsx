import { Link } from "react-router-dom";
import { FileText, Brain, BarChart3, Search, ArrowRight, Map, Shield, TrendingUp, CheckCircle, Users, Zap } from "lucide-react";

const features = [
  { icon: FileText,  title: "Submit Complaints",  desc: "Report civic issues easily with your location and description in seconds.", color: "#2563eb", bg: "#eff6ff" },
  { icon: Brain,     title: "AI Classification",  desc: "Automatic department routing and priority detection powered by AI.",       color: "#7c3aed", bg: "#f5f3ff" },
  { icon: BarChart3, title: "Admin Dashboard",    desc: "Authorities view, manage, and resolve complaints in real time.",           color: "#d97706", bg: "#fffbeb" },
  { icon: Search,    title: "Track Status",       desc: "Citizens track complaint progress anytime using their complaint ID.",      color: "#059669", bg: "#ecfdf5" },
];

const stats = [
  { value: "500+", label: "Complaints Resolved",  icon: CheckCircle, color: "#059669" },
  { value: "98%",  label: "AI Accuracy",           icon: Zap,         color: "#7c3aed" },
  { value: "24h",  label: "Avg Resolution Time",   icon: TrendingUp,  color: "#2563eb" },
  { value: "12",   label: "Depts Connected",       icon: Users,       color: "#d97706" },
];

export default function Index() {
  return (
    <div style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", background:"#f8fafc", minHeight:"100vh", color:"#0f172a" }}>

      {/* ── HERO ── */}
      <section style={{ background:"#ffffff", borderBottom:"1px solid #e2e8f0", padding:"90px 24px 100px", textAlign:"center", position:"relative", overflow:"hidden" }}>

        {/* subtle dot grid */}
        <div style={{ position:"absolute", inset:0, backgroundImage:"radial-gradient(#e2e8f0 1px, transparent 1px)", backgroundSize:"28px 28px", opacity:0.6, pointerEvents:"none" }} />

        {/* blue top accent bar */}
        <div style={{ position:"absolute", top:0, left:0, right:0, height:4, background:"linear-gradient(90deg, #0f2044, #2563eb, #f97316)" }} />

        <div style={{ maxWidth:700, margin:"0 auto", position:"relative", zIndex:1 }}>

          {/* badge */}
          <div style={{ display:"inline-flex", alignItems:"center", gap:8, padding:"6px 16px", borderRadius:20, border:"1px solid #dbeafe", background:"#eff6ff", marginBottom:32 }}>
            <Shield size={13} color="#2563eb" />
            <span style={{ fontSize:"0.78rem", fontWeight:700, color:"#2563eb", letterSpacing:"0.04em", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>AI-Powered Civic Platform</span>
          </div>

          {/* heading */}
          <h1 style={{ fontFamily:"'Plus Jakarta Sans', sans-serif", fontSize:"clamp(2.4rem, 6vw, 4.2rem)", fontWeight:800, lineHeight:1.1, marginBottom:22, letterSpacing:"-0.03em", color:"#0f2044" }}>
            Smarter Cities Start<br />with{" "}
            <span style={{ color:"#f97316" }}>CivicAI</span>
          </h1>

          <p style={{ fontSize:"1.05rem", color:"#64748b", lineHeight:1.75, maxWidth:520, margin:"0 auto 44px", fontFamily:"'Plus Jakarta Sans',sans-serif", fontWeight:400 }}>
            Report civic issues. AI categorizes and prioritizes them automatically. Authorities resolve them faster.
          </p>

          {/* buttons */}
          <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/submit" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"13px 26px", borderRadius:10, fontWeight:700, fontSize:"0.92rem",
              background:"#f97316", color:"#fff", textDecoration:"none",
              border:"2px solid #f97316", transition:"all 0.2s",
              fontFamily:"'Plus Jakarta Sans',sans-serif",
              boxShadow:"0 2px 12px rgba(249,115,22,0.25)"
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background="#ea580c"; el.style.borderColor="#ea580c"; el.style.transform="translateY(-2px)"; el.style.boxShadow="0 6px 20px rgba(249,115,22,0.35)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background="#f97316"; el.style.borderColor="#f97316"; el.style.transform="translateY(0)"; el.style.boxShadow="0 2px 12px rgba(249,115,22,0.25)"; }}>
              Report an Issue <ArrowRight size={15} />
            </Link>

            <Link to="/track" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"13px 26px", borderRadius:10, fontWeight:700, fontSize:"0.92rem",
              background:"#fff", color:"#334155", textDecoration:"none",
              border:"2px solid #e2e8f0", transition:"all 0.2s",
              fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor="#2563eb"; el.style.color="#2563eb"; el.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.borderColor="#e2e8f0"; el.style.color="#334155"; el.style.transform="translateY(0)"; }}>
              <Search size={15} /> Track Complaint
            </Link>

            <Link to="/heatmap" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"13px 26px", borderRadius:10, fontWeight:700, fontSize:"0.92rem",
              background:"#fff", color:"#2563eb", textDecoration:"none",
              border:"2px solid #dbeafe", transition:"all 0.2s",
              fontFamily:"'Plus Jakarta Sans',sans-serif"
            }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background="#eff6ff"; el.style.transform="translateY(-2px)"; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background="#fff"; el.style.transform="translateY(0)"; }}>
              <Map size={15} /> View Heatmap
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ background:"#0f2044", padding:"40px 24px" }}>
        <div style={{ maxWidth:900, margin:"0 auto", display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(160px, 1fr))", gap:2 }}>
          {stats.map(({ value, label, icon: Icon, color }, i) => (
            <div key={label} style={{
              textAlign:"center", padding:"28px 20px",
              borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.08)" : "none"
            }}>
              <Icon size={18} color={color} style={{ margin:"0 auto 10px", display:"block" }} />
              <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"2rem", fontWeight:800, color:"#fff", lineHeight:1, marginBottom:6 }}>{value}</div>
              <div style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.45)", fontWeight:500 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding:"80px 24px", background:"#f8fafc" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>

          <div style={{ textAlign:"center", marginBottom:56 }}>
            <span style={{ fontSize:"0.72rem", fontWeight:800, color:"#2563eb", textTransform:"uppercase", letterSpacing:"0.12em", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              How It Works
            </span>
            <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"2rem", fontWeight:800, color:"#0f2044", marginTop:10, marginBottom:12, letterSpacing:"-0.02em" }}>
              From Report to Resolution
            </h2>
            <p style={{ color:"#64748b", fontSize:"0.95rem", maxWidth:440, margin:"0 auto", fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
              Our AI-powered pipeline handles everything automatically
            </p>
          </div>

          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))", gap:20 }}>
            {features.map(({ icon: Icon, title, desc, color, bg }, i) => (
              <div key={title} style={{
                background:"#fff", borderRadius:16, padding:"28px 24px",
                border:"1px solid #e2e8f0",
                boxShadow:"0 1px 4px rgba(15,32,68,0.06)",
                position:"relative", overflow:"hidden",
                transition:"all 0.25s", cursor:"default"
              }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor=color+"55"; el.style.transform="translateY(-5px)"; el.style.boxShadow=`0 12px 32px ${color}18`; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.borderColor="#e2e8f0"; el.style.transform="translateY(0)"; el.style.boxShadow="0 1px 4px rgba(15,32,68,0.06)"; }}>

                {/* step watermark */}
                <div style={{ position:"absolute", top:12, right:16, fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"3.5rem", fontWeight:800, color:"#f8fafc", lineHeight:1, userSelect:"none", zIndex:0 }}>
                  {i + 1}
                </div>

                <div style={{ width:46, height:46, borderRadius:12, background:bg, display:"flex", alignItems:"center", justifyContent:"center", marginBottom:18, border:`1px solid ${color}22`, position:"relative", zIndex:1 }}>
                  <Icon size={21} color={color} />
                </div>

                <h3 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"1rem", fontWeight:700, color:"#0f2044", marginBottom:8, position:"relative", zIndex:1 }}>{title}</h3>
                <p style={{ fontSize:"0.85rem", color:"#64748b", lineHeight:1.65, fontFamily:"'Plus Jakarta Sans',sans-serif", position:"relative", zIndex:1 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background:"#fff", borderTop:"1px solid #e2e8f0", padding:"80px 24px", textAlign:"center" }}>
        <div style={{ maxWidth:520, margin:"0 auto" }}>
          <div style={{ width:52, height:52, borderRadius:14, background:"#eff6ff", border:"1px solid #dbeafe", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
            <Shield size={22} color="#2563eb" />
          </div>
          <h2 style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", fontSize:"1.9rem", fontWeight:800, color:"#0f2044", marginBottom:14, letterSpacing:"-0.02em" }}>
            Ready to make your city smarter?
          </h2>
          <p style={{ color:"#64748b", marginBottom:32, fontSize:"0.95rem", lineHeight:1.7, fontFamily:"'Plus Jakarta Sans',sans-serif" }}>
            Submit your first complaint and see AI in action.
          </p>
          <Link to="/submit" style={{
            display:"inline-flex", alignItems:"center", gap:8,
            padding:"14px 32px", borderRadius:10, fontWeight:700, fontSize:"0.95rem",
            background:"#0f2044", color:"#fff", textDecoration:"none",
            border:"2px solid #0f2044", transition:"all 0.2s",
            fontFamily:"'Plus Jakarta Sans',sans-serif",
            boxShadow:"0 2px 12px rgba(15,32,68,0.2)"
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background="#1a3a6b"; el.style.borderColor="#1a3a6b"; el.style.transform="translateY(-2px)"; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLAnchorElement; el.style.background="#0f2044"; el.style.borderColor="#0f2044"; el.style.transform="translateY(0)"; }}>
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </section>

    </div>
  );
}

