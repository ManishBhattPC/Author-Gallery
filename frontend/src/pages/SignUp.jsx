import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, verifyOTP, resendOTP, googleLogin } from "../services/authService.js";
import { useAuth } from "../AuthContext.jsx";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState("details"); // details, otp
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // 1. Client-side name validation
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    // 2. Client-side email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email.trim() || !emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // 3. Client-side password validation
    if (!form.password || form.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    setLoading(true);

    try {
      const res = await registerUser({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      setSuccess(res.message || "Verification code sent to your email!");
      setStep("otp");
    } catch (err) {
      setError(err.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    setLoading(true);

    try {
      const res = await verifyOTP(form.email.trim(), otpCode.trim());
      login(res.user);
      navigate("/author-dashboard");
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await resendOTP(form.email.trim());
      setSuccess(res.message || "New code sent successfully!");
    } catch (err) {
      setError(err.message || "Failed to resend code.");
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
      navigate("/author-dashboard");
    } catch (err) {
      setError(err.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleSimulatedGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    try {
      const mockName = form.name.trim() || "John Doe";
      const mockEmail = form.email.trim() || "johndoe@example.com";
      const formattedName = mockName.replace(/\s+/g, "-");
      const mockIdToken = `mock_${formattedName}_${mockEmail}`;
      
      const res = await googleLogin(mockIdToken);
      login(res.user);
      navigate("/author-dashboard");
    } catch (err) {
      setError(err.message || "Simulated Google sign-in failed.");
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
          document.getElementById("google-signup-btn"),
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
        <h2 className="text-3xl font-semibold text-slate-900">
          {step === "details" ? "Create your author account" : "Verify your email"}
        </h2>
        <p className="mt-2 text-sm text-slate-650">
          {step === "details"
            ? "Register once and manage your books, profile, and audience."
            : `We sent a 6-digit verification code to ${form.email}.`}
        </p>

        {step === "details" ? (
          <form className="mt-8 space-y-5" onSubmit={handleRegisterSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Full name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
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
                onChange={handleChange}
                required
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {error && <p className="text-sm text-rose-650 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Sending verification..." : "Sign Up"}
            </button>

            {/* Divider */}
            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase">Or</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Real Google Button Container */}
            <div id="google-signup-btn" className="w-full flex justify-center"></div>

            {/* Dev Mode Simulated Google Sign-in */}
            {(!import.meta.env.VITE_GOOGLE_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID === "your-google-client-id") && (
              <button
                type="button"
                onClick={handleSimulatedGoogleLogin}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-full hover:bg-slate-50 transition font-semibold text-slate-700 text-xs cursor-pointer bg-white"
              >
                <FcGoogle size={16} />
                Simulate Google Sign-up (Dev Mode)
              </button>
            )}

            <p className="mt-4 text-center text-xs text-slate-500">
              Already have an account?{" "}
              <Link to="/login" className="text-amber-800 font-bold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        ) : (
          <form className="mt-8 space-y-5" onSubmit={handleOtpSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Verification Code</label>
              <input
                type="text"
                name="otp"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                className="mt-2 w-full text-center tracking-[0.5em] font-mono rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-lg text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {error && <p className="text-sm text-rose-650 font-semibold">{error}</p>}
            {success && <p className="text-sm text-emerald-650 font-semibold">{success}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-800 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Verifying..." : "Verify & Complete Signup"}
            </button>

            <div className="flex flex-col gap-2 items-center text-xs text-slate-500 mt-4">
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="text-amber-800 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none disabled:opacity-50"
              >
                Resend verification code
              </button>
              <button
                type="button"
                onClick={() => setStep("details")}
                className="text-slate-500 hover:text-slate-700 hover:underline cursor-pointer bg-transparent border-none outline-none"
              >
                Back to registration details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;