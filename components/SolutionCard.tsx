"use client";
import {
  ExternalLink,
  Youtube,
  MessageSquare,
  Clock,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SolutionCardProps {
  labName: string;
  videoUrl: string;
  createdAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  comments?: string;
  postedBy?: string;
}

export function SolutionCard({
  labName,
  videoUrl,
  createdAt,
  difficulty,
  comments,
  postedBy,
}: SolutionCardProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return "Today";
    } else if (diffDays === 1) {
      return "Yesterday";
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  };

  const difficultyConfig = {
    Easy: {
      color: "text-green-700",
      bg: "bg-green-50",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    Medium: {
      color: "text-yellow-700",
      bg: "bg-yellow-50",
      border: "border-yellow-200",
      dot: "bg-yellow-500",
    },
    Hard: {
      color: "text-red-700",
      bg: "bg-red-50",
      border: "border-red-200",
      dot: "bg-red-500",
    },
  };

  const config = difficultyConfig[difficulty] || difficultyConfig.Easy;

  const handleOpenInNewTab = () => {
    window.open(videoUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <Card className="group bg-white border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 rounded-lg overflow-hidden hover:-translate-y-2 hover:scale-[1.03] hover:border-blue-200">
      {/* Card Header */}
      <CardHeader className="p-6 pb-4 bg-gradient-to-r from-blue-50/50 to-indigo-50/30 border-b border-gray-100">
        <div className="flex justify-between items-start gap-3">
          <CardTitle className="text-lg font-medium text-gray-900 leading-snug group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {labName}
          </CardTitle>
          <div
            className={`flex items-center px-3 py-1.5 text-xs font-medium rounded-full border whitespace-nowrap ${config.bg} ${config.color} ${config.border} shadow-sm`}
          >
            <div className={`w-2 h-2 rounded-full mr-2 ${config.dot}`}></div>
            {difficulty}
          </div>
        </div>
        <div className="flex items-center text-sm text-gray-500 mt-3">
          <Calendar className="h-4 w-4 mr-2" />
          <span>Added {formatDateTime(createdAt)}</span>
        </div>
      </CardHeader>

      {/* Card Content */}
      <CardContent className="p-6 pt-4">
        <div className="space-y-3">
          {comments ? (
            <div className="grid grid-cols-2 gap-3">
              {/* Watch Solution Button */}
              <button
                onClick={handleOpenInNewTab}
                className="bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 font-medium p-2 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/solution shadow-sm hover:shadow-md"
              >
                <Youtube className="h-4 w-4 group-hover/solution:scale-110 transition-transform" />
                <span>{comments ? "Solution" : ""}</span>
              </button>

              {/* Comments Button */}
              <Dialog>
                <DialogTrigger asChild>
                  <button className="bg-gradient-to-r from-emerald-50 to-blue-50 hover:from-emerald-100 hover:to-blue-100 border border-emerald-200 hover:border-emerald-300 text-emerald-700 hover:text-emerald-800 font-medium py-3 px-4 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/comment shadow-sm hover:shadow-md">
                    <MessageSquare className="h-4 w-4 group-hover/comment:scale-110 transition-transform" />
                    <span>View Tips</span>
                  </button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl bg-white rounded-2xl border-0 shadow-xl">
                  <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className="text-xl font-medium text-gray-900 flex items-center">
                      <div className="bg-emerald-600 p-2 rounded-lg mr-3">
                        <MessageSquare className="h-5 w-5 text-white" />
                      </div>
                      Additional Tips & Comments
                    </DialogTitle>
                  </DialogHeader>
                  <div className="pt-6">
                    <div className="bg-gradient-to-r from-emerald-50 to-blue-50 p-6 rounded-xl border border-emerald-100">
                      <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                        Lab: {labName}
                      </h4>
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                        {comments}
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <button
              onClick={handleOpenInNewTab}
              className="w-full bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 border border-red-200 hover:border-red-300 text-red-700 hover:text-red-800 font-medium p-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 group/solution shadow-sm hover:shadow-md"
            >
              <Youtube className="h-4 w-4 group-hover/solution:scale-110 transition-transform" />
              <span>Watch Solution</span>
            </button>
          )}
        </div>

        {/* Card Footer - Lab Info */}

        <div className="mt-5 pt-4 border-t border-gray-100">
          {postedBy ? (
            <>
              <div className="flex items-center justify-center text-xs text-gray-500">
                <div className="flex items-center">
                  <span>Contributed by {postedBy}</span>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center">
                  <Youtube className="h-3.5 w-3.5 mr-1.5 text-red-500" />
                  <span>Video Solution Available</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-3.5 w-3.5 mr-1.5" />
                  <span>Click to watch</span>
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
