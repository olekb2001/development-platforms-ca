import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Login error:", error.message);
      setErrorMsg(`Login failed: ${error.message}`);
    } else {
      setMessage("Logged in successfully!");
    }
    setLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setErrorMsg("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error("Signup error:", error.message);
      setErrorMsg(`Signup failed: ${error.message}`);
    } else {
      setMessage("Check your email for a confirmation link!");
    }
    setLoading(false);
  };
  return (
    <div>
      <h2>Login / Register</h2>
      <form>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button onClick={handleLogin} className="login" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>

        <button onClick={handleRegister} className="register" disabled={loading}>
          {loading ? "Loading..." : "Register"}
        </button>
      </form>
      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}
      {message && <p style={{ color: "lightgreen" }}>{message}</p>}
    </div>
  );
}
