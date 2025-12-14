import { NextResponse } from "next/server";
import { appendPost, readPosts } from "../../../lib/posts";

export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json(posts, { status: 200 });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const title = (body.title as string | undefined)?.trim();
    const content = (body.body as string | undefined)?.trim();

    if (!title || !content) {
      return new NextResponse("title과 body를 모두 입력하세요.", { status: 400 });
    }

    const posts = await appendPost({ title, body: content });
    return NextResponse.json(posts, { status: 201 });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
      { status: 500 },
    );
  }
}
