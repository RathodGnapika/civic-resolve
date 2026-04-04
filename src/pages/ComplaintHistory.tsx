import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { getUserComplaints, getComplaintByTrackingId, type Complaint } from "@/lib/complaints";

const statusStyles: Record<string, string> = {
  resolved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  "in progress": "bg-blue-100 text-blue-800",
  rejected: "bg-red-100 text-red-800",
};

const priorityStyles: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-gray-100 text-gray-600",
};

function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  return (
    <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusStyles[s] ?? "bg-gray-100 text-gray-700"}`}>
      {status}
    </span>
  );
}

function AuthGuard({ onLogin }: { onLogin: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8 gap-4">
      <div className="text-5xl mb-2">🔒</div>
      <h2 className="text-2xl font-bold text-gray-800">Login required</h2>
      <p className="text-gray-500 max-w-sm">
        You need to be logged in to view your complaint history or track a complaint.
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

type Tab = "track" | "history";

export default function ComplaintHistory() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>("track");

  // Track tab
  const [trackInput, setTrackInput] = useState("");
  const [trackResult, setTrackResult] = useState<Complaint | null | "idle">("idle");
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackError, setTrackError] = useState("");

  // History tab
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setIsLoggedIn(!!data.session);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setIsLoggedIn(!!session);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (tab === "history" && isLoggedIn) {
      setHistoryLoading(true);
      setHistoryError("");
      getUserComplaints()
        .then((data) => setComplaints(data))
        .catch((e) => setHistoryError(e.message))
        .finally(() => setHistoryLoading(false));
    }
  }, [tab, isLoggedIn]);

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

  async function handleTrack() {
    const id = trackInput.trim();
    if (!id) return;
    setTrackLoading(true);
    setTrackError("");
    setTrackResult("idle");

    const result = await getComplaintByTrackingId(id);
    if (!result) {
      setTrackResult(null);
      setTrackError(`No complaint found for "${id.toUpperCase()}". Make sure you're using the correct ID (format: CMP-XXXX) and are logged into the same account used to submit it.`);
    } else {
      setTrackResult(result);
    }
    setTrackLoading(false);
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-1">Complaint Centre</h1>
      <p className="text-gray-500 mb-6 text-sm">Track your complaint or view your full history.</p>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {(["track", "history"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              tab === t
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {t === "track" ? "Track by ID" : "My History"}
          </button>
        ))}
      </div>

      {/* Track tab */}
      {tab === "track" && (
        <div>
          <p className="text-sm text-gray-500 mb-3">
            Enter the tracking ID you received when you submitted your complaint.
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={trackInput}
              onChange={(e) => { setTrackInput(e.target.value); setTrackError(""); setTrackResult("idle"); }}
              onKeyDown={(e) => e.key === "Enter" && handleTrack()}
              placeholder="e.g. CMP-7284"
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleTrack}
              disabled={trackLoading}
              className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {trackLoading ? "Searching…" : "Track"}
            </button>
          </div>

          {trackError && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
              {trackError}
            </div>
          )}

          {trackResult && trackResult !== "idle" && (
            <Card className="border-blue-100 mt-2">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span className="text-base">{trackResult.department}</span>
                  <StatusBadge status={trackResult.status} />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Tracking ID:</span>
                  <strong className="font-mono text-blue-700">{trackResult.tracking_id}</strong>
                </div>
                <p><span className="text-gray-500">Submitted by:</span> {trackResult.name}</p>
                <p><span className="text-gray-500">Location:</span> {trackResult.location}</p>
                <p><span className="text-gray-500">Description:</span> {trackResult.complaint_text}</p>
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Priority:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${priorityStyles[trackResult.priority] ?? ""}`}>
                    {trackResult.priority}
                  </span>
                </div>
                {trackResult.created_at && (
                  <p className="text-gray-400 text-xs">
                    Submitted: {new Date(trackResult.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* History tab */}
      {tab === "history" && (
        <div className="grid gap-4">
          {historyLoading && (
            <p className="text-center text-gray-400 py-12">Loading your complaints…</p>
          )}
          {historyError && (
            <p className="text-center text-red-500 py-4">{historyError}</p>
          )}
          {!historyLoading && !historyError && complaints.length === 0 && (
            <div className="text-center text-gray-400 py-12">
              <p className="text-4xl mb-3">📋</p>
              <p>No complaints submitted yet.</p>
              <button
                onClick={() => navigate("/submit")}
                className="mt-4 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50"
              >
                Submit your first complaint
              </button>
            </div>
          )}
          {!historyLoading && complaints.map((c) => (
            <Card key={c.id}>
              <CardHeader>
                <CardTitle className="flex justify-between items-center text-base">
                  <span>{c.department}</span>
                  <StatusBadge status={c.status} />
                </CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Tracking ID:</span>
                  <strong className="font-mono text-blue-700">{c.tracking_id}</strong>
                </div>
                <p><span className="text-gray-500">Location:</span> {c.location}</p>
                <p><span className="text-gray-500">Description:</span> {c.complaint_text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-gray-500 text-xs">Priority:</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${priorityStyles[c.priority] ?? ""}`}>
                    {c.priority}
                  </span>
                </div>
                {c.created_at && (
                  <p className="text-gray-400 text-xs mt-1">
                    Submitted: {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}