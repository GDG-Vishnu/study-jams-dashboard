"use client";
import { ExternalLink, Youtube, MessageSquare, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface SolutionCardProps {
  labName: string;
  videoUrl: string;
  createdAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  comments?: string;
}

export function SolutionCard({
  labName,
  videoUrl,
  createdAt,
  difficulty,
  comments,
}: SolutionCardProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  const { date, time } = formatDateTime(createdAt);

  // console.log(labName, videoUrl, createdAt, difficulty, comments);

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
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>
            Added on {date} at {time}
          </span>
        </div>
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
        {comments && (
          <Dialog>
            <DialogTrigger asChild>
              <button className="mt-3 w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200">
                <MessageSquare className="h-4 w-4" />
                View Comments
              </button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Additional Comments</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <p className="text-gray-700">{comments}</p>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </CardContent>
    </Card>
  );
}
