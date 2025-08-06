export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

interface Solution {
  _id?: string;
  id: string;
  labName: string;
  videoUrl: string;
  createdAt: string;
}

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("gcp_cohort2");
    const collection = db.collection("solutions");

    const url = new URL(request.url);
    const search = url.searchParams.get("search");

    let query = {};
    if (search) {
      const searchTerm = search.toLowerCase();
      query = {
        labName: { $regex: searchTerm, $options: "i" },
      };
    }

    const solutions = await collection
      .find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    // Convert MongoDB _id to string and add id field for compatibility
    const formattedSolutions = solutions.map((solution) => ({
      id: solution._id.toString(),
      labName: solution.labName,
      videoUrl: solution.videoUrl,
      createdAt: solution.createdAt,
    }));

    return NextResponse.json(formattedSolutions);
  } catch (error) {
    console.error("Error in GET /api/solutions:", error);
    return NextResponse.json(
      { error: "Failed to fetch solutions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { labName, videoUrl } = body;

    if (!labName || !videoUrl) {
      return NextResponse.json(
        { error: "Lab name and video URL are required" },
        { status: 400 }
      );
    }

    // Validate YouTube URL
    const youtubeRegex =
      /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|embed\/)|youtu\.be\/)[\w-]+/;
    if (!youtubeRegex.test(videoUrl)) {
      return NextResponse.json(
        { error: "Please provide a valid YouTube URL" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("gcp_cohort2");
    const collection = db.collection("solutions");

    const newSolution = {
      labName: labName.trim(),
      videoUrl: videoUrl.trim(),
      createdAt: new Date().toISOString(),
    };

    const result = await collection.insertOne(newSolution);

    const createdSolution = {
      id: result.insertedId.toString(),
      ...newSolution,
    };

    return NextResponse.json(createdSolution, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/solutions:", error);
    return NextResponse.json(
      { error: "Failed to create solution" },
      { status: 500 }
    );
  }
}
