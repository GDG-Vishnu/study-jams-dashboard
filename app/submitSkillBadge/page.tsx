"use client";

import { Header } from "@/components/Header";

export default function SubmitSkillBadge() {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h1 className="text-2xl font-semibold">Submit Skill Badge Removed</h1>
        <p className="text-gray-500 mt-4">
          Skill badge submissions are disabled.
        </p>
      </main>
    </div>
  );
}
