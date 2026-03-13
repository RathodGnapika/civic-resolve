import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Shield, LogIn, Mail, Lock, ArrowRight } from "lucide-react";

export default function Login() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const navigate  = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: "Login failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Welcome back!" });
      navigate("/");
    }
  };

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", background: "#f0f4f8", position: "relative", overflow: "hidden"
    }}>
      {/* background accents */}
      <div style={{ position:"absolute", top:-120, left:-120, width:400, height:400, borderRadius:"50%", background:"rgba(37,99,235,0.06)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-100, right:-100, width:350, height:350, borderRadius:"50%", background:"rgba(249,115,22,0.05)", pointerEvents:"none" }} />

      {/* civic SVG watermark */}
      <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", opacity:0.04, pointerEvents:"none" }}>
        <svg width="600" height="180" viewBox="0 0 600 180" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="20" y="80" width="60" height="100" fill="#0f2044"/>
          <rect x="30" y="60" width="40" height="20" fill="#0f2044"/>
          <rect x="100" y="100" width="80" height="80" fill="#0f2044"/>
          <rect x="120" y="70" width="40" height="30" fill="#0f2044"/>
          <rect x="200" y="60" width="100" height="120" fill="#0f2044"/>
          <rect x="220" y="30" width="60" height="30" fill="#0f2044"/>
          <rect x="240" y="10" width="20" height="20" fill="#0f2044"/>
          <rect x="320" y="90" width="70" height="90" fill="#0f2044"/>
          <rect x="335" y="65" width="40" height="25" fill="#0f2044"/>
          <rect x="410" y="75" width="90" height="105" fill="#0f2044"/>
          <rect x="430" y="45" width="50" height="30" fill="#0f2044"/>
          <rect x="520" y="95" width="60" height="85" fill="#0f2044"/>
          <rect x="530" y="75" width="40" height="20" fill="#0f2044"/>
          <rect x="40" y="110" width="15" height="20" fill="#fff" opacity="0.3"/>
          <rect x="60" y="110" width="15" height="20" fill="#fff" opacity="0.3"/>
          <rect x="215" y="80" width="25" height="30" fill="#fff" opacity="0.3"/>
          <rect x="255" y="80" width="25" height="30" fill="#fff" opacity="0.3"/>
        </svg>
      </div>

      {/* card */}
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0", borderRadius: 20,
        boxShadow: "0 12px 40px rgba(15,32,68,0.13), 0 4px 12px rgba(15,32,68,0.08)",
        width: "100%", maxWidth: 420, position: "relative", zIndex: 1,
        animation: "fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both", overflow: "hidden"
      }}>
        {/* top stripe */}
        <div style={{ height: 4, background: "linear-gradient(90deg, #0f2044 0%, #2563eb 50%, #f97316 100%)" }} />

        {/* header */}
        <div style={{ padding: "36px 36px 24px", textAlign: "center" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "#eff6ff", border: "1px solid #dbeafe",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 20px",
          }}>
            <Shield size={24} color="#2563eb" strokeWidth={2} />
          </div>
          <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.6rem", fontWeight:800, color:"#0f2044", marginBottom:8, letterSpacing:"-0.02em" }}>
            Welcome Back
          </h1>
          <p style={{ color:"#64748b", fontSize:"0.875rem", lineHeight:1.6 }}>
            Sign in to access your CivicAI account
          </p>
        </div>

        {/* form */}
        <div style={{ padding: "0 36px 36px" }}>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:6 }}>
                <Mail size={13} color="#64748b" /> Email address
              </label>
              <Input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                required placeholder="you@example.com"
                style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a", transition:"border-color 0.2s, box-shadow 0.2s" }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:6 }}>
                <Lock size={13} color="#64748b" /> Password
              </label>
              <Input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                required placeholder="••••••••"
                style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a" }}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              width:"100%", padding:"13px", borderRadius:10, fontWeight:700,
              fontSize:"0.95rem", background: loading ? "#94a3b8" : "#1a3a6b",
              color:"#fff", border:"none", cursor: loading ? "not-allowed" : "pointer",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
              boxShadow:"0 2px 8px rgba(26,58,107,0.25)", transition:"all 0.2s",
              fontFamily:"DM Sans,sans-serif"
            }}>
              {loading ? "Signing in..." : <><LogIn size={16} /> Sign In <ArrowRight size={15} /></>}
            </button>
          </form>

          {/* divider */}
          <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0 20px" }}>
            <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
            <span style={{ fontSize:"0.75rem", color:"#94a3b8", fontWeight:500 }}>New to CivicAI?</span>
            <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
          </div>

          <Link to="/register" style={{
            display:"flex", alignItems:"center", justifyContent:"center", gap:6,
            padding:"11px", borderRadius:10, border:"1.5px solid #e2e8f0",
            background:"#f8fafc", color:"#334155", textDecoration:"none",
            fontWeight:600, fontSize:"0.88rem", transition:"all 0.2s"
          }}>
            Create an account
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
