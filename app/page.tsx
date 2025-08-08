"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { SolutionCard } from "@/components/SolutionCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BookOpen, Search, Sparkles, TrendingUp } from "lucide-react";

interface Solution {
  id: string;
  labName: string;
  videoUrl: string;
  createdAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  comments?: string;
  postedBy?: string;
}

export default function Home() {
  const [solutions, setSolutions] = useState<Solution[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSolutions();
  }, []);

  const fetchSolutions = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/solutions");
      if (response.ok) {
        const data = await response.json();
        setSolutions(data);
      }
    } catch (error) {
      console.error("Error fetching solutions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSolutions = solutions.filter((solution) =>
    solution.labName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyCount = (difficulty: string) => {
    return filteredSolutions.filter((s) => s.difficulty === difficulty).length;
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />

      {/* Hero Section - Google Style */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 bg-clip-text text-transparent">
                <h1 className="text-5xl font-bold tracking-tight">
                  Google Cloud Arcade
                </h1>
              </div>
            </div>
            <h2 className="text-2xl font-light text-gray-600 mb-2">
              Cohort 2 Solutions Hub
            </h2>
            <p className="text-lg text-gray-500 mb-12 max-w-2xl mx-auto font-light">
              Discover and share video solutions for Google Cloud Platform labs.
              Learn together, grow together.
            </p>

            <div className="max-w-2xl mx-auto">
              <SearchBar
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search labs (e.g., 'Cloud Functions', 'Kubernetes')..."
              />
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
              {/* Total Solutions Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-gray-900">
                      {solutions.length}
                    </p>
                    <p className="text-sm text-gray-500">Total Solutions</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-blue-500" />
                </div>
              </div>

              {/* Easy Labs Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-green-600">
                      {getDifficultyCount("Easy")}
                    </p>
                    <p className="text-sm text-gray-500">Easy Labs</p>
                  </div>
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Medium Labs Card */}
              <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-yellow-600">
                      {getDifficultyCount("Medium")}
                    </p>
                    <p className="text-sm text-gray-500">Medium Labs</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Hard Labs Card */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-2xl font-medium text-red-600">
                      {getDifficultyCount("Hard")}
                    </p>
                    <p className="text-sm text-gray-500">Hard Labs</p>
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
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-normal text-gray-900 mb-1">
                  Lab Solutions
                </h2>
                <p className="text-gray-500">
                  {filteredSolutions.length} solution
                  {filteredSolutions.length !== 1 ? "s" : ""} available
                </p>
              </div>
              {searchTerm && (
                <div className="flex items-center text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
                  <Search className="h-4 w-4 mr-2" />
                  <span className="text-sm">Results for "{searchTerm}"</span>
                </div>
              )}
            </div>

            {filteredSolutions.length === 0 ? (
              <div className="text-center py-24">
                <div className="bg-white rounded-2xl border border-gray-200 p-12 max-w-md mx-auto shadow-sm">
                  <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-6" />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">
                    {searchTerm ? "No solutions found" : "No solutions yet"}
                  </h3>
                  <p className="text-gray-500 mb-8 leading-relaxed">
                    {searchTerm
                      ? "Try adjusting your search terms or browse all available solutions"
                      : "Be the first to contribute a lab solution and help your fellow learners"}
                  </p>
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="inline-flex items-center px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
                    >
                      Show All Solutions
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredSolutions.map((solution, index) => (
                  <div
                    key={solution.id}
                    className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <SolutionCard
                      labName={solution.labName}
                      videoUrl={solution.videoUrl}
                      createdAt={solution.createdAt}
                      difficulty={solution.difficulty}
                      comments={solution?.comments}
                      postedBy={solution?.postedBy}
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
