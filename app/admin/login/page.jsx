"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    // Login
    const { error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (loginError) {
      setLoading(false);
      setError(loginError.message);
      return;
    }

    // Logged in user
    const {
      data: { user },
    } = await supabase.auth.getUser();

    console.log("Logged User:", user?.email);

    // Check admin table
    const { data: admin, error: adminError } = await supabase
      .from("admins")
      .select("*")
      .eq("email", user.email)
      .single();

    console.log("Admin:", admin);
    console.log("Admin Error:", adminError);

    setLoading(false);

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setError("You are not authorized to access the admin panel.");
      return;
    }

    router.push("/admin");
  };

  return (
    <div>
      <form onSubmit={handleLogin}>
        <h2>Admin Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <br />
        <br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <br />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <button disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
