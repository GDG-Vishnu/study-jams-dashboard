"use client";
import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  Trophy,
  Award,
  Users,
  Calendar,
  Gamepad2,
  BookOpen,
  Brain,
  AlertCircle,
  CheckCircle,
  Eye,
  ExternalLink,
} from "lucide-react";
import { Header } from "@/components/Header";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useDateUpdated } from "@/components/DateUpdatedContext";

// Helpers to parse cell values safely
const parseNameList = (names: string) =>
  names
    ? names
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
const parseIntOrZero = (val: string | number | undefined) => {
  if (val == null || val === "") return 0;
  const parsed = typeof val === "number" ? val : parseInt(String(val), 10);
  return isNaN(parsed) ? 0 : parsed;
};

export default function ReportPage() {
  const [data, setData] = useState<Record<string, string>[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(""); // <-- Search state
  const [currentPage, setCurrentPage] = useState(0);
  const { dateUpdated } = useDateUpdated();
  const entriesPerPage = 10;

  // Authoritative Google Sheets CSV URL (input box is hidden)
  const SHEET_CSV_URL =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vTNnaflVGXWEspwAbHtc-LI1_t6DTpi28nmWspyjObwgrVhazFzdMqddSom0KlKxFn4_1_igDaDvF6V/pub?output=csv";

  // Derived summaries for stat cards
  const totalUsers = data.length;
  const activeUsers = data.filter(
    (row) => row["Profile URL Status"] === "All Good"
  ).length;
  const accessCodeRedemptions = data.filter(
    (row) => row["Access Code Redemption Status"] === "Yes"
  ).length;
  // Count participants whose total badges (skill + arcade + trivia + lab) equals 20
  const milestonesEarned = data.filter((row) => {
    const totalBadges =
      parseIntOrZero(row["# of Skill Badges Completed"]) +
      parseIntOrZero(row["# of Arcade Games Completed"]) +
      parseIntOrZero(row["# of Trivia Games Completed"] || 0) +
      parseIntOrZero(row["# of Lab/Free Course Completed"] || 0);
    return totalBadges === 20;
  }).length;

  // Leaderboard: top 3 by total badges
  const leaderboard = [...data]
    .map((row, idx) => ({
      rank: idx + 1,
      userName: row["User Name"],
      userEmail: row["User Email"],
      totalBadges:
        parseIntOrZero(row["# of Skill Badges Completed"]) +
        parseIntOrZero(row["# of Arcade Games Completed"]) +
        parseIntOrZero(row["# of Trivia Games Completed"] || 0) +
        parseIntOrZero(row["# of Lab/Free Course Completed"] || 0),
      skillBadges: parseIntOrZero(row["# of Skill Badges Completed"]),
      arcadeGames: parseIntOrZero(row["# of Arcade Games Completed"]),
      triviaGames: parseIntOrZero(row["# of Trivia Games Completed"] || 0),
      labFreeCourses: parseIntOrZero(
        row["# of Lab/Free Course Completed"] || 0
      ),
      profileUrl: row["Google Cloud Skills Boost Profile URL"],
    }))
    .sort((a, b) => b.totalBadges - a.totalBadges)
    .slice(0, 3);

  const fetchGoogleSheetData = async (url?: string) => {
    try {
      setLoading(true);
      setError("");

      const csvUrl = url && url.trim() ? url : SHEET_CSV_URL;

      const response = await fetch(csvUrl);
      if (!response.ok) {
        throw new Error(
          "Failed to fetch sheet data. Make sure the sheet is publicly accessible."
        );
      }

      const csvText = await response.text();
      const parsed = Papa.parse(csvText, { header: true });

      if (parsed.data && Array.isArray(parsed.data)) {
        setData(parsed.data as Record<string, string>[]);
      } else {
        throw new Error("No data found in the sheet");
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load data");
      setLoading(false);
    }
  };

  // auto-load authoritative sheet on mount
  useEffect(() => {
    fetchGoogleSheetData(SHEET_CSV_URL);
    // Listen for leaderboard update notifications (keep re-fetch behavior)
    let bc: BroadcastChannel | null = null;
    try {
      bc = new BroadcastChannel("leaderboard_updates");
      bc.onmessage = (ev) => {
        const msg = ev.data;
        if (msg && msg.type === "leaderboard:updated") {
          // re-fetch authoritative data when leaderboard is updated
          fetchGoogleSheetData(SHEET_CSV_URL);
        }
      };
    } catch (err) {
      bc = null;
    }

    // storage event fallback (other tabs) only for leaderboard updates
    const onStorage = (e: StorageEvent) => {
      if (e.key === "leaderboard_updates_fallback") {
        // possible notification — re-fetch
        fetchGoogleSheetData(SHEET_CSV_URL);
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      try {
        window.removeEventListener("storage", onStorage);
      } catch (e) {}
      try {
        if (bc) bc.close();
      } catch (e) {}
    };
  }, []);

  // --- SEARCH LOGIC ---
  const filteredData = data.filter((row) => {
    const userName = (row["User Name"] || "").toLowerCase();
    const userEmail = (row["User Email"] || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return userName.includes(query) || userEmail.includes(query);
  });

  // Reset to first page whenever the filter changes
  useEffect(() => {
    setCurrentPage(0);
  }, [searchQuery, filteredData.length]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredData.length / entriesPerPage)
  );
  const pageStart = currentPage * entriesPerPage;
  const pageData = filteredData.slice(pageStart, pageStart + entriesPerPage);

  // Dialog state for showing badges
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<Record<string, string> | null>(
    null
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-3xl font-normal text-gray-900">
              Daily Progress Report
            </h1>
            <p className="text-gray-600 mt-1">
              Gen AI Study Jams Cohort 2 Analytics
            </p>
          </div>
      
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {totalUsers}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Participants</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {activeUsers}
                </p>
                <p className="text-sm text-gray-600 mt-1">Active Learners</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {accessCodeRedemptions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Access Code Redemptions
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {milestonesEarned}
                </p>
                <p className="text-sm text-gray-600 mt-1">Milestones Earned</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Leaderboard Top 3 */}
        {leaderboard.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm w-full mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Trophy className="h-5 w-5 text-yellow-500 mr-2" /> Top 3
                Leaderboard
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Based on Arcade, Trivia, and Skill Badges completions
              </p>
            </div>
            <div className="p-4 space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.rank}
                  className="p-3 rounded-xl border transition-all"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full gap-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-gray-700">
                        {entry.rank}
                      </span>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                          {entry.userName}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {entry.userEmail}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                        {entry.totalBadges}
                      </div>
                      <div className="text-xs text-gray-500">Total Badges</div>
                    </div>
                    <div className="flex flex-wrap gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        <Award className="h-4 w-4 text-blue-500" />
                        <span className="text-gray-600">
                          {entry.skillBadges} Skills
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Gamepad2 className="h-4 w-4 text-green-500" />
                        <span className="text-gray-600">
                          {entry.arcadeGames} Arcade
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Brain className="h-4 w-4 text-purple-500" />
                        <span className="text-gray-600">
                          {entry.triviaGames} Trivia
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4 text-orange-500" />
                        <span className="text-gray-600">
                          {entry.labFreeCourses} Courses
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search UI + Data Table */}
        <div className="w-full mb-8">
          <div className="flex flex-col items-center justify-between mb-4 sm:flex-col">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Detailed Progress Report
            </h2>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name or email..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 18.5a7.5 7.5 0 006.15-3.85z"
                />
              </svg>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              {loading ? (
                <div className="px-4 py-8 text-center text-gray-600">
                  Loading data...
                </div>
              ) : filteredData.length === 0 ? (
                <div className="px-4 py-8 text-center text-gray-600">
                  No data found. Please check your sheet or try a different
                  search.
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        RANKING
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        User
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        Email
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        Profile Status
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        Access Code Redemption
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        Milestone Earned
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        Total Badges
                      </th>
                      <th className="px-4 py-4 text-left text-sm font-semibold text-gray-900">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 font-semibold text-gray-700">
                          {pageStart + idx + 1}
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-900">
                          {row["User Name"]}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {row["User Email"]}
                        </td>
                        <td className="px-4 py-4">
                          <span className="inline-flex px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {row["Profile URL Status"]}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {row["Access Code Redemption Status"]}
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-500">
                          {row["All Skill Badges & Games Completed"]}
                        </td>
                        <td className="px-4 py-4 font-semibold text-blue-700">
                          {parseIntOrZero(row["# of Skill Badges Completed"]) +
                            parseIntOrZero(row["# of Arcade Games Completed"]) +
                            parseIntOrZero(
                              row["# of Trivia Games Completed"] || 0
                            ) +
                            parseIntOrZero(
                              row["# of Lab/Free Course Completed"] || 0
                            )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => {
                                setSelectedRow(row);
                                setIsDialogOpen(true);
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <a
                              href={
                                row["Google Cloud Skills Boost Profile URL"]
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              {/* Badges dialog */}
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                  <DialogTitle>Badges obtained</DialogTitle>
                  <DialogDescription>
                    {selectedRow ? (
                      <div className="space-y-4 mt-3">
                        <div>
                          <h4 className="font-medium">Skill Badges</h4>
                          <div className="text-sm text-gray-700">
                            {parseNameList(
                              selectedRow["Names of Completed Skill Badges"]
                            ).length > 0 ? (
                              <ul className="list-disc pl-5 mt-2">
                                {parseNameList(
                                  selectedRow["Names of Completed Skill Badges"]
                                ).map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-sm text-gray-500">None</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Arcade Games</h4>
                          <div className="text-sm text-gray-700">
                            {parseNameList(
                              selectedRow["Names of Completed Arcade Games"]
                            ).length > 0 ? (
                              <ul className="list-disc pl-5 mt-2">
                                {parseNameList(
                                  selectedRow["Names of Completed Arcade Games"]
                                ).map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-sm text-gray-500">None</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Trivia Games</h4>
                          <div className="text-sm text-gray-700">
                            {parseNameList(
                              selectedRow["Names of Completed Trivia Games"] ||
                                ""
                            ).length > 0 ? (
                              <ul className="list-disc pl-5 mt-2">
                                {parseNameList(
                                  selectedRow[
                                    "Names of Completed Trivia Games"
                                  ] || ""
                                ).map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-sm text-gray-500">None</div>
                            )}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Lab / Free Courses</h4>
                          <div className="text-sm text-gray-700">
                            {parseNameList(
                              selectedRow[
                                "Names of Completed Lab/Free Course"
                              ] || ""
                            ).length > 0 ? (
                              <ul className="list-disc pl-5 mt-2">
                                {parseNameList(
                                  selectedRow[
                                    "Names of Completed Lab/Free Course"
                                  ] || ""
                                ).map((b, i) => (
                                  <li key={i}>{b}</li>
                                ))}
                              </ul>
                            ) : (
                              <div className="text-sm text-gray-500">None</div>
                            )}
                          </div>
                        </div>

                        <div className="pt-2 border-t">
                          <div className="text-sm text-gray-700">
                            Total badges:{" "}
                            <span className="font-medium">
                              {parseIntOrZero(
                                selectedRow["# of Skill Badges Completed"]
                              ) +
                                parseIntOrZero(
                                  selectedRow["# of Arcade Games Completed"]
                                ) +
                                parseIntOrZero(
                                  selectedRow["# of Trivia Games Completed"] ||
                                    0
                                ) +
                                parseIntOrZero(
                                  selectedRow[
                                    "# of Lab/Free Course Completed"
                                  ] || 0
                                )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>No participant selected.</div>
                    )}
                  </DialogDescription>
                </DialogContent>
              </Dialog>
              {/* Pagination controls */}
              <div className="px-4 py-3 border-t bg-white sm:flex sm:items-center sm:justify-between">
                <div className="flex items-center justify-center sm:justify-start gap-3">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage <= 0}
                    className="px-3 py-1 rounded-md border bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Prev
                  </button>
                  <span className="mx-2 text-sm text-gray-600">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <button
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages - 1, p + 1))
                    }
                    disabled={currentPage >= totalPages - 1}
                    className="px-3 py-1 rounded-md border bg-white text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
                <div className="mt-2 sm:mt-0 text-sm text-gray-500 text-center sm:text-right">
                  Showing {pageStart + 1} -{" "}
                  {Math.min(pageStart + entriesPerPage, filteredData.length)} of{" "}
                  {filteredData.length}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
