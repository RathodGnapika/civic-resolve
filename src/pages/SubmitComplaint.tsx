import { motion } from "framer-motion";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { submitComplaint, type Complaint } from "@/lib/complaints";
import { CheckCircle } from "lucide-react";

export default function SubmitComplaint() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !location || !text) return;

    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 1500));
      const complaint = await submitComplaint(name, location, text);
      setSubmitted(complaint);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  // ✅ SUCCESS
  if (submitted) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            background: "white",
            padding: 40,
            borderRadius: 10,
            textAlign: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)"
          }}
        >
          <CheckCircle size={40} color="#16a34a" />
          <h2 style={{ marginTop: 10 }}>Complaint Registered</h2>
          <p style={{ color: "#64748b" }}>Reference ID: {submitted.id}</p>

          <button
            onClick={() => navigate("/track")}
            style={{
              marginTop: 20,
              padding: "10px 20px",
              background: "#1e3a8a",
              color: "white",
              borderRadius: 6
            }}
          >
            Track Status
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      background: "#f1f5f9"
    }}>

      {/* LEFT PANEL (PROFESSIONAL FEEL) */}
      <div style={{
        flex: 1,
        background: "linear-gradient(135deg, #1e3a8a, #2563eb)",
        color: "white",
        padding: 60,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}>
        <h1 style={{ fontSize: "2.2rem", fontWeight: "700" }}>
          CivicAI Complaint System
        </h1>

        <p style={{ marginTop: 15, opacity: 0.9 }}>
          Submit civic issues and allow automated prioritization
          through AI-driven governance workflows.
        </p>

        <div style={{ marginTop: 40, lineHeight: "1.8" }}>
          <p>✔ Secure & Verified Submission</p>
          <p>✔ AI-Based Categorization</p>
          <p>✔ Faster Resolution Tracking</p>
        </div>
      </div>

      {/* RIGHT PANEL (FORM) */}
      <div style={{
        flex: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 40
      }}>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "white",
            padding: 30,
            borderRadius: 10,
            boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
          }}
        >

          <h2 style={{ fontSize: "1.4rem", fontWeight: 600 }}>
            Submit Complaint
          </h2>

          <p style={{ color: "#64748b", marginBottom: 20 }}>
            Provide details of the issue
          </p>

          {/* AI STATUS */}
          {loading && (
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              style={{
                marginBottom: 15,
                fontSize: "0.9rem",
                color: "#2563eb"
              }}
            >
              Processing request...
            </motion.div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            <Input
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <Input
              placeholder="Location / Area"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />

            <Textarea
              placeholder="Describe the issue in detail"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              disabled={loading}
              style={{
                marginTop: 10,
                padding: "12px",
                background: "#1e3a8a",
                color: "white",
                borderRadius: 6,
                fontWeight: 600
              }}
            >
              Submit Request
            </motion.button>

          </form>

        </motion.div>
      </div>
    </div>
  );
}