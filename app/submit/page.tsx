"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Youtube,
  CheckCircle,
  AlertCircle,
  Upload,
  Lightbulb,
} from "lucide-react";
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
      // console.log(data);
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
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                <h1 className="text-4xl font-bold tracking-tight">
                  Share Your Solution
                </h1>
              </div>
            </div>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
              Help your fellow learners by sharing your Google Cloud lab
              solution
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors duration-200 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Solutions
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50 border-b border-gray-100 p-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Upload className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-normal text-gray-900">
                      Submit Lab Solution
                    </CardTitle>
                    <p className="text-gray-600 mt-1 font-light">
                      Share your knowledge with the community
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-8">
                {success && (
                  <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-xl">
                    <div className="flex items-start">
                      <CheckCircle className="h-6 w-6 text-green-600 mr-4 mt-0.5" />
                      <div>
                        <p className="text-green-800 font-medium text-lg">
                          Solution submitted successfully!
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          Thank you for contributing. Redirecting to homepage...
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="mb-8 p-6 bg-red-50 border border-red-200 rounded-xl">
                    <div className="flex items-start">
                      <AlertCircle className="h-6 w-6 text-red-600 mr-4 mt-0.5" />
                      <div>
                        <p className="text-red-800 font-medium">
                          Submission Error
                        </p>
                        <p className="text-red-700 text-sm mt-1">{error}</p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-3">
                    <Label
                      htmlFor="labName"
                      className="text-base font-medium text-gray-700"
                    >
                      Lab Name
                    </Label>
                    <Input
                      id="labName"
                      type="text"
                      value={labName}
                      onChange={(e) => setLabName(e.target.value)}
                      placeholder="e.g., Creating Cloud Functions, Kubernetes Engine Setup"
                      className="h-12 text-base border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Enter the exact name of the lab your solution covers
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="difficulty"
                      className="text-base font-medium text-gray-700"
                    >
                      Difficulty Level
                    </Label>
                    <Select
                      required
                      value={difficulty}
                      onValueChange={setDifficulty}
                    >
                      <SelectTrigger className="h-12 text-base border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue placeholder="Select difficulty level" />
                      </SelectTrigger>
                      <SelectContent>
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
                    <p className="text-sm text-gray-500">
                      Rate the overall complexity of this lab
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="videoUrl"
                      className="text-base font-medium text-gray-700"
                    >
                      YouTube Video URL
                    </Label>
                    <div className="relative">
                      <Youtube className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="videoUrl"
                        type="url"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="https://youtube.com/watch?v=..."
                        className="h-12 pl-12 text-base border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500"
                        required
                      />
                    </div>
                    {videoUrl && !isValidYouTubeUrl(videoUrl) && (
                      <p className="text-sm text-red-600 flex items-center">
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Please enter a valid YouTube URL
                      </p>
                    )}
                    <p className="text-sm text-gray-500">
                      Paste the full YouTube URL of your solution video
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="comments"
                      className="text-base font-medium text-gray-700"
                    >
                      Additional Comments
                      <span className="text-gray-400 font-normal ml-2">
                        (Optional)
                      </span>
                    </Label>
                    <Textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Share any tips, gotchas, or helpful insights for completing this lab..."
                      className="min-h-[120px] text-base border-gray-300 rounded-xl focus:border-blue-500 focus:ring-blue-500 resize-none"
                    />
                    <p className="text-sm text-gray-500">
                      Help others by sharing what you learned or challenges you
                      faced
                    </p>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !labName.trim() ||
                      !isValidYouTubeUrl(videoUrl) ||
                      !difficulty
                    }
                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium text-base rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Solution...
                      </>
                    ) : (
                      <>
                        <Upload className="h-5 w-5 mr-3" />
                        Submit Solution
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Guidelines Card */}
            <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <Lightbulb className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Submission Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Ensure your video clearly demonstrates the complete lab
                    solution
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Include the lab name in your video title or description
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Make sure your video is publicly accessible on YouTube
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Double-check your YouTube URL before submitting
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Community Impact Card */}
            <Card className="shadow-sm border-0 bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-medium text-gray-900 mb-3">
                  Make an Impact
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Your solution will help fellow learners understand complex GCP
                  concepts and accelerate their cloud journey. Every
                  contribution matters!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
