import React from "react";
import { useAuth } from "../contexts/AuthContext";

export default function LoginPage() {
  const { signInWithGoogle } = useAuth();

  const handleGoogleSignIn = async () => {
    const { error } = await signInWithGoogle();
    if (error) {
      console.error("Error signing in with Google:", error);
      alert("Error signing in. Please try again.");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <h1>⚽ BouMob Fantasy</h1>
        <p>Sign in to pick your team and compete with your colleagues!</p>
        <button onClick={handleGoogleSignIn} className="google-button">
          <svg
            width="18"
            height="18"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
          >
            <path
              fill="#EA4335"
              d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
            />
            <path
              fill="#4285F4"
              d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
            />
            <path
              fill="#FBBC05"
              d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
            />
            <path
              fill="#34A853"
              d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
            />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
          Sign in with Google
        </button>
      </div>
      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        .login-card {
          background: white;
          padding: 3rem;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
          text-align: center;
          max-width: 420px;
          width: 90%;
        }
        h1 {
          margin: 0 0 1rem 0;
          color: #333;
          font-size: 2.2rem;
        }
        p {
          margin: 0 0 2.5rem 0;
          color: #666;
          font-size: 1.05rem;
          line-height: 1.5;
        }
        .google-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          width: 100%;
          padding: 14px 24px;
          background: white;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        .google-button:hover {
          background: #f8f8f8;
          border-color: #ccc;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          transform: translateY(-1px);
        }
        .google-button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
