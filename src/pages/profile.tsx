import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";
import { supabase } from "../lib/supabase/client";

export default function ProfilePage() {
  const {
    user,
    profile,
    loading: authLoading,
    refreshProfile,
    signOut,
  } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [teamName, setTeamName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || "");
      setTeamName(profile.team_name || "");
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!profile) throw new Error("Profile not found");

      const { error } = await supabase
        .from("profiles")
        .update({
          username,
          team_name: teamName,
        })
        .eq("id", profile.id);

      if (error) throw error;

      await refreshProfile();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (authLoading) {
    return (
      <div className="loading-container">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <h1>Edit Profile</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
              placeholder="Your username"
            />
          </div>
          <div className="form-group">
            <label htmlFor="teamName">Team Name</label>
            <input
              id="teamName"
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              required
              disabled={loading}
              placeholder="Your fantasy team name"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">Profile updated successfully!</div>
          )}
          <div className="button-group">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Saving..." : "Save Profile"}
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="signout-button"
            >
              Sign Out
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: #0a0a0a;
          padding: 2rem;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          background: #0a0a0a;
          color: white;
        }
        .profile-container {
          max-width: 600px;
          margin: 0 auto;
          background: #1a1a1a;
          border: 2px solid #2a2a2a;
          padding: 2rem;
          border-radius: 12px;
        }
        h1 {
          margin-bottom: 2rem;
          color: white;
          font-weight: bold;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: gray;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid #2a2a2a;
          background: #0a0a0a;
          color: white;
          border-radius: 8px;
          font-size: 1rem;
        }
        input:focus {
          outline: none;
          border-color: #5dbc6f;
        }
        input:disabled {
          background-color: #1a1a1a;
          cursor: not-allowed;
          opacity: 0.5;
        }
        .error-message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background-color: #2a1a1a;
          border: 2px solid #ff4444;
          border-radius: 8px;
          color: #ff6666;
        }
        .success-message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background-color: #1a2a1a;
          border: 2px solid #5dbc6f;
          border-radius: 8px;
          color: #5dbc6f;
        }
        .button-group {
          display: flex;
          gap: 1rem;
        }
        .submit-button,
        .signout-button {
          flex: 1;
          padding: 0.75rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .submit-button {
          background-color: #5dbc6f;
          color: white;
        }
        .submit-button:hover:not(:disabled) {
          background-color: #4da85e;
        }
        .submit-button:disabled {
          background-color: #2a2a2a;
          color: gray;
          cursor: not-allowed;
        }
        .signout-button {
          background-color: #ff4444;
          color: white;
        }
        .signout-button:hover {
          background-color: #cc3333;
        }
      `}</style>
    </div>
  );
}
