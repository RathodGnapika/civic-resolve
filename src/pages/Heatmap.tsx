import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";
import { supabase } from "@/integrations/supabase/client";
import "leaflet/dist/leaflet.css";
import { type Complaint } from "@/lib/complaints";
import { AlertTriangle, MapPin, TrendingUp, CheckCircle, Filter } from "lucide-react";

type PriorityStyle = { fill: string; border: string; bg: string; text: string };

const PRIORITY: Record<string, PriorityStyle> = {
  high:   { fill: "#ef4444", border: "#dc2626", bg: "#fef2f2", text: "#991b1b" },
  medium: { fill: "#f59e0b", border: "#d97706", bg: "#fffbeb", text: "#92400e" },
  low:    { fill: "#22c55e", border: "#16a34a", bg: "#f0fdf4", text: "#166534" },
};

const CITIES: Record<string, [number, number]> = {
  "market road": [15.5057, 78.4870],
  "hyderbad":    [17.3850, 78.4867],
  "hyderabad":   [17.3850, 78.4867],
  "ongole":      [15.5057, 80.0499],
  "vijayawada":  [16.5062, 80.6480],
  "bangalore":   [12.9716, 77.5946],
  "bengaluru":   [12.9716, 77.5946],
  "chennai":     [13.0827, 80.2707],
  "mumbai":      [19.0760, 72.8777],
  "delhi":       [28.7041, 77.1025],
  "kolkata":     [22.5726, 88.3639],
  "pune":        [18.5204, 73.8567],
  "ahmedabad":   [23.0225, 72.5714],
  "jaipur":      [26.9124, 75.7873],
  "surat":       [21.1702, 72.8311],
  "lucknow":     [26.8467, 80.9462],
};

function guessCoords(location: string): [number, number] | null {
  const l = location.toLowerCase();
  for (const [key, coords] of Object.entries(CITIES)) {
    if (l.includes(key)) return coords;
  }
  return null;
}

