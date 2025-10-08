import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import Auth from "./Auth";
import Articles from "./Articles";
import "./index.css";

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      console.log("Initial session:", data.session);
      setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log("Auth state changed:", _event, session);
        setSession(session);
      }
    );
    return () => listener.subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    console.log("Logging out...");
    await supabase.auth.signOut();
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <span className="logo">News Platform</span>
        <ul>
          {session && (
            <li className="logout-link" onClick={handleLogout}>
              Logout
            </li>
          )}
        </ul>
      </nav>

      <h1>Welcome to the News Platform</h1>

      {!session ? (
        <>
          <Auth />
          <Articles session={session} />
        </>
      ) : (
        <>
          <p>You are logged in as {session.user.email}</p>
          <Articles session={session} />
        </>
      )}
    </div>
  );
}
