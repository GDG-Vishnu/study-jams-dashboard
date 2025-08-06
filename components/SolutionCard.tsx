'use client';

import { ExternalLink, Youtube } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SolutionCardProps {
  labName: string;
  videoUrl: string;
  createdAt: string;
}

export function SolutionCard({ labName, videoUrl, createdAt }: SolutionCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleVideoClick = () => {
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500 hover:border-l-green-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
          {labName}
        </CardTitle>
        <p className="text-sm text-gray-500">Added on {formatDate(createdAt)}</p>
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