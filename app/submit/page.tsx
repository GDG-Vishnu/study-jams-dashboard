"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Youtube, CheckCircle, AlertCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitSolution() {
  const [labName, setLabName] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [comments, setComments] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/solutions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          labName: labName.trim(),
          videoUrl: videoUrl.trim(),
          difficulty,
          comments: comments.trim(),
        }),
      });

      const data = await response.json();
      console.log(data);
      if (response.ok) {
        setSuccess(true);
        setLabName("");
        setVideoUrl("");
        setDifficulty("");
        setComments("");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        setError(data.error || "Failed to submit solution");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isValidYouTubeUrl = (url: string) => {
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    return youtubeRegex.test(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Solutions
          </Link>
        </div>
        <Card className="shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <Youtube className="h-12 w-12 mx-auto mb-4" />
            <CardTitle className="text-2xl font-bold">
              Submit Lab Solution
            </CardTitle>
            <p className="text-blue-100 mt-2">
              Share your YouTube video solution to help fellow students
            </p>
          </CardHeader>
          <CardContent className="p-8">
            {success && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="text-green-800 font-medium">
                    Solution submitted successfully!
                  </p>
                  <p className="text-green-600 text-sm">
                    Redirecting to homepage...
                  </p>
                </div>
              </div>
            )}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                <p className="text-red-800">{error}</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label
                  htmlFor="labName"
                  className="text-base font-medium text-gray-700"
                >
                  Lab Name *
                </Label>
                <Input
                  id="labName"
                  type="text"
                  value={labName}
                  onChange={(e) => setLabName(e.target.value)}
                  placeholder="e.g., Creating Cloud Functions, Kubernetes Engine Setup"
                  className="mt-2 text-base"
                  required
                />
                <p className="mt-1 text-sm text-gray-600">
                  Enter the name of the lab this solution covers
                </p>
              </div>
              <div>
                <Label
                  htmlFor="difficulty"
                  className="text-base font-medium text-gray-700"
                >
                  Difficulty Level *
                </Label>
                <Select
                  required
                  value={difficulty}
                  onValueChange={setDifficulty}
                >
                  <SelectTrigger className="mt-2 text-base">
                    <SelectValue placeholder="Select a difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-1 text-sm text-gray-600">
                  How difficult was this lab to complete?
                </p>
              </div>
              <div>
                <Label
                  htmlFor="videoUrl"
                  className="text-base font-medium text-gray-700"
                >
                  YouTube Video URL *
                </Label>
                <Input
                  id="videoUrl"
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="mt-2 text-base"
                  required
                />
                <p className="mt-1 text-sm text-gray-600">
                  Paste the full YouTube URL of your solution video
                </p>
                {videoUrl && !isValidYouTubeUrl(videoUrl) && (
                  <p className="mt-1 text-sm text-red-600">
                    Please enter a valid YouTube URL
                  </p>
                )}
              </div>
              <div>
                <Label
                  htmlFor="comments"
                  className="text-base font-medium text-gray-700"
                >
                  Additional Comments
                </Label>
                <Textarea
                  id="comments"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Enter any additional comments or tips for completing the lab..."
                  className="mt-2 text-base"
                />
                <p className="mt-1 text-sm text-gray-600">
                  Provide any additional tips or things to be careful about
                  while completing this lab
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">
                  Submission Guidelines
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Make sure your video clearly shows the lab solution</li>
                  <li>
                    • Include the lab name in your video title or description
                  </li>
                  <li>• Ensure the video is publicly accessible</li>
                  <li>• Double-check the YouTube URL before submitting</li>
                </ul>
              </div>
              <Button
                type="submit"
                disabled={
                  loading ||
                  !labName.trim() ||
                  !isValidYouTubeUrl(videoUrl) ||
                  !difficulty
                }
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 text-base transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Youtube className="h-4 w-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
