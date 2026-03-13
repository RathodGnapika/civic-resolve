import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Star, MessageSquare, CheckCircle, Search, Send, TrendingUp, ThumbsUp, Award } from "lucide-react";

type Feedback = {
  id: string;
  complaint_id: string;
  rating: number;
  comment: string;
  created_at: string;
  complaints?: { name: string; department: string; location: string; status: string };
};

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hover, setHover] = useState(0);
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {[1, 2, 3, 4, 5].map(star => (
        <button key={star} type="button"
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          style={{
            background: "none", border: "none", cursor: readonly ? "default" : "pointer",
            padding: 2, transition: "transform 0.15s",
            transform: !readonly && (hover >= star || value >= star) ? "scale(1.2)" : "scale(1)"
          }}>
          <Star size={readonly ? 14 : 28}
            fill={(hover || value) >= star ? "#f59e0b" : "none"}
            color={(hover || value) >= star ? "#f59e0b" : "#cbd5e1"}
            strokeWidth={1.5}
          />
        </button>
      ))}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: "20px", boxShadow: "0 1px 4px rgba(15,32,68,0.06)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
        <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</span>
        <div style={{ padding: 7, borderRadius: 9, background: bg }}><Icon size={14} color={color} /></div>
      </div>
      <div style={{ fontSize: "2rem", fontWeight: 800, fontFamily: "'Plus Jakarta Sans',sans-serif", color }}>{value}</div>
    </div>
  );
}

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks]       = useState<Feedback[]>([]);
  const [loading, setLoading]           = useState(true);
  const [complaintId, setComplaintId]   = useState("");
  const [complaint, setComplaint]       = useState<any>(null);
  const [searching, setSearching]       = useState(false);
  const [notFound, setNotFound]         = useState(false);
  const [alreadyRated, setAlreadyRated] = useState(false);
  const [rating, setRating]             = useState(0);
  const [comment, setComment]           = useState("");
  const [submitting, setSubmitting]     = useState(false);
  const [submitted, setSubmitted]       = useState(false);
  const [mounted, setMounted]           = useState(false);

  useEffect(() => {
    fetchFeedbacks();
    setTimeout(() => setMounted(true), 100);
  }, []);

  const fetchFeedbacks = async () => {
    const { data } = await (supabase as any)
      .from("feedback")
      .select("*, complaints(name, department, location, status)")
      .order("created_at", { ascending: false })
      .limit(20);
    setFeedbacks(data || []);
    setLoading(false);
  };

  const searchComplaint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!complaintId.trim()) return;
    setSearching(true);
    setNotFound(false);
    setAlreadyRated(false);
    setComplaint(null);
    setSubmitted(false);
    setRating(0);
    setComment("");

    const { data: comp } = await (supabase as any)
      .from("complaints").select("*").eq("id", complaintId.trim()).single();

    if (!comp) { setNotFound(true); setSearching(false); return; }

    // check if already rated
    const { data: existing } = await (supabase as any)
      .from("feedback").select("id").eq("complaint_id", complaintId.trim()).single();

    setComplaint(comp);
    setAlreadyRated(!!existing);
    setSearching(false);
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;
    setSubmitting(true);

    const { error } = await (supabase as any).from("feedback").insert([{
      complaint_id: complaintId.trim(),
      rating,
      comment: comment.trim() || null,
    }]);

    setSubmitting(false);
    if (!error) {
      setSubmitted(true);
      fetchFeedbacks();
    }
  };

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.rating, 0) / feedbacks.length).toFixed(1)
    : "—";
  const fiveStar = feedbacks.filter(f => f.rating === 5).length;
  const ratingDist = [5, 4, 3, 2, 1].map(r => ({
    star: r,
    count: feedbacks.filter(f => f.rating === r).length,
    pct: feedbacks.length > 0 ? Math.round((feedbacks.filter(f => f.rating === r).length / feedbacks.length) * 100) : 0
  }));

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "'Plus Jakarta Sans',sans-serif", padding: "40px 24px 60px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: 36, opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(-16px)", transition: "all 0.5s ease" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "#fff", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(15,32,68,0.08)" }}>
              <Star size={20} color="#f59e0b" fill="#f59e0b" />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1.7rem", fontWeight: 800, color: "#0f2044", letterSpacing: "-0.02em" }}>
                Public Feedback
              </h1>
              <p style={{ color: "#64748b", fontSize: "0.82rem" }}>Rate resolved complaints and share your experience</p>
            </div>
          </div>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 32, opacity: mounted ? 1 : 0, transition: "opacity 0.5s 0.1s ease" }}>
          <StatCard icon={MessageSquare} label="Total Reviews"   value={feedbacks.length}  color="#2563eb" bg="#eff6ff" />
          <StatCard icon={Star}          label="Average Rating"  value={avgRating}          color="#f59e0b" bg="#fffbeb" />
          <StatCard icon={ThumbsUp}      label="5-Star Reviews"  value={fiveStar}           color="#059669" bg="#ecfdf5" />
          <StatCard icon={Award}         label="Satisfaction"    value={feedbacks.length > 0 ? Math.round((feedbacks.filter(f => f.rating >= 4).length / feedbacks.length) * 100) + "%" : "—"} color="#7c3aed" bg="#f5f3ff" />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, opacity: mounted ? 1 : 0, transition: "opacity 0.5s 0.2s ease" }}>

          {/* LEFT — SUBMIT FEEDBACK */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* search box */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,32,68,0.06)" }}>
              <div style={{ height: 4, background: "linear-gradient(90deg,#0f2044,#2563eb,#f97316)" }} />
              <div style={{ padding: "24px" }}>
                <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "1rem", fontWeight: 700, color: "#0f2044", marginBottom: 4 }}>
                  Rate a Complaint
                </h2>
                <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: 18 }}>Enter your complaint ID to leave feedback</p>

                <form onSubmit={searchComplaint} style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, position: "relative" }}>
                    <Search size={14} color="#94a3b8" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                    <input
                      value={complaintId} onChange={e => setComplaintId(e.target.value)}
                      placeholder="Paste complaint UUID..."
                      style={{ width: "100%", paddingLeft: 32, paddingRight: 12, paddingTop: 10, paddingBottom: 10, borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: "0.83rem", background: "#f8fafc", color: "#0f172a", outline: "none", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                    />
                  </div>
                  <button type="submit" disabled={searching || !complaintId.trim()} style={{
                    padding: "0 16px", borderRadius: 9, background: "#0f2044", color: "#fff",
                    border: "none", fontWeight: 700, fontSize: "0.83rem", cursor: "pointer",
                    fontFamily: "'Plus Jakarta Sans',sans-serif", flexShrink: 0
                  }}>
                    {searching ? "..." : "Find"}
                  </button>
                </form>

                {notFound && (
                  <div style={{ marginTop: 14, padding: "12px 14px", background: "#fef2f2", border: "1px solid rgba(220,38,38,0.15)", borderRadius: 10, fontSize: "0.82rem", color: "#dc2626", display: "flex", alignItems: "center", gap: 8 }}>
                    ❌ No complaint found with that ID.
                  </div>
                )}

                {alreadyRated && complaint && (
                  <div style={{ marginTop: 14, padding: "12px 14px", background: "#fffbeb", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, fontSize: "0.82rem", color: "#d97706" }}>
                    ⚠️ This complaint has already been rated. Thank you!
                  </div>
                )}

                {/* complaint found — show form */}
                {complaint && !alreadyRated && !submitted && (
                  <div style={{ marginTop: 16, animation: "fadeUp 0.4s ease both" }}>
                    {/* complaint preview */}
                    <div style={{ padding: "12px 14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, marginBottom: 16 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontWeight: 700, fontSize: "0.88rem", color: "#0f2044" }}>{complaint.name}</span>
                        <span style={{ fontSize: "0.7rem", background: complaint.status === "resolved" ? "#ecfdf5" : "#eff6ff", color: complaint.status === "resolved" ? "#059669" : "#2563eb", border: `1px solid ${complaint.status === "resolved" ? "rgba(5,150,105,0.2)" : "rgba(37,99,235,0.2)"}`, borderRadius: 6, padding: "2px 8px", fontWeight: 700 }}>
                          {complaint.status?.replace("_", " ")}
                        </span>
                      </div>
                      <p style={{ fontSize: "0.78rem", color: "#64748b" }}>{complaint.department} · {complaint.location}</p>
                    </div>

                    <form onSubmit={submitFeedback}>
                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 10 }}>Your Rating *</label>
                        <StarRating value={rating} onChange={setRating} />
                        {rating > 0 && (
                          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: 6 }}>
                            {["", "Poor", "Fair", "Good", "Very Good", "Excellent!"][rating]}
                          </p>
                        )}
                      </div>

                      <div style={{ marginBottom: 16 }}>
                        <label style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155", display: "block", marginBottom: 6 }}>Comment (optional)</label>
                        <textarea
                          value={comment} onChange={e => setComment(e.target.value)}
                          placeholder="How was your experience? Was the issue resolved well?"
                          rows={3}
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 9, border: "1.5px solid #e2e8f0", fontSize: "0.83rem", background: "#f8fafc", color: "#0f172a", outline: "none", resize: "vertical", fontFamily: "'Plus Jakarta Sans',sans-serif" }}
                        />
                      </div>

                      <button type="submit" disabled={rating === 0 || submitting} style={{
                        width: "100%", padding: "12px", borderRadius: 9,
                        background: rating === 0 ? "#e2e8f0" : "#0f2044",
                        color: rating === 0 ? "#94a3b8" : "#fff",
                        border: "none", fontWeight: 700, fontSize: "0.88rem",
                        cursor: rating === 0 ? "not-allowed" : "pointer",
                        fontFamily: "'Plus Jakarta Sans',sans-serif",
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                        transition: "all 0.2s"
                      }}>
                        {submitting ? "Submitting..." : <><Send size={14} /> Submit Feedback</>}
                      </button>
                    </form>
                  </div>
                )}

                {/* success */}
                {submitted && (
                  <div style={{ marginTop: 16, textAlign: "center", padding: "24px 16px", animation: "fadeUp 0.4s ease both" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#ecfdf5", border: "2px solid rgba(5,150,105,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
                      <CheckCircle size={24} color="#059669" />
                    </div>
                    <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontWeight: 700, color: "#0f2044", marginBottom: 6 }}>Thank you!</h3>
                    <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: 16 }}>Your feedback helps improve civic services.</p>
                    <button onClick={() => { setSubmitted(false); setComplaint(null); setComplaintId(""); setRating(0); setComment(""); }}
                      style={{ padding: "8px 18px", borderRadius: 8, background: "#eff6ff", border: "1px solid #dbeafe", color: "#2563eb", fontWeight: 600, fontSize: "0.82rem", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
                      Rate Another
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* rating distribution */}
            <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, padding: "20px", boxShadow: "0 1px 4px rgba(15,32,68,0.06)" }}>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.9rem", fontWeight: 700, color: "#0f2044", marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>
                <TrendingUp size={15} color="#2563eb" /> Rating Distribution
              </h3>
              {ratingDist.map(({ star, count, pct }) => (
                <div key={star} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#64748b", width: 14, textAlign: "right" }}>{star}</span>
                  <Star size={11} fill="#f59e0b" color="#f59e0b" />
                  <div style={{ flex: 1, height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${pct}%`, background: "#f59e0b", borderRadius: 4, transition: "width 1s ease" }} />
                  </div>
                  <span style={{ fontSize: "0.72rem", color: "#94a3b8", width: 28, textAlign: "right" }}>{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — RECENT FEEDBACK */}
          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(15,32,68,0.06)" }}>
            <div style={{ padding: "20px 20px 14px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 8 }}>
              <MessageSquare size={15} color="#2563eb" />
              <h2 style={{ fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: "0.95rem", fontWeight: 700, color: "#0f2044" }}>Recent Reviews</h2>
              <span style={{ marginLeft: "auto", background: "#eff6ff", color: "#2563eb", border: "1px solid #dbeafe", borderRadius: 20, padding: "2px 10px", fontSize: "0.7rem", fontWeight: 700 }}>{feedbacks.length}</span>
            </div>

            <div style={{ overflowY: "auto", maxHeight: 520 }}>
              {loading ? (
                <div style={{ padding: 40, textAlign: "center", color: "#94a3b8", fontSize: "0.85rem" }}>Loading...</div>
              ) : feedbacks.length === 0 ? (
                <div style={{ padding: 48, textAlign: "center" }}>
                  <Star size={32} color="#e2e8f0" style={{ margin: "0 auto 10px", display: "block" }} />
                  <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>No reviews yet. Be the first to rate!</p>
                </div>
              ) : (
                feedbacks.map((f, i) => (
                  <div key={f.id} style={{ padding: "16px 20px", borderBottom: "1px solid #f8fafc", animation: `fadeUp 0.4s ${i * 0.05}s ease both` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: "0.85rem", color: "#0f2044", marginBottom: 2 }}>
                          {f.complaints?.name || "Anonymous"}
                        </div>
                        <div style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                          {f.complaints?.department} · {new Date(f.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </div>
                      </div>
                      <StarRating value={f.rating} readonly />
                    </div>
                    {f.comment && (
                      <p style={{ fontSize: "0.82rem", color: "#475569", lineHeight: 1.55, background: "#f8fafc", padding: "8px 10px", borderRadius: 8, borderLeft: "3px solid #dbeafe" }}>
                        "{f.comment}"
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @media (max-width: 640px) {
          .feedback-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
