"use client";
import React from "react";
import DateUpdatedForm from "@/components/DateUpdatedForm";

function FileUPloadPreview() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-xl border p-6">
        <h2 className="text-lg font-semibold mb-4">
          Admin - Update Leaderboard
        </h2>
        <div className="mb-4">
          <DateUpdatedForm />
        </div>
        <div className="text-sm text-gray-500">
          Use the form above to set the "last updated" timestamp for the report.
          Submitting will save the value and notify report pages.
        </div>
      </div>
    </div>
  );
}

export default FileUPloadPreview;
