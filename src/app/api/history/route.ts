import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const history = await prisma.history.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      watchedAt: "desc",
    },
  });

  return NextResponse.json(history);
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { mediaId, mediaType, title, backdrop_path, season, episode } =
    await req.json();

  if (!mediaId || !mediaType || !title) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const history = await prisma.history.create({
    data: {
      userId,
      mediaId,
      mediaType,
      title,
      backdrop_path,
      season,
      episode,
    },
  });

  return NextResponse.json(history);
}

export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { mediaId, mediaType, season, episode } = await req.json();

  if (!mediaId || !mediaType) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  await prisma.history.deleteMany({
    where: {
      userId,
      mediaId,
      mediaType,
      season,
      episode,
    },
  });

  return new NextResponse(null, { status: 204 });
}
