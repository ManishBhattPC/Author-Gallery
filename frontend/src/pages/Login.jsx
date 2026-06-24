import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../AuthContext.jsx";
import { loginUser, googleLogin } from "../services/authService.js";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // 1. Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // 2. Client-side password validation
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const data = await loginUser({
        email: form.email.trim(),
        password: form.password,
      });
      login(data.user);
      if (data.user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/author-dashboard");
      }
    } catch (err) {
      setError(err.message || "Unable to login. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth verification callback
  const handleGoogleCallback = async (response) => {
    setError(null);
    setLoading(true);
    try {
      const res = await googleLogin(response.credential);
      login(res.user);
      if (res.user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/author-dashboard");
      }
    } catch (err) {
      setError(err.message || "Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const mockEmail = form.email.trim() || "johndoe@example.com";
      const parts = mockEmail.split("@")[0] || "johndoe";
      const mockName = parts.charAt(0).toUpperCase() + parts.slice(1);
      const mockIdToken = `mock_${mockName}_${mockEmail}`;
      
      const res = await googleLogin(mockIdToken);
      login(res.user);
      if (res.user?.role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/author-dashboard");
      }
    } catch (err) {
      setError(err.message || "Simulated Google login failed.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load Google Identity Services script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
      if (clientId && clientId !== "your-google-client-id" && window.google) {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleGoogleCallback,
        });
        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { theme: "outline", size: "large", width: "100%", shape: "pill" }
        );
      }
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg text-left">
        <h2 className="text-3xl font-semibold text-slate-900">Log in to your account</h2>
        <p className="mt-2 text-sm text-slate-655 font-medium">Enter your credentials to continue.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-700">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
              className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
            />
          </div>

          {error && <p className="text-sm text-rose-655 font-semibold">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
          >
            {loading ? "Signing in…" : "Login"}
          </button>

          {/* Divider */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase">Or</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Real Google Button Container */}
          <div id="google-signin-btn" className="w-full flex justify-center"></div>

          {/* Dev Mode Simulated Google Sign-in */}
          {(!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === "your-google-client-id") && (
            <button
              type="button"
              onClick={handleSimulatedGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-full hover:bg-slate-50 transition font-semibold text-slate-700 text-xs cursor-pointer bg-white"
            >
              <FcGoogle size={16} />
              Simulate Google Login (Dev Mode)
            </button>
          )}

          <p className="mt-4 text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-amber-800 font-bold hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;