"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [name,     setName]     = useState("");
  const [mode,     setMode]     = useState("login");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("Could not verify your email. Try signing in again.");
    }
  }, [searchParams]);

  async function goToManager() {
    router.refresh();
    router.push("/manager");
  }

  function formatAuthError(message) {
    if (message === "Email signups are disabled") {
      return "Email signups are disabled in Supabase. Enable them under Authentication → Providers → Email.";
    }
    return message;
  }

  async function handleLogin() {
    setLoading(true); setError(""); setSuccess("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(formatAuthError(error.message));
    else await goToManager();
    setLoading(false);
  }

  async function handleSignup() {
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setLoading(true); setError(""); setSuccess("");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/manager`,
      },
    });
    if (error) {
      setError(formatAuthError(error.message));
    } else if (data.session) {
      await goToManager();
    } else {
      setSuccess("Account created! Check your email to confirm, then sign in.");
      setMode("login");
      setPassword("");
    }
    setLoading(false);
  }

  const B = {
    purple:"#AE4CED", navy:"#253A5E", navyMid:"#2B369E",
    border:"#E2DEFF", bg:"#F7F5FF", surface:"#FFFFFF",
    text:"#1A1240", textMid:"#4A5578",
  };

  return (
    <div style={{ minHeight:"100vh", background:B.bg, display:"flex",
      alignItems:"center", justifyContent:"center", fontFamily:"Poppins,sans-serif" }}>
      <div style={{ width:400, background:B.surface, borderRadius:20,
        padding:36, boxShadow:"0 8px 48px rgba(110,70,200,0.12)",
        border:`1px solid ${B.border}` }}>

        <div style={{ textAlign:"center", marginBottom:28 }}>
          <img src="/Logo-N.png" alt="Oriz Travel"
            style={{ height:44, objectFit:"contain" }}/>
          <div style={{ fontSize:13, color:B.textMid, marginTop:10 }}>
            {mode==="login" ? "Sign in to your manager account" : "Create your manager account"}
          </div>
        </div>

        <div style={{ display:"grid", gap:14, marginBottom:20 }}>
          {mode==="signup" && (
            <div>
              <label style={{ fontSize:11, fontWeight:600, color:B.textMid,
                display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>
                Full name
              </label>
              <input value={name} onChange={e=>setName(e.target.value)}
                placeholder="Coach Rivera"
                style={{ width:"100%", border:`1.5px solid ${B.border}`,
                  borderRadius:9, padding:"11px 14px", fontSize:14,
                  color:B.text, outline:"none", boxSizing:"border-box" }}/>
            </div>
          )}
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:B.textMid,
              display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>
              Email
            </label>
            <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
              placeholder="you@team.com"
              style={{ width:"100%", border:`1.5px solid ${B.border}`,
                borderRadius:9, padding:"11px 14px", fontSize:14,
                color:B.text, outline:"none", boxSizing:"border-box" }}/>
          </div>
          <div>
            <label style={{ fontSize:11, fontWeight:600, color:B.textMid,
              display:"block", marginBottom:5, textTransform:"uppercase", letterSpacing:0.5 }}>
              Password
            </label>
            <input type="password" value={password} onChange={e=>setPassword(e.target.value)}
              placeholder="password"
              style={{ width:"100%", border:`1.5px solid ${B.border}`,
                borderRadius:9, padding:"11px 14px", fontSize:14,
                color:B.text, outline:"none", boxSizing:"border-box" }}/>
          </div>
        </div>

        {error && (
          <div style={{ background:"#FF5C5C15", border:"1px solid #FF5C5C33",
            borderRadius:9, padding:"10px 14px", fontSize:13,
            color:"#FF5C5C", marginBottom:16 }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ background:"#22C55E15", border:"1px solid #22C55E33",
            borderRadius:9, padding:"10px 14px", fontSize:13,
            color:"#15803D", marginBottom:16 }}>
            {success}
          </div>
        )}

        <button
          onClick={mode==="login" ? handleLogin : handleSignup}
          disabled={loading || !email || !password}
          style={{ width:"100%",
            background:`linear-gradient(135deg,${B.purple},${B.navyMid})`,
            border:"none", borderRadius:10, padding:"13px", color:"#fff",
            fontFamily:"Sora,sans-serif", fontWeight:700, fontSize:15,
            cursor:loading?"not-allowed":"pointer", opacity:loading?0.7:1 }}>
          {loading ? "Loading..." : mode==="login" ? "Sign In" : "Create Account"}
        </button>

        <div style={{ textAlign:"center", marginTop:18, fontSize:13, color:B.textMid }}>
          {mode === "login" ? "No account yet? " : "Already have an account? "}
          <button onClick={()=>{ setMode(mode==="login"?"signup":"login"); setError(""); setSuccess(""); }}
            style={{ background:"none", border:"none", color:B.purple,
              fontWeight:700, cursor:"pointer", fontSize:13 }}>
            {mode==="login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}