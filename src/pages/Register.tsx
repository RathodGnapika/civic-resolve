import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Mail, Lock, CheckCircle, ArrowRight } from "lucide-react";

export default function Register() {
  const [email, setEmail]                   = useState("");
  const [password, setPassword]             = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading]               = useState(false);
  const navigate  = useNavigate();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Passwords don't match", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email, password,
      options: { emailRedirectTo: window.location.origin },
    });
    setLoading(false);
    if (error) {
      toast({ title: "Registration failed", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Account created!", description: "Check your email to confirm your account." });
      navigate("/login");
    }
  };

  const perks = [
    "Submit complaints instantly",
    "AI-powered auto-classification",
    "Real-time status tracking",
  ];

  return (
    <div style={{
      minHeight: "calc(100vh - 64px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "40px 24px", background: "#f0f4f8", position: "relative", overflow: "hidden"
    }}>
      {/* background accents */}
      <div style={{ position:"absolute", top:-100, right:-100, width:380, height:380, borderRadius:"50%", background:"rgba(37,99,235,0.06)", pointerEvents:"none" }} />
      <div style={{ position:"absolute", bottom:-80, left:-80, width:320, height:320, borderRadius:"50%", background:"rgba(249,115,22,0.05)", pointerEvents:"none" }} />

      <div style={{ display:"flex", gap:24, width:"100%", maxWidth:860, alignItems:"center", position:"relative", zIndex:1 }}>

        {/* left panel — perks */}
        <div style={{
          flex:1, display:"none",
          flexDirection:"column", gap:16,
          padding:"40px 32px",
          background:"#0f2044",
          borderRadius:20,
          minHeight:460,
          boxShadow:"0 12px 40px rgba(15,32,68,0.2)"
        }} className="register-left">
          <div style={{ marginBottom:8 }}>
            <div style={{ width:44, height:44, borderRadius:12, background:"rgba(255,255,255,0.1)", display:"flex", alignItems:"center", justifyContent:"center", marginBottom:20 }}>
              <UserPlus size={22} color="#fff" />
            </div>
            <h2 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.5rem", fontWeight:800, color:"#fff", marginBottom:10, letterSpacing:"-0.02em", lineHeight:1.25 }}>
              Join CivicAI today
            </h2>
            <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.875rem", lineHeight:1.65 }}>
              Help make your city better by reporting issues directly to the right authorities.
            </p>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:12, marginTop:8 }}>
            {perks.map(p => (
              <div key={p} style={{ display:"flex", alignItems:"center", gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:"rgba(37,99,235,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <CheckCircle size={14} color="#93c5fd" />
                </div>
                <span style={{ fontSize:"0.875rem", color:"rgba(255,255,255,0.75)", fontWeight:500 }}>{p}</span>
              </div>
            ))}
          </div>

          {/* mini city illustration */}
          <div style={{ marginTop:"auto", opacity:0.15 }}>
            <svg viewBox="0 0 280 80" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%">
              <rect x="0"   y="40" width="40" height="40" fill="white"/>
              <rect x="8"   y="28" width="24" height="12" fill="white"/>
              <rect x="50"  y="50" width="50" height="30" fill="white"/>
              <rect x="62"  y="30" width="26" height="20" fill="white"/>
              <rect x="72"  y="20" width="6"  height="10" fill="white"/>
              <rect x="110" y="20" width="70" height="60" fill="white"/>
              <rect x="122" y="5"  width="46" height="15" fill="white"/>
              <rect x="140" y="0"  width="10" height="5"  fill="white"/>
              <rect x="190" y="35" width="50" height="45" fill="white"/>
              <rect x="200" y="18" width="30" height="17" fill="white"/>
              <rect x="250" y="45" width="30" height="35" fill="white"/>
              <rect x="255" y="32" width="20" height="13" fill="white"/>
            </svg>
          </div>
        </div>

        {/* right panel — form */}
        <div style={{
          background:"#fff", border:"1px solid #e2e8f0", borderRadius:20,
          boxShadow:"0 12px 40px rgba(15,32,68,0.13)", width:"100%", maxWidth:420,
          animation:"fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both", overflow:"hidden", flexShrink:0
        }}>
          <div style={{ height:4, background:"linear-gradient(90deg,#0f2044 0%,#2563eb 50%,#f97316 100%)" }} />

          <div style={{ padding:"36px 36px 24px", textAlign:"center" }}>
            <div style={{ width:56, height:56, borderRadius:14, background:"#eff6ff", border:"1px solid #dbeafe", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 20px" }}>
              <UserPlus size={24} color="#2563eb" strokeWidth={2} />
            </div>
            <h1 style={{ fontFamily:"Syne,sans-serif", fontSize:"1.6rem", fontWeight:800, color:"#0f2044", marginBottom:8, letterSpacing:"-0.02em" }}>
              Create Account
            </h1>
            <p style={{ color:"#64748b", fontSize:"0.875rem", lineHeight:1.6 }}>
              Register to start reporting civic issues
            </p>
          </div>

          <div style={{ padding:"0 36px 36px" }}>
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom:14 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:6 }}>
                  <Mail size={13} color="#64748b" /> Email address
                </label>
                <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com"
                  style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a" }} />
              </div>

              <div style={{ marginBottom:14 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:6 }}>
                  <Lock size={13} color="#64748b" /> Password
                </label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 6 characters" minLength={6}
                  style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a" }} />
              </div>

              <div style={{ marginBottom:24 }}>
                <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:"0.82rem", fontWeight:600, color:"#334155", marginBottom:6 }}>
                  <Lock size={13} color="#64748b" /> Confirm Password
                </label>
                <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="••••••••"
                  style={{ background:"#f8fafc", border:"1.5px solid #e2e8f0", borderRadius:8, padding:"11px 14px", fontSize:"0.92rem", width:"100%", color:"#0f172a" }} />
              </div>

              <button type="submit" disabled={loading} style={{
                width:"100%", padding:"13px", borderRadius:10, fontWeight:700, fontSize:"0.95rem",
                background: loading ? "#94a3b8" : "#1a3a6b", color:"#fff", border:"none",
                cursor: loading ? "not-allowed" : "pointer",
                display:"flex", alignItems:"center", justifyContent:"center", gap:8,
                boxShadow:"0 2px 8px rgba(26,58,107,0.25)", transition:"all 0.2s",
                fontFamily:"DM Sans,sans-serif"
              }}>
                {loading ? "Creating account..." : <><UserPlus size={16} /> Create Account <ArrowRight size={15} /></>}
              </button>
            </form>

            <div style={{ display:"flex", alignItems:"center", gap:12, margin:"24px 0 20px" }}>
              <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
              <span style={{ fontSize:"0.75rem", color:"#94a3b8", fontWeight:500 }}>Already registered?</span>
              <div style={{ flex:1, height:1, background:"#e2e8f0" }} />
            </div>

            <Link to="/login" style={{
              display:"flex", alignItems:"center", justifyContent:"center", gap:6,
              padding:"11px", borderRadius:10, border:"1.5px solid #e2e8f0",
              background:"#f8fafc", color:"#334155", textDecoration:"none",
              fontWeight:600, fontSize:"0.88rem", transition:"all 0.2s"
            }}>
              Sign in instead
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @media (min-width: 768px) {
          .register-left { display: flex !important; }
        }
      `}</style>
    </div>
  );
}
