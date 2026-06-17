import React, { useState } from "react";

const QuickUpload = () => {
  const [fileName, setFileName] = useState("");

  const handleFileChange = (event) => {
    setFileName(event.target.files?.[0]?.name || "");
  };

  const handleUpload = async () => {
    // API CALL: Connects to backend endpoint (POST /api/uploads)
    // send file payload with multipart/form-data to the backend
  };

  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Quick Upload</h2>
        <p className="mt-2 text-sm text-slate-500">Upload cover images, drafts, or author assets instantly.</p>
      </div>

      <div className="mt-6 space-y-4">
        <label className="block rounded-3xl border border-slate-300 bg-slate-50 p-4 text-sm text-slate-700">
          <span className="block text-sm font-medium">Select file</span>
          <input type="file" onChange={handleFileChange} className="mt-3 w-full text-sm text-slate-700" />
        </label>

        {fileName && <p className="text-sm text-slate-600">Selected file: {fileName}</p>}

        <button
          type="button"
          onClick={handleUpload}
          className="w-full rounded-full bg-amber-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-800"
        >
          Upload Files
        </button>
      </div>
    </div>
  );
};

export default QuickUpload;