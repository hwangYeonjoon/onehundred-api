import { NextResponse } from "next/server";
import { appendPost, readPosts, type Post } from "../../../lib/posts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function toApiPost(post: Post) {
  // Keep existing shape while providing legacy aliases used by some clients
  return { ...post, content: post.body, date: post.createdAt };
}

export async function GET() {
  try {
    const posts = await readPosts();
    return NextResponse.json(posts.map(toApiPost), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
      { status: 500, headers: corsHeaders },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const title = (payload.title as string | undefined)?.trim();
    const body = (payload.body as string | undefined)?.trim();
    const content = (payload.content as string | undefined)?.trim();

    const normalizedBody = body || content;
    const normalizedTitle =
      title || (normalizedBody ? normalizedBody.slice(0, 30) : "");

    if (!normalizedBody) {
      return new NextResponse("내용을 입력하세요.", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const posts = await appendPost({
      title: normalizedTitle || "제목 없음",
      body: normalizedBody,
    });
    return NextResponse.json(posts.map(toApiPost), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse(
      error instanceof Error ? error.message : "서버 오류가 발생했습니다.",
      { status: 500, headers: corsHeaders },
    );
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
