import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const DATA_PATH = path.join(process.cwd(), "data", "leaderboard.json");

async function readData() {
  try {
    const raw = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(raw || "{}");
  } catch (err) {
    return { rawRows: [], leaderboard: [] };
  }
}

async function writeData(obj: any) {
  await fs.mkdir(path.join(process.cwd(), "data"), { recursive: true });
  await fs.writeFile(DATA_PATH, JSON.stringify(obj, null, 2), "utf-8");
}

export async function GET() {
  const data = await readData();
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rows = Array.isArray(body.rows) ? body.rows : [];

    // Build leaderboard entries from rows
    const leaderboard = rows
      .map((row: any) => {
        const getField = (keys: string[]) => {
          for (const k of keys) {
            if (row[k] != null && row[k] !== "") return row[k];
          }
          // try fuzzy matching
          for (const key of Object.keys(row || {})) {
            const lk = key.toLowerCase();
            if (keys.some((pat) => lk.includes(pat))) return row[key];
          }
          return null;
        };

        const skillBadges =
          parseInt(
            String(
              getField(["# of skill badges completed", "skill", "badges"])
            ) || "0",
            10
          ) || 0;
        const arcadeGames =
          parseInt(
            String(getField(["# of arcade games completed", "arcade"])) || "0",
            10
          ) || 0;
        const triviaGames =
          parseInt(
            String(getField(["# of trivia games completed", "trivia"])) || "0",
            10
          ) || 0;
        const labFreeCourses =
          parseInt(
            String(
              getField(["# of lab-free courses completed", "lab", "course"])
            ) || "0",
            10
          ) || 0;

        const userName = getField(["user name", "name"]) || "Unknown";
        const userEmail = getField(["user email", "email"]) || "";

        const totalBadges = skillBadges + arcadeGames + triviaGames;

        return {
          userName,
          userEmail,
          skillBadges,
          arcadeGames,
          triviaGames,
          labFreeCourses,
          totalBadges,
        };
      })
      .sort((a: any, b: any) => b.totalBadges - a.totalBadges)
      .map((item: any, idx: number) => ({ ...item, rank: idx + 1 }));

    const out = { rawRows: rows, leaderboard };
    await writeData(out);

    return NextResponse.json({ ok: true, leaderboard });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    );
  }
}
