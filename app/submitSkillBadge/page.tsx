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
  Award,
  CheckCircle,
  AlertCircle,
  Upload,
  Lightbulb,
  Trophy,
  Star,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function SubmitSkillBadge() {
  const [skillbadgeName, setSkillbadgeName] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [skillbadgeUrl, setskillbadgeUrl] = useState("");
  const [comments, setComments] = useState("");
  const [postedBy, setPostedBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await fetch("/api/skillbadges", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          skillbadgeName: skillbadgeName.trim(),
          skillbadgeUrl: skillbadgeUrl.trim(),
          difficulty,
          comments: comments.trim(),
          postedBy: postedBy.trim(),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess(true);
        setSkillbadgeName("");
        setskillbadgeUrl("");
        setDifficulty("");
        setComments("");
        setPostedBy("");
        setTimeout(() => {
          router.push("/skillBadges");
        }, 2000);
      } else {
        setError(data.error || "Failed to submit skill badge");
      }
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
                <h1 className="text-4xl font-bold tracking-tight">
                  Share the Skill Badges
                </h1>
              </div>
            </div>
            <p className="text-lg text-gray-500 font-light max-w-2xl mx-auto">
              Share the skill badges you&apos;ve completed along with their difficulty levels to guide and inspire others on their learning journey.
            </p>
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/skillBadges"
            className="inline-flex items-center text-purple-600 hover:text-purple-700 transition-colors duration-200 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Skill Badges
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-gray-100 p-8">
                <div className="flex items-center space-x-4">
                  <div className="bg-white p-3 rounded-xl shadow-sm">
                    <Award className="h-8 w-8 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-normal text-gray-900">
                      Submit Skill Badge
                    </CardTitle>
                    {/* <p className="text-gray-600 mt-1 font-light">
                      Share your achievement with the community
                    </p> */}
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
                          Skill badge submitted successfully!
                        </p>
                        <p className="text-green-700 text-sm mt-1">
                          Congratulations on your Submission! Redirecting...
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
                      htmlFor="skillbadgeName"
                      className="text-base font-medium text-gray-700"
                    >
                      Skill Badge Name
                    </Label>
                    <Input
                      id="skillbadgeName"
                      type="text"
                      value={skillbadgeName}
                      onChange={(e) => setSkillbadgeName(e.target.value)}
                      placeholder="e.g., Cloud Security Engineer, Data Engineer, Cloud Architect"
                      className="h-12 text-base border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Enter the exact name of the skill badge you completed
                    </p>
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="skillbadgeName"
                      className="text-base font-medium text-gray-700"
                    >
                      Skill Badge URL
                    </Label>
                    <Input
                      id="skillbadgeName"
                      type="text"
                      value={skillbadgeUrl}
                      onChange={(e) => setskillbadgeUrl(e.target.value)}
                      placeholder="e.g.. https://www.cloudskillsboost.google/course_templates/728?utm_source=gcaf-site&utm_medium=website&utm_campaign=arcade-facilitator25"
                      className="h-12 text-base border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                      required
                    />
                    <p className="text-sm text-gray-500">
                      Enter the exact URL of the skill badge you completed
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
                      <SelectTrigger className="h-12 text-base border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500">
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
                      Rate the overall complexity of earning this skill badge
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="comments"
                      className="text-base font-medium text-gray-700"
                    >
                      Tips & Insights
                      <span className="text-gray-400 font-normal ml-2">
                        (Optional)
                      </span>
                    </Label>
                    <Textarea
                      id="comments"
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Share your learning journey, challenges faced, key takeaways, or tips for others pursuing this badge..."
                      className="min-h-[120px] text-base border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500 resize-none"
                    />
                    <p className="text-sm text-gray-500">
                      Help others by sharing your experience and what you learned
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="postedBy"
                      className="text-base font-medium text-gray-700"
                    >
                      Your Name
                      {/* <span className="text-gray-400 font-normal ml-2">
                        (Optional)
                      </span> */}
                    </Label>
                    <Input
                      id="postedBy"
                      value={postedBy}
                      onChange={(e) => setPostedBy(e.target.value)}
                      placeholder="Your name (displayed as the Contributor of this skill badge)..."
                      className="h-12 text-base border-gray-300 rounded-xl focus:border-purple-500 focus:ring-purple-500"
                    />
                    <p className="text-sm text-gray-500">Enter your name that would be displayed as Contributor</p>
                  </div>

                  <Button
                    type="submit"
                    disabled={
                      loading ||
                      !skillbadgeName.trim() ||
                      !difficulty
                    }
                    className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-medium text-base rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Submitting Badge...
                      </>
                    ) : (
                      <>
                        <Award className="h-5 w-5 mr-3" />
                        Submit Skill Badge
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
            <Card className="shadow-sm border-0 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Lightbulb className="h-5 w-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900">Submission Tips</h3>
                </div>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Use the exact skill badge name as shown in your Google Cloud console
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Share specific challenges you faced and how you overcame them
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Include any resources that were particularly helpful
                  </li>
                  <li className="flex items-start">
                    <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    Rate difficulty based on your personal experience
                  </li>
                </ul>
              </CardContent>
            </Card>

            
          </div>
        </div>
      </main>
    </div>
  );
}