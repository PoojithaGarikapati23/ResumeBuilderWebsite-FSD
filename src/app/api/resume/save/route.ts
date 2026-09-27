import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data } = await req.json();
    if (!data) {
      return NextResponse.json({ error: "Missing data" }, { status: 400 });
    }

    // Create or update resume for the user
    // Since we don't have a specific resumeId in the frontend yet (just uuid from store),
    // we'll just create a new resume or find the first one for this user for simplicity,
    // or better: look if a resume with this user exists, update it.
    
    let resume = await prisma.resume.findFirst({
      where: { userId: session.user.id },
    });

    if (!resume) {
      resume = await prisma.resume.create({
        data: {
          userId: session.user.id,
          name: "My Resume",
        },
      });
    }

    const version = await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        content: JSON.stringify(data),
      },
    });

    return NextResponse.json({ success: true, version });
  } catch (error: any) {
    console.error("Save Resume Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save resume" },
      { status: 500 }
    );
  }
}
