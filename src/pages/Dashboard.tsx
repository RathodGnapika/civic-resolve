import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { getComplaints, type Complaint } from "@/lib/complaints";
import { supabase } from "@/integrations/supabase/client";
import { AlertTriangle, Clock, CheckCircle, FileText, RefreshCw, TrendingUp, Filter } from "lucide-react";

const priorityConfig: Record<string, { color: string; bg: string; label: string }> = {
  high: { color: "#dc2626", bg: "#fef2f2", label: "HIGH" },
  medium: { color: "#d97706", bg: "#fffbeb", label: "MEDIUM" },
  low: { color: "#16a34a", bg: "#f0fdf4", label: "LOW" },
};

const statusOptions = ["pending", "in_progress", "resolved", "closed", "rejected"];

const statusConfig: Record<string, { color: string; bg: string; label: string; dot: string; emoji: string }> = {
  pending: { color: "#92400e", bg: "#fef3c7", label: "Pending", dot: "#f59e0b", emoji: "⏳" },
  in_progress: { color: "#1e40af", bg: "#dbeafe", label: "In Progress", dot: "#3b82f6", emoji: "🔵" },
  resolved: { color: "#166534", bg: "#dcfce7", label: "Resolved", dot: "#22c55e", emoji: "✅" },
  closed: { color: "#5b4300", bg: "#fef9c3", label: "Closed", dot: "#eab308", emoji: "🔒" },
  rejected: { color: "#991b1b", bg: "#fee2e2", label: "Rejected", dot: "#ef4444", emoji: "❌" },
};

const deptColors: Record<string, { color: string; bg: string }> = {
  ELECTRICITY: { color: "#7c3aed", bg: "#ede9fe" },
  "PUBLIC WORKS": { color: "#0369a1", bg: "#e0f2fe" },
  WATER: { color: "#0e7490", bg: "#cffafe" },
  SANITATION: { color: "#065f46", bg: "#d1fae5" },
  ROADS: { color: "#9a3412", bg: "#ffedd5" },
};

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = Math.ceil(value / (duration / 16));
    const interval = setInterval(() => {
      start += step;
      if (start >= value) { start = value; clearInterval(interval); }
      setDisplay(start);
    }, 16);
    return () => clearInterval(interval);
  }, [value]);
  return <>{display}</>;
}

function StatusDropdown({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const cfg = statusConfig[value] || statusConfig.pending;
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <span style={{
        position: "absolute", left:0, top: "50%", transform: "translateY(-50%)",
        fontSize: "0.85rem", pointerEvents: "none", zIndex: 1,
      }}>{cfg.emoji}</span>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          padding: "7px 30px 7px 42px",
          borderRadius: 10,
          border: `1.5px solid ${cfg.dot}60`,
          background: cfg.bg,
          color: cfg.color,
          fontWeight: 700,
          fontSize: "0.8rem",
          cursor: "pointer",
          outline: "none",
          minWidth: 148,
          appearance: "none",
          WebkitAppearance: "none",
          boxShadow: `0 2px 8px ${cfg.dot}25`,
          transition: "border 0.15s, box-shadow 0.15s",
        }}
      >
        {statusOptions.map(s => (
          <option key={s} value={s}>
            {statusConfig[s].label}
          </option>
        ))}
      </select>
      <span style={{
        position: "absolute", right: 9, top: "50%", transform: "translateY(-50%)",
        pointerEvents: "none", color: cfg.color, fontSize: "0.65rem", opacity: 0.7
      }}>▾</span>
    </div>
  );
}

