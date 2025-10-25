"use client";
import React, { useEffect, useState } from "react";
import { useDateUpdated } from "@/components/DateUpdatedContext";

export default function DateUpdatedForm() {
  const { dateUpdated, setDateUpdated } = useDateUpdated();
  const [value, setValue] = useState<string>("");

  // Convert ISO to datetime-local input value
  const isoToLocalDatetime = (iso?: string) => {
    if (!iso) return "";
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
      d.getDate()
    )}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  useEffect(() => {
    if (dateUpdated) setValue(isoToLocalDatetime(dateUpdated));
  }, [dateUpdated]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const toStoreIso = value
      ? new Date(value).toISOString()
      : new Date().toISOString();
    // Update global state (no localStorage)
    setDateUpdated(toStoreIso);
    // keep local input in sync
    setValue(isoToLocalDatetime(toStoreIso));
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
