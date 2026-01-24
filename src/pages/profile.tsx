import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase/client';

export default function ProfilePage() {
  const { user, profile, loading: authLoading, refreshProfile, signOut } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [teamName, setTeamName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setTeamName(profile.team_name || '');
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      if (!profile) throw new Error('Profile not found');

      const { error } = await supabase
        .from('profiles')
        .update({
          username,
          team_name: teamName,
        })
        .eq('id', profile.id);

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
    router.push('/login');
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
          {success && <div className="success-message">Profile updated successfully!</div>}
          <div className="button-group">
            <button typhandleSignOut}
              className="signout-button"
            >
              Sign Out
              type="button"
              onClick={() => router.push('/fantasy')}
              className="cancel-button"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      <style jsx>{`
        .profile-page {
          min-height: 100vh;
          background: #f5f5f5;
          padding: 2rem;
        }
        .loading-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        }
        .profile-container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          padding: 2rem;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
          margin-bottom: 2rem;
          color: #333;
        }
        .form-group {
          margin-bottom: 1.5rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 500;
          color: #555;
        }
        input {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        input:focus {
          outline: none;
          border-color: #4CAF50;
        }
        input:disabled {
          background-color: #f5f5f5;
          cursor: not-allowed;
        }
        .error-message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background-color: #fee;
          border: 1px solid #fcc;
          border-radius: 4px;
          color: #c33;
        }
        .success-message {
          margin-bottom: 1rem;
          padding: 0.75rem;
          background-color: #efe;
          border: 1px solid #cfc;
          border-radius: 4px;
          color: #3c3;
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
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-button {
          background-color: #4CAF50;
          color: white;
        }
        .submit-button:hover:not(:disabled) {
          background-color: #45a049;
        }
        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .signout-button {
          background-color: #f44336;
          color: white;
        }
        .signout-button:hover {
          background-color: #d32f2f;
        }
      `}</style>
    </div>
  );
}
