import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Invalid credentials. Try again.");
      setLoading(false);
      return;
    }

    const { data: roleData } = await (supabase as any)
      .from("user_roles")
      .select("role")
      .eq("user_id", data.user.id)
      .eq("role", "admin")
      .single();

    if (!roleData) {
      setError("You are not authorized as admin.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/dashboard");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card p-8 w-full max-w-md animate-fade-in">
        <div className="flex justify-center mb-6">
          <div style={{
            width: 64, height: 64, borderRadius: 16,
            background: "linear-gradient(135deg, #0ea5e9, #2563eb)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 30px rgba(14,165,233,0.4)"
          }}>
            <svg width="28" height="28" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
            </svg>
          </div>
        </div>

        <h2 className="font-display text-2xl font-bold text-center mb-1">Admin Portal</h2>
        <p className="text-center text-sm mb-8" style={{color: "#64748b"}}>
          Sign in with your admin credentials
        </p>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.1)",
            border: "1px solid rgba(239,68,68,0.3)",
            borderRadius: 8, padding: "10px 14px",
            color: "#fca5a5", fontSize: "0.85rem", marginBottom: 16
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label style={{display:"block", marginBottom:6}}>Email</label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{width:"100%", padding:"10px 14px"}}
            />
          </div>
          <div>
            <label style={{display:"block", marginBottom:6}}>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{width:"100%", padding:"10px 14px"}}
            />
          </div>
          <button type="submit" disabled={loading} style={{marginTop:8}}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>

        <p style={{textAlign:"center", fontSize:"0.78rem", color:"#334155", marginTop:20}}>
          Login with: rathodgnapika2006@gmail.com
        </p>
      </div>
    </div>
  );
}