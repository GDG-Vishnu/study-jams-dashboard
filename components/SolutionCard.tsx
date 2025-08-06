"use client";

import { ExternalLink, Youtube } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SolutionCardProps {
  labName: string;
  videoUrl: string;
  createdAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
}

export function SolutionCard({
  labName,
  videoUrl,
  createdAt,
  difficulty,
}: SolutionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleVideoClick = () => {
    window.open(videoUrl, "_blank", "noopener,noreferrer");
  };

  const difficultyStyles = {
    Easy: "bg-green-100 text-green-800 border-green-200",
    Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Hard: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-green-500">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
            {labName}
          </CardTitle>
          {difficulty && (
            <span
              className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border whitespace-nowrap ${
                difficultyStyles[difficulty] || difficultyStyles.Easy
              }`}
            >
              {difficulty}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">
          Added on {formatDate(createdAt)}
        </p>
      </CardHeader>
      <CardContent>
        <button
          onClick={handleVideoClick}
          className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 group"
        >
          <Youtube className="h-5 w-5" />
          Watch Solution
          <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
        </button>
      </CardContent>
    </Card>
  );
}
