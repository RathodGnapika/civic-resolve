import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, Brain, BarChart3, Search } from "lucide-react";

const steps = [
  { title: "User Reports Issue", icon: FileText },
  { title: "AI Analyzes Complaint", icon: Brain },
  { title: "System Prioritizes", icon: BarChart3 },
  { title: "Authorities Resolve", icon: Search },
];

export default function Index() {
  return (
    <div style={{ minHeight: "100vh", position: "relative", overflow: "hidden", background: "#f8fafc" }}>

      {/* 🔥 SVG WAVE BACKGROUND */}
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
        style={{
          position: "fixed",
          width: "100%",
          height: "100%",
          zIndex: 0
        }}
      >
        <path fill="#2563eb" opacity="0.1">
          <animate
            attributeName="d"
            dur="10s"
            repeatCount="indefinite"
            values="
              M0,200 C300,300 600,100 1440,200 L1440,800 L0,800 Z;
              M0,300 C400,100 800,300 1440,250 L1440,800 L0,800 Z;
              M0,200 C300,300 600,100 1440,200 L1440,800 L0,800 Z
            "
          />
        </path>

        <path fill="#0ea5e9" opacity="0.1">
          <animate
            attributeName="d"
            dur="12s"
            repeatCount="indefinite"
            values="
              M0,400 C500,200 900,400 1440,300 L1440,800 L0,800 Z;
              M0,350 C400,500 800,200 1440,400 L1440,800 L0,800 Z;
              M0,400 C500,200 900,400 1440,300 L1440,800 L0,800 Z
            "
          />
        </path>
      </svg>

      {/* MAIN CONTENT */}
      <div style={{ position: "relative", zIndex: 2 }}>

        {/* HERO */}
        <section style={{ padding: "100px 20px", textAlign: "center" }}>

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              fontSize: "3rem",
              fontWeight: "800",
              marginBottom: 20,
              color: "#1e293b"
            }}
          >
            From Complaint to Resolution-{" "}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              style={{ color: "#2563eb" }}
            >
              Powered by CivicAI
            </motion.span>
          </motion.h1>

          <p style={{ color: "#64748b", marginBottom: 40 }}>
            Smart civic issue management powered by AI
          </p>

          {/* BUTTONS */}
          <div style={{ display: "flex", justifyContent: "center", gap: 15 }}>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
              <Link to="/submit" style={{
                background: "#2563eb",
                color: "white",
                padding: "14px 28px",
                borderRadius: 8,
                textDecoration: "none"
              }}>
                Report Issue →
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }}>
              <Link to="/track" style={{
                border: "1px solid #cbd5e1",
                padding: "14px 28px",
                borderRadius: 8,
                textDecoration: "none",
                background: "white"
              }}>
                Track Complaint
              </Link>
            </motion.div>
          </div>

        </section>

        {/* FLOW */}
        <section style={{ padding: "60px 20px" }}>
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: 30,
            flexWrap: "wrap"
          }}>

            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.3 }}
                whileHover={{ y: -10 }}
                style={{
                  width: 220,
                  padding: 20,
                  background: "white",
                  borderRadius: 12,
                  textAlign: "center",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
                }}
              >
                <step.icon size={28} color="#2563eb" />
                <h3 style={{ marginTop: 10 }}>{step.title}</h3>
              </motion.div>
            ))}

          </div>
        </section>

        {/* AI STATUS */}
        <section style={{ textAlign: "center", marginTop: 40 }}>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            style={{
              display: "inline-block",
              padding: "12px 20px",
              background: "#0f172a",
              color: "#4cc9f0",
              borderRadius: 10
            }}
          >
            🤖 AI is actively monitoring city complaints...
          </motion.div>
        </section>

      </div>

    </div>
  );
}