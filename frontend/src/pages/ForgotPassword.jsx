import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { forgotPassword, resetPassword } from "../services/authService.js";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("request"); // request, reset
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPassword(email.trim());
      setSuccessMessage(res.message || "A verification code has been sent to your email.");
      setStep("reset");
    } catch (err) {
      setError(err.message || "Unable to send reset code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Please enter a valid 6-digit verification code.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await resetPassword(email.trim(), otp.trim(), newPassword);
      setSuccessMessage(res.message || "Password reset successful!");
      
      // Auto-redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-lg text-left">
        <h2 className="text-3xl font-semibold text-slate-900">
          {step === "request" ? "Forgot your password?" : "Reset Password"}
        </h2>
        <p className="mt-2 text-sm text-slate-655 font-medium">
          {step === "request"
            ? "Enter your email address and we'll send you an OTP to reset your password."
            : `Please enter the 6-digit code sent to ${email} and choose a new password.`}
        </p>

        {successMessage && (
          <div className="mt-6 rounded-2xl bg-emerald-50 border border-emerald-200 p-4">
            <p className="text-sm text-emerald-800 leading-relaxed font-semibold">
              {successMessage}
            </p>
          </div>
        )}

        {step === "request" ? (
          <form className="mt-6 space-y-5" onSubmit={handleRequestOTP}>
            <div>
              <label className="block text-sm font-medium text-slate-700">Email Address</label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {error && <p className="text-sm text-rose-650 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Sending..." : "Send Verification Code"}
            </button>

            <p className="mt-4 text-center text-xs text-slate-500">
              Remember your password?{" "}
              <Link to="/login" className="text-amber-800 font-bold hover:underline">
                Log In
              </Link>
            </p>
          </form>
        ) : (
          <form className="mt-6 space-y-5" onSubmit={handleResetPassword}>
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
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-center text-xl font-bold tracking-[8px] text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100 placeholder:tracking-normal placeholder:font-normal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="At least 6 characters"
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm password"
                className="mt-2 w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-100"
              />
            </div>

            {error && <p className="text-sm text-rose-650 font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-amber-700 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-amber-800 hover:shadow-md active:scale-[0.98] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-70 cursor-pointer"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>

            <div className="flex justify-center text-xs text-slate-550 mt-4">
              <button
                type="button"
                onClick={() => {
                  setStep("request");
                  setOtp("");
                  setNewPassword("");
                  setConfirmPassword("");
                  setError(null);
                  setSuccessMessage(null);
                }}
                className="text-amber-800 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
              >
                Go Back
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
