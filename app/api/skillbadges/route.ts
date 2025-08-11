import clientPromise from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";

interface SkillBadge {
  _id?: string;
  id: string;
  skillbadgeName: string;
  createdAt: string;
  difficulty: "Easy" | "Medium" | "Hard";
  skillbadgeUrl: string;
  comments?: string;
  postedBy?: string;
}

const skillBadgeUrlRegex = /^https:\/\/www\.cloudskillsboost\.google\/course_templates\/\d+\??.*$/;

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("gcp_cohort2");
    const collection = db.collection<SkillBadge>("skillbadges");
    const url = new URL(request.url);
    const search = url.searchParams.get("search");
    let query = {};

    if (search) {
      const searchTerm = search.toLowerCase();
      query = {
        skillbadgeName: { $regex: searchTerm, $options: "i" },
      };
    }

    // Fetch skill badges from the database
    const skillbadges = await collection
      .find(query)
      .sort({ createdAt: -1 }) // Sort by newest first
      .toArray();

    // Convert MongoDB _id to string and format the skill badges
    const formattedSkillbadges = skillbadges.map((skillbadge) => ({
      id: skillbadge._id.toString(),
      skillbadgeName: skillbadge.skillbadgeName,
      skillbadgeUrl: skillbadge.skillbadgeUrl,
      createdAt: skillbadge.createdAt,
      difficulty: skillbadge.difficulty,
      comments: skillbadge.comments || "",
      postedBy: skillbadge.postedBy || "",
    }));

    return NextResponse.json(formattedSkillbadges);
  } catch (error) {
    console.error("Error in GET /api/skillbadges:", error);
    return NextResponse.json(
      { error: "Failed to fetch skill badges" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { skillbadgeName, difficulty, skillbadgeUrl, comments, postedBy } = body;

    if (!skillbadgeName || !difficulty || !skillbadgeUrl) {
      return NextResponse.json(
        { error: "Skill Badge name, difficulty, and URL are required" },
        { status: 400 }
      );
    }

    if (!skillBadgeUrlRegex.test(skillbadgeUrl)) {
      return NextResponse.json(
        { error: "Invalid skill badge URL format" },
        { status: 400 }
      );
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(difficulty)) {
      return NextResponse.json(
        { error: "Invalid difficulty level" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("gcp_cohort2");
    const collection = db.collection("skillbadges");

    const newBadge = {
      skillbadgeName: skillbadgeName.trim(),
      difficulty,
      skillbadgeUrl: skillbadgeUrl.trim(),
      comments: comments ? comments.trim() : "",
      postedBy: postedBy ? postedBy.trim() : "",
      createdAt: new Date().toISOString()
    };

    const result = await collection.insertOne(newBadge);
    const createdBadge = {
      id: result.insertedId.toString(),
      ...newBadge
    };

    return NextResponse.json(createdBadge, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/skillbadges: ", error);
    return NextResponse.json(
      { error: "Failed to create Skill Badge" },
      { status: 500 }
    );
  }
}
