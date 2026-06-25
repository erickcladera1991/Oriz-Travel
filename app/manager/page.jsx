"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function ManagerPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) router.replace("/login");
      else setEmail(user.email ?? "");
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/login");
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5FF", fontFamily: "Poppins, sans-serif", padding: 32 }}>
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#fff", borderRadius: 16, padding: 32, border: "1px solid #E2DEFF" }}>
        <h1 style={{ fontFamily: "Sora, sans-serif", fontSize: 28, color: "#253A5E", marginBottom: 8 }}>Manager Dashboard</h1>
        <p style={{ color: "#4A5578", marginBottom: 24 }}>Signed in as {email || "..."}</p>
        <button onClick={handleSignOut}
          style={{ background: "#253A5E", border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", cursor: "pointer" }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
