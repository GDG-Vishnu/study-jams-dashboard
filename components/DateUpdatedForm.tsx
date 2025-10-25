"use client";
import React, { useEffect, useState } from "react";

export default function DateUpdatedForm() {
  const [value, setValue] = useState<string>("");

  // Convert ISO (stored) to datetime-local input value
  const isoToLocalDatetime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    try {
      const existing = localStorage.getItem("dateUpdated");
      if (existing) setValue(isoToLocalDatetime(existing));
    } catch (e) {
      // ignore
    }
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    // If empty, use now
    const toStoreIso = value
      ? new Date(value).toISOString()
      : new Date().toISOString();
    try {
      localStorage.setItem("dateUpdated", toStoreIso);
      // Broadcast to other tabs/clients
      try {
        const bc = new BroadcastChannel("leaderboard_updates");
        bc.postMessage({ type: "dateUpdated", value: toStoreIso });
        bc.close();
      } catch (err) {
        // BroadcastChannel may not be available in some envs; fall back to storage key toggle
        localStorage.setItem(
          "leaderboard_updates_fallback",
          String(Date.now())
        );
      }
      // small feedback: update local value to formatted local value
      setValue(isoToLocalDatetime(toStoreIso));
    } catch (err) {
      // ignore storage errors
      console.error("Failed to save dateUpdated", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <label className="text-sm text-gray-700">Report updated at</label>
      <input
        type="datetime-local"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="px-3 py-2 border rounded-md"
      />
      <button
        type="submit"
        className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
