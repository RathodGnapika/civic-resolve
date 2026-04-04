import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { submitComplaint } from "@/lib/complaints";

function AuthGuard({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 gap-4">
      <div className="text-5xl mb-2">🔒</div>
      <h2 className="text-2xl font-bold text-gray-800">Login required</h2>
      <p className="text-gray-500 max-w-sm">
        You must be logged in to submit a complaint so we can track it for you.
      </p>
      <button
        onClick={onLogin}
        className="mt-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Log in / Register
      </button>
    </div>
  );
}

export default function SubmitComplaint() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [text, setText] = useState("");

  const [submitted, setSubmitted] = useState(false);
  const [trackingId, setTrackingId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
      setUserEmail(data.session?.user?.email ?? "");
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
      setUserEmail(session?.user?.email ?? "");
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (isLoggedIn === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-400">
        Checking session…
      </div>
    );
  }

  if (!isLoggedIn) {
    return <AuthGuard onLogin={() => navigate("/login")} />;
  }

  async function handleSubmit() {
    if (!name.trim() || !location.trim() || !text.trim()) {
      setError("Please fill in all fields before submitting.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const complaint = await submitComplaint(name, location, text);
      setTrackingId(complaint.tracking_id);
      setSubmitted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 gap-4">
        <div className="text-5xl mb-2">✅</div>
        <h2 className="text-2xl font-bold text-gray-800">Complaint submitted!</h2>
        <p className="text-gray-500 max-w-sm">
          Your complaint has been registered. Save your tracking ID below — you'll need it to check status.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg px-6 py-4 my-2">
          <p className="text-xs text-blue-500 uppercase font-medium mb-1">Your Tracking ID</p>
          <p className="text-2xl font-bold text-blue-700 font-mono">{trackingId}</p>
        </div>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate("/complaints")}
            className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
          >
            View my complaints
          </button>
          <button
            onClick={() => { setSubmitted(false); setName(""); setLocation(""); setText(""); }}
            className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-50 transition-colors"
          >
            Submit another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-lg p-6">
      <h1 className="text-3xl font-bold mb-1">Submit a Complaint</h1>
      <p className="text-gray-500 text-sm mb-6">
        Logged in as <strong>{userEmail}</strong>
      </p>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => { setName(e.target.value); setError(""); }}
            placeholder="e.g. Rahul Sharma"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
          <input
            type="text"
            value={location}
            onChange={(e) => { setLocation(e.target.value); setError(""); }}
            placeholder="e.g. MG Road, Block 4, Bengaluru"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Describe the issue</label>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); setError(""); }}
            rows={4}
            placeholder="Describe the problem in detail. We'll automatically classify the department and priority."
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />
          <p className="text-xs text-gray-400 mt-1">
            Department and priority are auto-detected from your description.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
        >
          {loading ? "Submitting…" : "Submit Complaint"}
        </button>
      </div>
    </div>
  );
}