import React, { useState } from "react";
import { ShieldCheck, FileText, Scale, Lock, Globe, CheckCircle } from "lucide-react";

const PrivacyTerms = () => {
  const [activeTab, setActiveTab] = useState("privacy"); // privacy, terms

  return (
    <div className="min-h-screen bg-[#FAF6F0] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white border border-slate-200/60 p-6 sm:p-10 shadow-xl text-left">
        
        {/* Header */}
        <div className="border-b border-slate-100 pb-6 mb-8 text-center sm:text-left">
          <h1 className="text-3xl font-serif font-bold text-slate-900">Legal Documents</h1>
          <p className="mt-1.5 text-sm text-slate-500">
            Read our Privacy Policy and Terms of Service to understand how we protect your data and the rules of our platform.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 mb-8">
          <button
            onClick={() => setActiveTab("privacy")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-sm transition-all cursor-pointer ${
              activeTab === "privacy"
                ? "border-amber-800 text-amber-800"
                : "border-transparent text-slate-450 hover:text-slate-700"
            }`}
          >
            <ShieldCheck className="w-4.5 h-4.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`flex items-center gap-2 px-6 py-3.5 border-b-2 font-bold text-sm transition-all cursor-pointer ${
              activeTab === "terms"
                ? "border-amber-800 text-amber-800"
                : "border-transparent text-slate-450 hover:text-slate-700"
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            Terms of Service
          </button>
        </div>

        {/* Tab Contents */}
        <div className="prose prose-slate max-w-none text-slate-650 leading-relaxed text-sm space-y-8">
          {activeTab === "privacy" ? (
            <div className="space-y-6">
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
                <Lock className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Your privacy is our priority</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    We only collect the information necessary to provide and secure our author gallery platform. We do not sell or share your personal data with third parties.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">1.</span> Information We Collect
                </h2>
                <p>
                  To make the Author Gallery platform functional, we collect:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>Account Data:</strong> Your name, username, email address, password, and profile picture (if uploaded).</li>
                  <li><strong>Creative Work:</strong> Text drafts, uploaded PDF files, cover images, genre categories, and descriptions that you choose to publish.</li>
                  <li><strong>Usage Data:</strong> Server logs and navigation habits to help troubleshoot errors and optimize page load speeds.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">2.</span> How We Use Your Information
                </h2>
                <p>
                  We utilize your collected details to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Authenticate your login sessions and secure your creative collection.</li>
                  <li>Display your public Author Profile to visitors and readers exploring the platform.</li>
                  <li>Allow you to publish, update, and manage your books or review other works.</li>
                  <li>Enable our moderators to handle feedback or resolve issues submitted via the Helpdesk.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">3.</span> Storage & Data Protection
                </h2>
                <p>
                  Your account data is encrypted and securely stored using enterprise-grade MongoDB cloud database clusters. Published digital media (like book cover images and uploaded PDF ebooks) is stored securely on Cloudinary.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">4.</span> Cookies Policy
                </h2>
                <p>
                  We use cookies strictly for session authentication. This is to keep you securely signed in to your dashboard as you navigate different sections of the website. We do not use cookies for advertisement targeting.
                </p>
              </section>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-amber-50/50 border border-amber-100 rounded-2xl p-5 flex items-start gap-4">
                <Scale className="w-6 h-6 text-amber-800 shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-slate-800 text-sm">Acceptance of Terms</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    By registering an account, writing, or uploading works on Author Gallery, you agree to comply with the terms and conditions outlined below.
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">1.</span> Intellectual Property & Content Ownership
                </h2>
                <p>
                  <strong>You retain 100% of the copyright</strong> and ownership rights to all books, texts, designs, and content you write or upload onto our platform. 
                </p>
                <p>
                  By publishing your works on Author Gallery, you grant us a worldwide, non-exclusive, royalty-free license to display, host, and distribute your material for the purpose of presenting it to the public and readers on this web portal.
                </p>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">2.</span> Account Responsibilities
                </h2>
                <p>
                  When registering, you agree to:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Provide accurate registration details (like active emails and usernames).</li>
                  <li>Maintain confidentiality of your account credentials and passwords.</li>
                  <li>Assume full responsibility for all activities, publications, and reviews made under your username.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">3.</span> Prohibited Content & Code of Conduct
                </h2>
                <p>
                  You agree NOT to publish, upload, or comment any content that:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Infringes on the intellectual property, copyright, or trademarks of other authors or entities.</li>
                  <li>Contains hate speech, abuse, harassment, defamation, or graphic violence.</li>
                  <li>Impersonates other writers or readers.</li>
                  <li>Contains malicious scripts, worms, viruses, or attempts to disrupt portal performance.</li>
                </ul>
              </section>

              <section className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-slate-800 flex items-center gap-2">
                  <span className="text-amber-800">4.</span> Moderation & Account Suspension
                </h2>
                <p>
                  The administration team reserves the right to review reported publications, reviews, or author profiles, and delete content or suspend/terminate accounts that violate these Terms.
                </p>
              </section>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 pt-6 mt-8 flex items-center justify-between text-xs text-slate-450 font-medium">
          <span>Last updated: June 2026</span>
          <span className="flex items-center gap-1 text-emerald-600">
            <CheckCircle className="w-3.5 h-3.5" />
            Official & Active Document
          </span>
        </div>

      </div>
    </div>
  );
};

export default PrivacyTerms;
