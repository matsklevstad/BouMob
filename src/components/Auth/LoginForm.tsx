import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useRouter } from "next/router";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/fantasy");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            placeholder="your@email.com"
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            placeholder="Your password"
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading} className="submit-button">
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="auth-link">
        Don't have an account? <a href="/signup">Sign up</a>
      </p>
      <style jsx>{`
        .login-form {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        h2 {
          margin-bottom: 1.5rem;
          text-align: center;
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
          border-color: #4caf50;
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
          font-size: 0.9rem;
        }
        .submit-button {
          width: 100%;
          padding: 0.75rem;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 4px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .submit-button:hover:not(:disabled) {
          background-color: #45a049;
        }
        .submit-button:disabled {
          background-color: #ccc;
          cursor: not-allowed;
        }
        .auth-link {
          margin-top: 1.5rem;
          text-align: center;
          color: #666;
        }
        .auth-link a {
          color: #4caf50;
          text-decoration: none;
          font-weight: 500;
        }
        .auth-link a:hover {
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