function AnimatedCounter({ value, color }: { value: number; color: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const duration = 800;
    const start = Date.now();
    const tick = () => {
      const progress = Math.min((Date.now() - start) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(ease * value));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [value]);
  return <span style={{ color }}>{display}</span>;
}

type MappedComplaint = Complaint & { latitude: number; longitude: number };

export default function Heatmap() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await (supabase as any)
        .from("complaints")
        .select("*")
        .order("created_at", { ascending: false });
      setComplaints(data || []);
      setLoading(false);
      setTimeout(() => setMounted(true), 100);
    };
    fetchData();
  }, []);

  const mapped: MappedComplaint[] = complaints.map(c => {
    if (c.latitude && c.longitude) return c as MappedComplaint;
    const guessed = guessCoords(c.location || "");
    if (guessed) return {
      ...c,
      latitude:  guessed[0] + (Math.random() - 0.5) * 0.06,
      longitude: guessed[1] + (Math.random() - 0.5) * 0.06,
    } as MappedComplaint;
    return null;
  }).filter((c): c is MappedComplaint => c !== null);

  const filtered = filter === "all"
    ? mapped
    : mapped.filter(c => c.priority?.toLowerCase() === filter);

  const stats = {
    total:  mapped.length,
    high:   mapped.filter(c => c.priority?.toLowerCase() === "high").length,
    medium: mapped.filter(c => c.priority?.toLowerCase() === "medium").length,
    low:    mapped.filter(c => c.priority?.toLowerCase() === "low").length,
  };

  const statCards = [
    { label: "Total Mapped",    value: stats.total,  color: "#3b82f6", bg: "#eff6ff", border: "#bfdbfe", icon: MapPin },
    { label: "High Priority",   value: stats.high,   color: "#ef4444", bg: "#fef2f2", border: "#fecaca", icon: AlertTriangle },
    { label: "Medium Priority", value: stats.medium, color: "#f59e0b", bg: "#fffbeb", border: "#fde68a", icon: TrendingUp },
    { label: "Low Priority",    value: stats.low,    color: "#22c55e", bg: "#f0fdf4", border: "#bbf7d0", icon: CheckCircle },
  ];

  const filters = [
    { key: "all",    label: "All Complaints", count: stats.total },
    { key: "high",   label: "🔴 High",         count: stats.high },
    { key: "medium", label: "🟡 Medium",        count: stats.medium },
    { key: "low",    label: "🟢 Low",           count: stats.low },
  ];

  return (
    <div style={{ minHeight:"100vh", background:"#f8fafc", fontFamily:"DM Sans,sans-serif", padding:"32px 40px 60px" }}>

      {/* HEADER */}
      <div style={{ marginBottom:32, opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(-16px)", transition:"all 0.5s ease" }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:"linear-gradient(135deg,#3b82f6,#1d4ed8)", display:"flex", alignItems:"center", justifyContent:"center", boxShadow:"0 4px 14px rgba(59,130,246,0.35)" }}>
            <MapPin size={20} color="white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 style={{ margin:0, fontFamily:"Syne,sans-serif", fontSize:"1.7rem", fontWeight:800, color:"#0f172a", letterSpacing:"-0.03em" }}>
              Complaint Heatmap
            </h1>
            <p style={{ margin:0, color:"#64748b", fontSize:"0.82rem" }}>Live map of civic issues across locations</p>
          </div>
        </div>
      </div>

      {/* STAT CARDS */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))", gap:14, marginBottom:28 }}>
        {statCards.map(({ label, value, color, bg, border, icon: Icon }, i) => (
          <div key={label} style={{
            background:"#fff", border:`1px solid ${border}`, borderRadius:14,
            padding:"18px 20px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)",
            opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)",
            transition:`all 0.5s ${i*0.08}s ease`, cursor:"default",
          }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform="translateY(-3px)"; el.style.boxShadow=`0 8px 24px ${color}22`; }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLDivElement; el.style.transform="translateY(0)"; el.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)"; }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:12 }}>
              <span style={{ fontSize:"0.7rem", fontWeight:700, color:"#94a3b8", textTransform:"uppercase", letterSpacing:"0.07em" }}>{label}</span>
              <div style={{ padding:7, borderRadius:9, background:bg }}><Icon size={14} color={color} /></div>
            </div>
            <div style={{ fontSize:"2.2rem", fontWeight:800, fontFamily:"Syne,sans-serif", lineHeight:1 }}>
              <AnimatedCounter value={value} color={color} />
            </div>
            <div style={{ height:3, background:"#f1f5f9", borderRadius:2, marginTop:12, overflow:"hidden" }}>
              <div style={{ height:"100%", background:color, borderRadius:2, width:stats.total>0?`${(value/stats.total)*100}%`:"0%", transition:"width 1.2s cubic-bezier(0.16,1,0.3,1)" }} />
            </div>
          </div>
        ))}
      </div>

      {/* MAP CARD */}
      <div style={{ background:"#fff", borderRadius:20, border:"1px solid #e2e8f0", boxShadow:"0 4px 24px rgba(0,0,0,0.07)", overflow:"hidden", opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(24px)", transition:"all 0.6s 0.35s ease" }}>

        {/* toolbar */}
        <div style={{ padding:"16px 24px", borderBottom:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div style={{ display:"flex", alignItems:"center", gap:8 }}>
            <Filter size={15} color="#94a3b8" />
            <span style={{ fontSize:"0.82rem", fontWeight:700, color:"#475569" }}>Filter by priority</span>
          </div>
          <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
            {filters.map(f => (
              <button key={f.key} onClick={() => setFilter(f.key)} style={{
                padding:"6px 14px", borderRadius:20, fontSize:"0.75rem", fontWeight:700,
                cursor:"pointer", transition:"all 0.2s", display:"flex", alignItems:"center", gap:6,
                background: filter===f.key ? "#3b82f6" : "#f8fafc",
                border:`1px solid ${filter===f.key ? "#3b82f6" : "#e2e8f0"}`,
                color: filter===f.key ? "#fff" : "#64748b",
                boxShadow: filter===f.key ? "0 4px 12px rgba(59,130,246,0.3)" : "none",
              }}>
                {f.label}
                <span style={{ background:filter===f.key?"rgba(255,255,255,0.25)":"#e2e8f0", color:filter===f.key?"#fff":"#64748b", borderRadius:10, padding:"1px 7px", fontSize:"0.65rem", fontWeight:800 }}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>
          <div style={{ display:"flex", gap:14 }}>
            {[{color:"#ef4444",label:"High"},{color:"#f59e0b",label:"Medium"},{color:"#22c55e",label:"Low"}].map(({ color, label }) => (
              <div key={label} style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:10, height:10, borderRadius:"50%", background:color, boxShadow:`0 0 6px ${color}88` }} />
                <span style={{ fontSize:"0.73rem", color:"#94a3b8", fontWeight:500 }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* map */}
        {loading ? (
          <div style={{ height:520, display:"flex", alignItems:"center", justifyContent:"center", background:"#f8fafc" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ width:40, height:40, border:"3px solid #e2e8f0", borderTopColor:"#3b82f6", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 12px" }} />
              <p style={{ color:"#94a3b8", fontSize:"0.85rem" }}>Loading map data...</p>
            </div>
          </div>
        ) : (
          <MapContainer center={[17.3850, 78.4867]} zoom={6} style={{ height:520, width:"100%" }} zoomControl={false}>
            <ZoomControl position="bottomright" />
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://carto.com/">CARTO</a>'
            />
            {filtered.map((c) => {
              const pri = PRIORITY[c.priority?.toLowerCase()] || PRIORITY.low;
              const radius = c.priority?.toLowerCase() === "high" ? 16 : c.priority?.toLowerCase() === "medium" ? 12 : 8;
              return (
                <CircleMarker key={c.id} center={[c.latitude, c.longitude]} radius={radius}
                  pathOptions={{ color:pri.border, fillColor:pri.fill, fillOpacity:0.8, weight:2 }}>
                  <Popup>
                    <div style={{ fontFamily:"DM Sans,sans-serif", minWidth:200, padding:4 }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                        <div style={{ width:8, height:8, borderRadius:"50%", background:pri.fill }} />
                        <span style={{ fontWeight:700, fontSize:"0.92rem", color:"#0f172a" }}>{c.name}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:6 }}>
                        <MapPin size={12} color="#94a3b8" />
                        <span style={{ color:"#64748b", fontSize:"0.8rem" }}>{c.location}</span>
                      </div>
                      <p style={{ color:"#475569", fontSize:"0.82rem", marginBottom:10, lineHeight:1.4, borderLeft:`3px solid ${pri.fill}`, paddingLeft:8 }}>
                        {c.complaint_text}
                      </p>
                      <div style={{ display:"flex", gap:6 }}>
                        <span style={{ background:pri.bg, color:pri.text, padding:"3px 10px", borderRadius:6, fontSize:"0.7rem", fontWeight:700 }}>
                          {c.priority?.toUpperCase()}
                        </span>
                        <span style={{ background:"#f1f5f9", color:"#475569", padding:"3px 10px", borderRadius:6, fontSize:"0.7rem", fontWeight:600 }}>
                          {c.status?.replace("_"," ")}
                        </span>
                      </div>
                      {c.created_at && (
                        <p style={{ color:"#cbd5e1", fontSize:"0.7rem", marginTop:8, marginBottom:0 }}>
                          {new Date(c.created_at).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}
                        </p>
                      )}
                    </div>
                  </Popup>
                </CircleMarker>
              );
            })}
          </MapContainer>
        )}

        <div style={{ padding:"12px 24px", borderTop:"1px solid #f1f5f9", display:"flex", justifyContent:"space-between", alignItems:"center", background:"#fafbfc" }}>
          <span style={{ fontSize:"0.75rem", color:"#94a3b8" }}>Showing <strong style={{ color:"#475569" }}>{filtered.length}</strong> complaints on map</span>
          <span style={{ fontSize:"0.73rem", color:"#cbd5e1" }}>Click any marker for details</span>
        </div>
      </div>

      {mapped.length === 0 && !loading && (
        <div style={{ marginTop:16, padding:"16px 20px", background:"#fffbeb", border:"1px solid #fde68a", borderRadius:12, display:"flex", alignItems:"center", gap:10 }}>
          <AlertTriangle size={16} color="#f59e0b" />
          <p style={{ color:"#92400e", fontSize:"0.85rem", margin:0 }}>
            No complaints are mapped yet. Submit complaints with city names like "Hyderabad", "Vijayawada", "Bangalore" to see them here!
          </p>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .leaflet-popup-content-wrapper { border-radius: 12px !important; box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important; border: 1px solid #e2e8f0 !important; }
        .leaflet-popup-tip { background: white !important; }
        .leaflet-control-zoom a { border-radius: 8px !important; color: #475569 !important; }
      `}</style>
    </div>
  );
}
