"use client";
import React, { useState, useEffect } from "react";
import {
  Trophy,
  Medal,
  Award,
  Users,
  Calendar,
  Download,
  ChevronDown,
  Star,
  Target,
  Gamepad2,
  BookOpen,
  Brain,
  Upload,
  AlertCircle,
  CheckCircle,
  Eye,
  ExternalLink,
  Search,
} from "lucide-react";
import Papa from "papaparse";
import { Header } from "@/components/Header";

// Types
interface ReportData {
  id: number;
  userName: string;
  userEmail: string;
  profileUrl: string;
  profileStatus: string;
  accessCodeRedemption: string;
  milestoneEarned: string;
  skillBadgesCount: number;
  skillBadgeNames: string[];
  arcadeGamesCount: number;
  arcadeGameNames: string[];
  triviaGamesCount: number;
  triviaGameNames: string[];
  labFreeCourseCount: number;
  labFreeCourseNames: string[];
  totalBadges: number;
}

interface LeaderboardEntry {
  rank: number;
  userName: string;
  userEmail: string;
  totalBadges: number;
  skillBadges: number;
  arcadeGames: number;
  triviaGames: number;
  labFreeCourses: number;
}

// Custom DataGrid Component
const DataGrid = ({ data }: { data: ReportData[] }) => {
  const [sortField, setSortField] = useState<keyof ReportData>("totalBadges");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedRow, setSelectedRow] = useState<ReportData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;

  const filteredData = data.filter(
    (row) =>
      row.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      row.userEmail.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];

    if (typeof aVal === "number" && typeof bVal === "number") {
      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return sortDirection === "asc"
      ? aStr.localeCompare(bStr)
      : bStr.localeCompare(aStr);
  });

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + rowsPerPage);

  const handleSort = (field: keyof ReportData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const DropdownCell = ({ items, type }: { items: string[]; type: string }) => {
    const [isOpen, setIsOpen] = useState(false);

    if (items.length === 0) return <span className="text-gray-400">None</span>;

    return (
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1 bg-blue-50 hover:bg-blue-100 rounded-lg text-sm text-blue-700 border border-blue-200 transition-colors"
        >
          <span>
            {items.length} {type}
          </span>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-50 top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {items.map((item, index) => (
              <div
                key={index}
                className="px-3 py-2 text-sm border-b border-gray-100 last:border-b-0 hover:bg-gray-50"
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort("userName")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  User <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort("userEmail")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  Email <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort("profileStatus")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  Profile Status <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort("accessCodeRedemption")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  Access Code Redemption <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort("milestoneEarned")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  Milestone Earned <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort("totalBadges")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  Total Badges <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">
                <button
                  onClick={() => handleSort("skillBadgesCount")}
                  className="flex items-center gap-2 font-semibold text-gray-700 hover:text-blue-600"
                >
                  Skill Badges <ChevronDown className="h-4 w-4" />
                </button>
              </th>
              <th className="px-4 py-4 text-left">Arcade Games</th>
              <th className="px-4 py-4 text-left">Trivia Games</th>
              <th className="px-4 py-4 text-left">Lab Courses</th>
              <th className="px-4 py-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <td className="px-4 py-4">
                  <div>
                    <div className="font-medium text-gray-900">
                      {row.userName}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-500">{row.userEmail}</div>
                </td>
                <td className="px-4 py-4">
                  <div
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                      row.profileStatus === "All Good"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {row.profileStatus}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-500">
                    {row.accessCodeRedemption}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-500">
                    {row.milestoneEarned}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="bg-blue-100 px-3 py-1 rounded-full">
                      <span className="font-semibold text-blue-700">
                        {row.totalBadges}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <DropdownCell items={row.skillBadgeNames} type="badges" />
                </td>
                <td className="px-4 py-4">
                  <DropdownCell items={row.arcadeGameNames} type="games" />
                </td>
                <td className="px-4 py-4">
                  <DropdownCell items={row.triviaGameNames} type="trivia" />
                </td>
                <td className="px-4 py-4">
                  <DropdownCell items={row.labFreeCourseNames} type="courses" />
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedRow(row)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <a
                      href={row.profileUrl}
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
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-sm text-gray-600 text-center">
          Showing {startIndex + 1} to{" "}
          {Math.min(startIndex + rowsPerPage, sortedData.length)} of{" "}
          {sortedData.length} entries
        </div>
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm min-w-[60px] text-center">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded-lg border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Row Detail Modal */}
      {selectedRow && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedRow(null)} // Close modal when clicking outside
        >
          <div
            className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()} // Prevent event bubbling to overlay
          >
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">
                    {selectedRow.userName}
                  </h3>
                  <p className="text-gray-600">{selectedRow.userEmail}</p>
                </div>
                <button
                  onClick={() => setSelectedRow(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <div className="w-10 h-10 flex items-center justify-center text-lg">
                    ×
                  </div>
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Skill Badges ({selectedRow.skillBadgesCount})
                    </h4>
                    {selectedRow.skillBadgeNames.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedRow.skillBadgeNames.map((badge, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <Award className="h-4 w-4 text-blue-500 mr-2" />
                            {badge}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No skill badges completed</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Arcade Games ({selectedRow.arcadeGamesCount})
                    </h4>
                    {selectedRow.arcadeGameNames.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedRow.arcadeGameNames.map((game, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <Gamepad2 className="h-4 w-4 text-green-500 mr-2" />
                            {game}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No arcade games completed</p>
                    )}
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Trivia Games ({selectedRow.triviaGamesCount})
                    </h4>
                    {selectedRow.triviaGameNames.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedRow.triviaGameNames.map((trivia, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <Brain className="h-4 w-4 text-purple-500 mr-2" />
                            {trivia}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">No trivia games completed</p>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Lab-free Courses ({selectedRow.labFreeCourseCount})
                    </h4>
                    {selectedRow.labFreeCourseNames.length > 0 ? (
                      <ul className="space-y-1">
                        {selectedRow.labFreeCourseNames.map((course, idx) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center"
                          >
                            <BookOpen className="h-4 w-4 text-orange-500 mr-2" />
                            {course}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-400">
                        No lab-free courses completed
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface LeaderboardEntry {
  rank: number;
  userName: string;
  userEmail: string;
  totalBadges: number;
  skillBadges: number;
  arcadeGames: number;
  triviaGames: number;
  labFreeCourses: number;
}
// Leaderboard Component
const Leaderboard = ({ data }: { data: LeaderboardEntry[] }) => {
  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <span className="font-2xl font-bold">1</span>;
      case 2:
        return <span className="font-2xl font-bold">2</span>;
      case 3:
        return <span className="font-2xl font-bold">3</span>;
      default:
        return (
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
            {rank}
          </div>
        );
    }
  };

  const getRankBg = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200";
      case 2:
        return "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200";
      case 3:
        return "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200";
      default:
        return "bg-white border-gray-200";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm w-full">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500 mr-2" />
          Top 3 Leaderboard
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Based on Arcade, Trivia, and Skill Badges completions
        </p>
      </div>
      <div className="p-4 space-y-3">
        {data.slice(0, 3).map((entry) => (
          <div
            key={entry.rank}
            className={`p-3 rounded-xl border ${getRankBg(
              entry.rank
            )} transition-all hover:shadow-md`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between w-full text-overflow-ellipsis">
              <div className="flex items-center gap-3 mb-3 sm:mb-0">
                {getRankIcon(entry.rank)}
                <div className="w-48">
                  <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
                    {entry.userName}
                  </h4>
                  <p className="text-sm text-gray-600 text-overflow-ellipsis">
                    {entry.userEmail}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                  {entry.totalBadges}
                </div>
                <div className="text-xs text-gray-500 mb-3">Total Badges</div>
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-sm">
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
        ))}
      </div>
    </div>
  );
};

// Main Component
const DailyReportPage = () => {
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const parseNameList = (nameString: string): string[] => {
    if (!nameString || nameString.trim() === "") return [];
    return nameString
      .split(" | ")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  };

  const parseCsvFile = async () => {
    try {
      setLoading(true);
      setError(null);
      // Read the CSV file
      const response = await fetch("/report.csv");
      if (!response.ok) {
        throw new Error(
          'Failed to fetch report data. Please ensure "report.csv" is available in the public folder.'
        );
      }
      const csvContent = await response.text();

      Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        transformHeader: (header) => {
          // Clean up headers to match our expected format
          return header.trim();
        },
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn("CSV parsing warnings:", results.errors);
          }
          const parsedData: ReportData[] = results.data
            .map((row: any, index: number) => {
              const skillBadgesCount =
                parseInt(row["# of Skill Badges Completed"]) || 0;
              const arcadeGamesCount =
                parseInt(row["# of Arcade Games Completed"]) || 0;
              const triviaGamesCount =
                parseInt(row["# of Trivia Games Completed"]) || 0;
              const labFreeCourseCount =
                parseInt(row["# of Lab-free Courses Completed"]) || 0;
              const skillBadgeNames = parseNameList(
                row["Names of Completed Skill Badges"] || ""
              );
              const arcadeGameNames = parseNameList(
                row["Names of Completed Arcade Games"] || ""
              );
              const triviaGameNames = parseNameList(
                row["Names of Completed Trivia Games"] || ""
              );
              const labFreeCourseNames = parseNameList(
                row["Names of Completed Lab-free Courses"] || ""
              );
              return {
                id: index + 1,
                userName: row["User Name"] || "",
                userEmail: row["User Email"] || "",
                profileUrl: row["Google Cloud Skills Boost Profile URL"] || "",
                profileStatus: row["Profile URL Status"] || "",
                accessCodeRedemption:
                  row["Access Code Redemption Status"] || "",
                milestoneEarned: row["Milestone Earned"] || "None",
                skillBadgesCount,
                skillBadgeNames,
                arcadeGamesCount,
                arcadeGameNames,
                triviaGamesCount,
                triviaGameNames,
                labFreeCourseCount,
                labFreeCourseNames,
                totalBadges:
                  skillBadgesCount +
                  arcadeGamesCount +
                  triviaGamesCount +
                  labFreeCourseCount,
              };
            })
            .filter((item) => item.userName); // Filter out empty rows
          setReportData(parsedData);
          // Generate leaderboard
          const leaderboard: LeaderboardEntry[] = parsedData
            .map((user) => ({
              rank: 0,
              userName: user.userName,
              userEmail: user.userEmail,
              totalBadges:
                user.skillBadgesCount +
                user.arcadeGamesCount +
                user.triviaGamesCount, // Exclude labFreeCourseCount
              skillBadges: user.skillBadgesCount,
              arcadeGames: user.arcadeGamesCount,
              triviaGames: user.triviaGamesCount,
              labFreeCourses: user.labFreeCourseCount, // This can be kept for reference, but not used in totalBadges
            }))
            .sort((a, b) => b.totalBadges - a.totalBadges)
            .map((user, index) => ({ ...user, rank: index + 1 }));
          setLeaderboardData(leaderboard);

          setLoading(false);
        },
        //@ts-ignore
        error: (error) => {
          setError(`Failed to parse CSV: ${error.message}`);
          setLoading(false);
        },
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unknown error occurred while processing the report."
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    parseCsvFile();
  }, []);

  const stats = {
    totalUsers: reportData.length,
    totalBadges: reportData.reduce((sum, user) => sum + user.totalBadges, 0),
    activeUsers: reportData.filter((user) => user.totalBadges > 0).length,
    avgBadgesPerUser:
      reportData.length > 0
        ? Math.round(
            (reportData.reduce((sum, user) => sum + user.totalBadges, 0) /
              reportData.length) *
              10
          ) / 10
        : 0,
    accessCodeRedemptions: reportData.filter(
      (user) => user.accessCodeRedemption === "Yes"
    ).length,
    milestonesEarned: reportData.filter(
      (user) => user.milestoneEarned !== "None"
    ).length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading report data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#fafbfc] flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Report
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <p className="text-sm text-gray-500">
            Please make sure the 'report.csv' file is uploaded to the system.
          </p>
          <button
            onClick={parseCsvFile}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />
      <div className="">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-normal bg-[#fafbfc] text-gray-900">
                Daily Progress Report
              </h1>
              <p className="text-gray-600 mt-1">
                Google Cloud Skills Boost Cohort 2 Analytics
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>Updated: 06-09-2025</span>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalUsers}
                </p>
                <p className="text-sm text-gray-600">Total Participants</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.activeUsers}
                </p>
                <p className="text-sm text-gray-600">Active Learners</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.accessCodeRedemptions}
                </p>
                <p className="text-sm text-gray-600">Access Code Redemptions</p>
              </div>
              <CheckCircle className="h-8 w-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.milestonesEarned}
                </p>
                <p className="text-sm text-gray-600">Milestones Earned</p>
              </div>
              <Award className="h-8 w-8 text-purple-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard data={leaderboardData} />
          </div>

          {/* Data Table */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Detailed Progress Report
              </h2>
              <p className="text-gray-600">
                Complete breakdown of all participant progress
              </p>
            </div>
            <DataGrid data={reportData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReportPage;