export default function Dashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");
  const [statuses, setStatuses] = useState<Record<string, string>>({});

  const fetchComplaints = async () => {
    const data = await getComplaints();
    setComplaints(data);
    const initial: Record<string, string> = {};
    data.forEach((c: Complaint) => { initial[c.id] = c.status || "pending"; });
    setStatuses(prev => ({ ...initial, ...prev }));
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => { fetchComplaints(); }, []);

  const stats = useMemo(() => ({
    total: complaints.length,
    high: complaints.filter(c => c.priority === "high").length,
    pending: complaints.filter(c => (statuses[c.id] || c.status) === "pending").length,
    resolved: complaints.filter(c => (statuses[c.id] || c.status) === "resolved").length,
  }), [complaints, statuses]);

  const resolutionRate = stats.total > 0 ? Math.round((stats.resolved / stats.total) * 100) : 0;
  const highPriorityRate = stats.total > 0 ? Math.round((stats.high / stats.total) * 100) : 0;

  const filtered = useMemo(() => {
    if (filter === "all") return complaints;
    if (filter === "high") return complaints.filter(c => c.priority === "high");
    return complaints.filter(c => (statuses[c.id] || c.status) === filter);
  }, [complaints, filter, statuses]);

  const filterButtons = [
    { key: "all", label: "All", dot: "#64748b", emoji: "" },
    { key: "high", label: "High", dot: "#ef4444", emoji: "🔴" },
    { key: "pending", label: "Pending", dot: "#f59e0b", emoji: "⏳" },
    { key: "in_progress", label: "In Progress", dot: "#3b82f6", emoji: "🔵" },
    { key: "resolved", label: "Resolved", dot: "#22c55e", emoji: "✅" },
    { key: "closed", label: "Closed", dot: "#6b7280", emoji: "🔒" },
    { key: "rejected", label: "Rejected", dot: "#ef4444", emoji: "❌" },
  ];

  const getDept = (c: Complaint): string => {
    const text = (c.complaint_text || "").toLowerCase();
    if (text.includes("electric") || text.includes("light")) return "ELECTRICITY";
    if (text.includes("pothole") || text.includes("road") || text.includes("building")) return "PUBLIC WORKS";
    if (text.includes("water")) return "WATER";
    if (text.includes("waste") || text.includes("garbage")) return "SANITATION";
    return "PUBLIC WORKS";
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <RefreshCw size={28} color="#2563eb" />
        </motion.div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      style={{ padding: "30px", background: "#f1f5f9", minHeight: "100vh", fontFamily: "sans-serif" }}
    >

      {/* HEADER */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: "linear-gradient(135deg, #2563eb, #0ea5e9)",
            display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <FileText size={20} color="white" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "#0f172a" }}>Command Center</h1>
            <p style={{ margin: 0, fontSize: "0.75rem", color: "#64748b" }}>CivicAI — Admin Dashboard</p>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* LIVE badge */}
          <motion.div
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "6px 14px", borderRadius: 20,
              background: "#dcfce7", border: "1px solid #86efac",
              color: "#15803d", fontWeight: 700, fontSize: "0.8rem"
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
          </motion.div>

          <motion.button
            onClick={() => { setRefreshing(true); fetchComplaints(); }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "9px 18px", background: "#2563eb", color: "white",
              borderRadius: 8, border: "none", fontWeight: 600,
              cursor: "pointer", fontSize: "0.875rem",
              boxShadow: "0 4px 12px rgba(37,99,235,0.25)"
            }}
          >
            <motion.span animate={refreshing ? { rotate: 360 } : {}} transition={{ repeat: Infinity, duration: 0.8 }}>
              <RefreshCw size={15} />
            </motion.span>
            Refresh
          </motion.button>
        </div>
      </motion.div>

      {/* STAT CARDS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 20 }}>
        {[
          { label: "TOTAL", value: stats.total, icon: FileText, accent: "#2563eb", light: "#dbeafe" },
          { label: "HIGH RISK", value: stats.high, icon: AlertTriangle, accent: "#ef4444", light: "#fee2e2" },
          { label: "PENDING", value: stats.pending, icon: Clock, accent: "#f59e0b", light: "#fef3c7" },
          { label: "RESOLVED", value: stats.resolved, icon: CheckCircle, accent: "#22c55e", light: "#dcfce7" },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
            style={{
              background: "white", padding: "20px 22px", borderRadius: 14,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0",
              borderTop: `3px solid ${card.accent}`, position: "relative", overflow: "hidden"
            }}
          >
            <div style={{
              position: "absolute", top: 16, right: 16,
              width: 36, height: 36, borderRadius: 10,
              background: card.light, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <card.icon size={18} color={card.accent} />
            </div>
            <p style={{ margin: "0 0 6px", fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>
              {card.label}
            </p>
            <h2 style={{ margin: 0, fontSize: "2.2rem", fontWeight: 800, color: card.accent, lineHeight: 1 }}>
              <AnimatedNumber value={card.value} />
            </h2>
            <div style={{ marginTop: 10, height: 3, borderRadius: 2, background: card.light }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.total ? (card.value / stats.total) * 100 : 0}%` }}
                transition={{ delay: i * 0.1 + 0.4, duration: 0.6 }}
                style={{ height: "100%", borderRadius: 2, background: card.accent }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* RESOLUTION RATE BADGES */}
      <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "7px 14px", borderRadius: 8,
          background: "#f0fdf4", border: "1px solid #bbf7d0"
        }}>
          <TrendingUp size={14} color="#16a34a" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#15803d" }}>
            Resolution rate: {resolutionRate}%
          </span>
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 7,
          padding: "7px 14px", borderRadius: 8,
          background: "#fefce8", border: "1px solid #fde047"
        }}>
          <AlertTriangle size={14} color="#ca8a04" />
          <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#a16207" }}>
            High priority: {highPriorityRate}%
          </span>
        </div>
      </div>

      {/* COMPLAINTS TABLE */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ background: "white", borderRadius: 14, boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "1px solid #e2e8f0", overflow: "hidden" }}
      >
        {/* Table header with filter */}
        <div style={{
          padding: "18px 22px", borderBottom: "1px solid #f1f5f9"
        }}>
          {/* Title row */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Filter size={16} color="#2563eb" />
              <span style={{ fontWeight: 700, color: "#0f172a", fontSize: "0.95rem" }}>Complaints</span>
              <span style={{
                background: "#2563eb", color: "white",
                borderRadius: 20, padding: "2px 9px", fontSize: "0.75rem", fontWeight: 700
              }}>{complaints.length}</span>
            </div>
          </div>

          {/* Filter buttons */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
            {filterButtons.map(btn => (
              <motion.button
                key={btn.key}
                onClick={() => setFilter(btn.key)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                style={{
                  display: "flex", alignItems: "center", gap: 5,
                  padding: "6px 13px", borderRadius: 20, border: "1px solid",
                  cursor: "pointer", fontSize: "0.78rem", fontWeight: 600,
                  transition: "all 0.15s",
                  background: filter === btn.key ? btn.dot : "white",
                  color: filter === btn.key ? "white" : "#475569",
                  borderColor: filter === btn.key ? btn.dot : "#e2e8f0",
                }}
              >
                {btn.emoji && <span style={{ fontSize: "0.8rem" }}>{btn.emoji}</span>}
                {btn.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Column headers */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "60px 140px 1fr 160px 130px 100px 160px 80px",
          padding: "10px 22px",
          background: "#f8fafc",
          borderBottom: "1px solid #f1f5f9",
          fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", letterSpacing: "0.06em"
        }}>
          <span>#</span>
          <span>NAME</span>
          <span>ISSUE</span>
          <span>LOCATION</span>
          <span>DEPT</span>
          <span>PRIORITY</span>
          <span>STATUS</span>
          <span>DATE</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "#94a3b8" }}>No complaints found.</div>
        ) : (
          filtered.map((c, i) => {
            const dept = getDept(c);
            const deptCfg = deptColors[dept] || deptColors["PUBLIC WORKS"];
            const priority = c.priority || "low";
            const priCfg = priorityConfig[priority] || priorityConfig.low;
            const currentStatus = statuses[c.id] || c.status || "pending";
            const stCfg = statusConfig[currentStatus] || statusConfig.pending;

            return (
              <motion.div
                key={c.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ background: "#f8fafc" }}
                style={{
                  display: "grid",
                  gridTemplateColumns: "60px 140px 1fr 160px 130px 100px 160px 80px",
                  padding: "14px 22px",
                  borderBottom: "1px solid #f1f5f9",
                  alignItems: "center",
                  transition: "background 0.15s"
                }}
              >
                {/* ID */}
                <span style={{ fontSize: "0.75rem", color: "#94a3b8", fontFamily: "monospace" }}>
                  {String(c.id).slice(0, 6)}
                </span>

                {/* Name */}
                <span style={{ fontWeight: 600, color: "#0f172a", fontSize: "0.875rem" }}>
                  {c.name}
                </span>

                {/* Issue */}
                <span style={{ color: "#475569", fontSize: "0.85rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>
                  {c.complaint_text}
                </span>

                {/* Location */}
                <span style={{ color: "#64748b", fontSize: "0.8rem" }}>
                  {c.location}
                </span>

                {/* Dept badge */}
                <span>
                  <span style={{
                    display: "inline-block",
                    padding: "3px 10px", borderRadius: 6,
                    background: deptCfg.bg, color: deptCfg.color,
                    fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.04em"
                  }}>
                    {dept}
                  </span>
                </span>

                {/* Priority */}
                <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 7, height: 7, borderRadius: "50%", background: priCfg.color, display: "inline-block" }} />
                  <span style={{ fontSize: "0.78rem", fontWeight: 700, color: priCfg.color }}>
                    {priCfg.label}
                  </span>
                </span>

                {/* Status dropdown */}
                <StatusDropdown
                  value={currentStatus}
                  onChange={(val) => setStatuses(prev => ({ ...prev, [c.id]: val }))}
                />

                {/* Date */}
                <span style={{ fontSize: "0.78rem", color: "#94a3b8" }}>
                  {formatDate(c.created_at || "")}
                </span>
              </motion.div>
            );
          })
        )}
      </motion.div>

    </motion.div>
  );
}
