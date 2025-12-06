"use client";
import React, { useState } from "react";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Star, Award, CheckCircle } from "lucide-react";

export default function AchievedTier1Page() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

const handleEmailSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!email || !email.includes("@")) {
    setMessage("Please enter a valid email address");
    return;
  }

  setIsSubmitting(true);
  setMessage("");

  try {
    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbzCY5rnwcp6QLt5rutfUtMY_UyEby9uBmchm4SxmhTYRsFJoItFlMOW6_H2InwQHv7t/exec", // Replace with NEW URL from step 1
      {
        method: "POST",
        headers: {
          "Content-Type": "text/plain", // Changed to avoid CORS preflight
        },
        body: JSON.stringify({
          email: email,
        }),
      }
    );

    const result = await response.json();

    if (result.success) {
      setMessage(
        "Successfully subscribed! Check your inbox for a confirmation email."
      );
      setEmail("");
    } else {
      setMessage(result.message || "Something went wrong. Please try again.");
    }
  } catch (error) {
    setMessage("Something went wrong. Please try again later.");
    console.error("Subscription error:", error);
  } finally {
    setIsSubmitting(false);
  }
};
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Header />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 to-green-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="mb-6 flex justify-center lg:justify-start">
                <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-full">
                  <Trophy className="h-16 w-16 text-white" />
                </div>
              </div>
              <div className="mb-4 flex flex-col gap-3">
                <Badge
                  variant="outline"
                  className="bg-green-100 border-green-300 text-green-700 text-lg px-4 py-1 w-fit mx-auto lg:mx-0"
                >
                  TIER-1 Achieved
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-orange-100 border-orange-300 text-orange-700 text-lg px-4 py-1 w-fit mx-auto lg:mx-0"
                >
                  🇮🇳 Top 2 in India
                </Badge>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
                We Did It Together!
              </h1>
              <h2 className="text-xl md:text-2xl font-light text-gray-600 mb-8">
                We have achieved TIER-1 in Study Jams and ranked Top 2 in India
              </h2>
              <p className="text-lg text-gray-500 max-w-2xl">
                Our collective dedication and collaborative effort have paid
                off. Together, we've successfully completed the foundational
                level, built a strong learning community, and achieved
                remarkable national recognition!
              </p>
            </div>

            {/* Achievement Image */}
            <div className="flex-1 max-w-md lg:max-w-lg">
              <div className="relative">
                <img
                  src="/1764989828217.jpg"
                  alt="Top 2 Achievement in India - Study Jams"
                  className="w-full h-auto rounded-lg shadow-2xl border-4 border-white"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Top 2 🏆
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Achievement Summary */}
          <Card className="shadow-lg">
            <CardHeader className="text-center bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-t-lg">
              <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                <Award className="h-8 w-8" />
                Our TIER-1 Achievement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">
                    Completed foundational courses
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">Mastered basic concepts</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">Successfully completed labs</span>
                </div>
                <div className="flex items-center gap-4">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  <span className="text-lg">Earned skill badges</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Community Impact */}
          <Card className="shadow-lg">
            <CardHeader className="bg-gray-50 rounded-t-lg">
              <CardTitle className="flex items-center gap-2 text-2xl text-gray-800">
                <Star className="h-8 w-8 text-yellow-500" />
                Our Impact
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="border-l-4 border-blue-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Knowledge Sharing
                  </h3>
                  <p className="text-gray-600">
                    We've built a strong foundation of shared knowledge and
                    collaborative learning.
                  </p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Community Building
                  </h3>
                  <p className="text-gray-600">
                    Created lasting connections and a supportive learning
                    environment.
                  </p>
                </div>
                <div className="border-l-4 border-purple-500 pl-4">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">
                    Skills Development
                  </h3>
                  <p className="text-gray-600">
                    Mastered fundamental concepts and practical skills in our
                    study journey.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-12">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Our Collective Achievement Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center bg-blue-50 border-blue-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-blue-600 mb-2">142</div>
                <div className="text-gray-600">Members Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-green-50 border-green-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  2,840
                </div>
                <div className="text-gray-600">Labs Completed</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-yellow-50 border-yellow-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  20
                </div>
                <div className="text-gray-600">Labs Per Member</div>
              </CardContent>
            </Card>
            <Card className="text-center bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  #2
                </div>
                <div className="text-gray-600">Ranking in India</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Swag Showcase */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Your TIER-1 Swags Await!
          </h2>
          <Card className="max-w-4xl mx-auto shadow-xl">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex-1">
                  <img
                    src="https://res.cloudinary.com/startup-grind/image/upload/c_fill,dpr_2.0,f_auto,g_center,h_1080,q_100,w_1080/v1/gcs/platform-data-goog/events/blob_Kd3Gqd5"
                    alt="Study Jams TIER-1 Swags"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <h3 className="text-2xl font-bold text-gray-800">
                    Exclusive TIER-1 Swags
                  </h3>
                  <p className="text-lg text-gray-600">
                    As a token of appreciation for achieving TIER-1, we're
                    excited to share these exclusive swags with our amazing
                    community!
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Exclusive Study Jams merchandise
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Limited edition collectibles
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700">
                        Recognition of your achievement
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="bg-gradient-to-r from-blue-500 to-green-500 text-white">
            <CardContent className="p-12">
              <h2 className="text-3xl font-bold mb-4">Stay Connected!</h2>
              <p className="text-xl mb-8 opacity-90">
                Continue to be part of our amazing learning community.
              </p>
              <div className="max-w-md mx-auto">
                <p className="text-lg mb-4 opacity-90">
                  Get the latest event updates delivered to your inbox
                </p>
                <form
                  onSubmit={handleEmailSubmit}
                  className="flex flex-col sm:flex-row gap-3"
                >
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-lg text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 disabled:opacity-50"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-white bg-opacity-20 hover:bg-opacity-30 border-2 border-white text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap disabled:opacity-50"
                  >
                    {isSubmitting ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
                {message && (
                  <p
                    className={`text-sm mt-3 ${
                      message.includes("Successfully")
                        ? "text-green-200"
                        : "text-red-200"
                    }`}
                  >
                    {message}
                  </p>
                )}
                <p className="text-sm mt-3 opacity-75">
                  Stay updated with community events and learning opportunities
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
