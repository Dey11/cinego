import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { remove } from "lodash";

export async function GET() {
  try{
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const watchlist = await prisma.watchlist.findMany({
    where: {
      userId,
    },
    orderBy: {
      addedAt: "desc",
    },
  });

  return NextResponse.json(watchlist);}
  catch(err){
    console.log(err);
    return NextResponse.json({message: err});
    // return null;
  }
}

export async function POST(req: Request) {
  try{
  const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { mediaId, mediaType, title, backdrop_path } = await req.json();

  if (!mediaId || !mediaType || !title) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const watchlist = await prisma.watchlist.create({
    data: {
      userId,
      mediaId,
      mediaType,
      title,
      backdrop_path,
    },
  });

  return NextResponse.json(watchlist);
}catch(err){
    console.log(err);
    return NextResponse.json({message: err});
    // return null;
  }
}

export async function DELETE(req: Request) {
  try{const { userId } = await auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { mediaId, mediaType, removeAll } = await req.json();

  if(removeAll){ 
    await prisma.watchlist.deleteMany({
      where: {
        userId,
      },
    });
    return new NextResponse(null, { status: 204 });
  }

  if (!mediaId || !mediaType) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  await prisma.watchlist.deleteMany({
    where: {
      userId,
      mediaId,
      mediaType,
    },
  });

  return new NextResponse(null, { status: 204 });}
  catch(err){
    console.log(err);
    return NextResponse.json({message: err});
    // return null;
  }
}
