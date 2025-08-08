"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { SearchBar } from "@/components/SearchBar";
import { SolutionCard } from "@/components/SolutionCard";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { BookOpen, Search } from "lucide-react";

interface Solution {
  id: string;
  labName: string;
  videoUrl: string;
  createdAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  comments?: string;
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <h1 className="text-4xl font-bold">Google Cloud Arcade Cohort 2</h1>
          </div>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Find and share YouTube video solutions for all your GCP lab
            exercises
          </p>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search for labs (e.g., 'Cloud Functions', 'Kubernetes')..."
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Lab Solutions ({filteredSolutions.length})
              </h2>
              {searchTerm && (
                <div className="flex items-center text-gray-600">
                  <Search className="h-4 w-4 mr-2" />
                  <span>Searching for "{searchTerm}"</span>
                </div>
              )}
            </div>

            {filteredSolutions.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? "No solutions found" : "No solutions yet"}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm
                    ? "Try a different search term or browse all solutions"
                    : "Be the first to contribute a lab solution!"}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Show All Solutions
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSolutions.map((solution) => (
                  <SolutionCard
                    key={solution.id}
                    labName={solution.labName}
                    videoUrl={solution.videoUrl}
                    createdAt={solution.createdAt}
                    difficulty={solution.difficulty}
                    comments={solution?.comments}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}
