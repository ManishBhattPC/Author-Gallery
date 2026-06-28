import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser, googleLogin, verifyOTP, resendOTP } from "../services/authService.js";
import { useAuth } from "../AuthContext.jsx";
import { FcGoogle } from "react-icons/fc";

const Signup = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [step, setStep] = useState("details"); // details, google-password, otp
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [googleRegistration, setGoogleRegistration] = useState(null); // { credential, email, name }
  const [googlePassword, setGooglePassword] = useState("");
  const [googleConfirmPassword, setGoogleConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resendStatus, setResendStatus] = useState(null);
  const isRegistrationClosed = localStorage.getItem("admin_setting_allowRegistration") === "false";

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (isRegistrationClosed) {
      setError("Registration is temporarily closed by the administrator.");
      return;
    }

    // 1. Client-side name validation
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    // 2. Client-side email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const trimmedEmail = form.email.trim();
    if (!trimmedEmail || !emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    const localPart = trimmedEmail.split("@")[0];
    if (localPart.length > 64) {
      setError("Email username (before @) cannot exceed 64 characters.");
      return;
    }

    if (localPart.startsWith(".") || localPart.endsWith(".")) {
      setError("Email username (before @) cannot start or end with a dot.");
      return;
    }

    if (localPart.includes("..")) {
      setError("Email username (before @) cannot contain consecutive dots.");
      return;
    }

    if (/^\d+$/.test(localPart)) {
      setError("Email username (before @) cannot consist entirely of numbers.");
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
        email: trimmedEmail,
        password: form.password,
      });
      if (res.requiresVerification) {
        setStep("otp");
      } else {
        login(res.user);
        navigate("/author-dashboard");
      }
    } catch (err) {
      setError(err.message || "Unable to register. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTPSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!otp || otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    setLoading(true);
    try {
      const res = await verifyOTP(form.email.trim(), otp.trim());
      login(res.user);
      navigate("/author-dashboard");
    } catch (err) {
      setError(err.message || "Invalid or expired verification code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError(null);
    setResendStatus(null);
    setLoading(true);
    try {
      await resendOTP(form.email.trim());
      setResendStatus("New code sent successfully!");
      setOtp(""); // Reset input
      setTimeout(() => setResendStatus(null), 3000);
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
      if (res.isNewUser) {
        setGoogleRegistration({
          credential: response.credential,
          email: res.email,
          name: res.name
        });
        setStep("google-password");
      } else {
        login(res.user);
        navigate("/author-dashboard");
      }
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
      if (res.isNewUser) {
        setGoogleRegistration({
          credential: mockIdToken,
          email: res.email,
          name: res.name
        });
        setStep("google-password");
      } else {
        login(res.user);
        navigate("/author-dashboard");
      }
    } catch (err) {
      setError(err.message || "Simulated Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleGooglePasswordSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (googlePassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (googlePassword !== googleConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await googleLogin(googleRegistration.credential, googlePassword);
      login(res.user);
      navigate("/author-dashboard");
    } catch (err) {
      setError(err.message || "Failed to set password. Please try again.");
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
        const btnWidth = Math.min(380, Math.max(200, window.innerWidth - 80));
        window.google.accounts.id.renderButton(
          document.getElementById("google-signup-btn"),
          { theme: "outline", size: "large", width: btnWidth, shape: "pill" }
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
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg text-left">
        <h2 className="text-3xl font-semibold text-slate-900">
          {step === "details" && "Create your author account"}
          {step === "google-password" && "Choose a Password"}
          {step === "otp" && "Verify Your Email"}
        </h2>
        <p className="mt-2 text-sm text-slate-650">
          {step === "details" && "Register once and manage your books, profile, and audience."}
          {step === "google-password" && "Secure your new account created via Google."}
          {step === "otp" && `We've sent a 6-digit verification code to ${form.email.toLowerCase().trim()}.`}
        </p>

        {step === "details" && (
          isRegistrationClosed ? (
            <div className="mt-8 p-6 bg-amber-50/50 border border-amber-200/60 rounded-3xl text-center space-y-4 animate-fade-in">
              <div className="w-12 h-12 bg-amber-700/10 rounded-full flex items-center justify-center text-amber-850 mx-auto">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-800 text-sm">Registrations Closed</h4>
                <p className="text-xs text-slate-550 max-w-xs mx-auto leading-relaxed font-medium">
                  New account registrations are temporarily closed by the platform administration. Please sign in with an existing account or try again later.
                </p>
              </div>
              <div className="pt-2">
                <Link to="/login" className="inline-block text-xs bg-amber-700 hover:bg-amber-800 text-white font-bold px-5 py-2.5 rounded-full shadow transition cursor-pointer">
                  Sign In to existing account
                </Link>
              </div>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={handleRegisterSubmit}>
              <div>
                <label className="block text-sm font-medium text-slate-700">Full name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-amber-950/20"
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
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-amber-950/20"
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
                  className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-amber-950/20"
                />
              </div>

              {error && <p className="text-sm text-rose-655 font-semibold">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
              >
                {loading ? "Creating Account..." : "Sign Up"}
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
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-300 rounded-full hover:bg-slate-50 hover:shadow-sm active:scale-[0.98] transition-all duration-200 font-semibold text-slate-700 text-xs cursor-pointer bg-white"
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
          )
        )}

        {step === "google-password" && (
          <form className="mt-8 space-y-5" onSubmit={handleGooglePasswordSubmit}>
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm text-amber-900 leading-relaxed">
                You're signing up with Google as <strong>{googleRegistration?.name}</strong> ({googleRegistration?.email}). Please choose a password to complete registration.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                name="googlePassword"
                value={googlePassword}
                onChange={(e) => setGooglePassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-amber-950/20"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm Password</label>
              <input
                type="password"
                name="googleConfirmPassword"
                value={googleConfirmPassword}
                onChange={(e) => setGoogleConfirmPassword(e.target.value)}
                required
                placeholder="Re-enter password"
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-amber-950/20"
              />
            </div>

            {error && <p className="text-sm text-rose-650 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Creating Account..." : "Create Account & Log In"}
            </button>

            <div className="flex justify-center text-xs text-slate-550 mt-4">
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setGoogleRegistration(null);
                  setGooglePassword("");
                  setGoogleConfirmPassword("");
                  setError(null);
                }}
                className="text-amber-800 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form className="mt-8 space-y-5" onSubmit={handleVerifyOTPSubmit}>
            <div className="rounded-2xl bg-amber-50 border border-amber-250 p-4">
              <p className="text-sm text-amber-900 leading-relaxed font-semibold">
                An email containing your One-Time Password (OTP) verification code has been sent. This code will expire in 10 minutes.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Verification Code (6-digit)</label>
              <input
                type="text"
                name="otp"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                required
                placeholder="######"
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-xl font-bold tracking-[8px] text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 placeholder:tracking-normal placeholder:font-normal dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-100 dark:focus:ring-amber-950/20"
              />
            </div>

            {error && <p className="text-sm text-rose-650 font-semibold">{error}</p>}
            {resendStatus && <p className="text-sm text-emerald-700 font-bold">{resendStatus}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Verifying Code..." : "Verify & Create Account"}
            </button>

            <div className="flex justify-between items-center text-xs mt-4 px-2">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={loading}
                className="text-amber-800 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none disabled:opacity-50"
              >
                Resend Code
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("details");
                  setOtp("");
                  setError(null);
                }}
                className="text-slate-500 font-semibold hover:text-slate-700 cursor-pointer bg-transparent border-none outline-none"
              >
                Change Details
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Signup;