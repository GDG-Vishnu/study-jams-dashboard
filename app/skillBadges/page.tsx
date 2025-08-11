"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { SkillBadgeCard } from "@/components/SkillBadgeCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { Award, Search, Sparkles, Filter, Plus } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface SkillBadge {
  id: string;
  skillbadgeName: string;
  skillbadgeUrl: string;
  createdAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  comments?: string;
  postedBy?: string;
}

export default function SkillBadges() {
  const [skillBadges, setSkillBadges] = useState<SkillBadge[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkillBadges();
  }, []);

  const fetchSkillBadges = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/skillbadges");
      if (response.ok) {
        const data = await response.json();
        setSkillBadges(data);
      }
    } catch (error) {
      console.error("Error fetching skill badges:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSkillBadges = skillBadges.filter((badge) => {
    const matchesSearch = badge.skillbadgeName
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDifficulty =
      difficultyFilter === "all" || badge.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const getDifficultyCount = (difficulty: string) => {
    const badges =
      difficultyFilter === "all" ? skillBadges : filteredSkillBadges;
    return badges.filter((b) => b.difficulty === difficulty).length;
  };

  const getTotalCount = () => {
    return difficultyFilter === "all"
      ? skillBadges.length
      : filteredSkillBadges.length;
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                <h1 className="text-5xl font-bold tracking-tight">
                  Skill Badges Hub
                </h1>
              </div>
            </div>
            <h2 className="text-2xl font-light text-gray-600 mb-2">
              Share and Inspire with Skill Badges
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto font-light">
              Share the skill badges you've completed along with their
              difficulty levels to guide and inspire others on their learning
              journey.
            </p>

            {/* Search and Filter Section */}
            <div className="max-w-4xl mx-auto space-y-4">
              <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="flex-1 w-full">
                  <SearchBar
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Search skill badges (e.g., 'Cloud Security', 'Data Engineering')..."
                  />
                </div>
                <div className="w-full md:w-64">
                  <Select
                    value={difficultyFilter}
                    onValueChange={setDifficultyFilter}
                  >
                    <SelectTrigger className="h-12 text-base border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 bg-white shadow-sm">
                      <div className="flex items-center">
                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                        <SelectValue placeholder="Filter by difficulty" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Difficulties</SelectItem>
                      <SelectItem value="Easy">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                          Easy
                        </div>
                      </SelectItem>
                      <SelectItem value="Medium">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-500 rounded-full mr-3"></div>
                          Medium
                        </div>
                      </SelectItem>
                      <SelectItem value="Hard">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                          Hard
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {/* Total Badges Card */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-gray-900">
                      {getTotalCount()}
                    </p>
                    <p className="text-sm text-gray-500">Total Badges</p>
                  </div>
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
              </div>

              {/* Easy Badges Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-green-600">
                      {getDifficultyCount("Easy")}
                    </p>
                    <p className="text-sm text-gray-500">Easy Badges</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Medium Badges Card */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-yellow-600">
                      {getDifficultyCount("Medium")}
                    </p>
                    <p className="text-sm text-gray-500">Medium Badges</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Hard Badges Card */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-red-600">
                      {getDifficultyCount("Hard")}
                    </p>
                    <p className="text-sm text-gray-500">Hard Badges</p>
                  </div>
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <LoadingSpinner />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl font-normal text-gray-900 mb-1">
                  Skill Badges
                </h2>
                <p className="text-gray-500">
                  {filteredSkillBadges.length} badge
                  {filteredSkillBadges.length !== 1 ? "s" : ""} available
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {(searchTerm || difficultyFilter !== "all") && (
                  <div className="flex items-center text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                    <Search className="h-4 w-4 mr-2" />
                    <span className="text-sm">
                        Results for {" "}
                      {searchTerm && `"${searchTerm}"`}
                      {searchTerm && difficultyFilter !== "all" && " • "}
                      {difficultyFilter !== "all" && `${difficultyFilter} only`}
                    </span>
                  </div>
                )}
                {(searchTerm || difficultyFilter !== "all") && (
                  <button
                    onClick={() => {
                      setSearchTerm("");
                      setDifficultyFilter("all");
                    }}
                    className="text-sm text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-full border border-blue-200 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>

            {filteredSkillBadges.length === 0 ? (
              <div className="text-center py-24">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 max-w-md mx-auto shadow-sm">
                  <Award className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    {searchTerm || difficultyFilter !== "all"
                      ? "No Badge found"
                      : "No Badges posted yet"}
                  </h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    {searchTerm || difficultyFilter !== "all"
                      ? "Try adjusting your search terms or filters to find what you're looking for"
                      : "Be the first to share a Badge and help others understand this skill badge"}
                  </p>
                  {(searchTerm || difficultyFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setDifficultyFilter("all");
                      }}
                      className="inline-flex items-center px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Show All Badges
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSkillBadges.map((badge, index) => (
                  <div
                    key={badge.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <SkillBadgeCard
                      skillbadgeName={badge.skillbadgeName}
                      skillbadgeUrl={badge.skillbadgeUrl}
                      createdAt={badge.createdAt}
                      difficulty={badge.difficulty}
                      comments={badge?.comments}
                      postedBy={badge?.postedBy}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
