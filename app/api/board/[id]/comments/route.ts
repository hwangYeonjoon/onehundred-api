import { NextResponse, type NextRequest } from "next/server";
import { appendComment } from "../../../../../lib/posts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const payload = await request.json();
    const content =
      (payload.content as string | undefined)?.trim() ||
      (payload.body as string | undefined)?.trim();

    if (!content) {
      return new NextResponse("댓글 내용을 입력하세요.", {
        status: 400,
        headers: corsHeaders,
      });
    }

    const comment = await appendComment(id, content);

    return NextResponse.json(
      { ...comment, date: comment.createdAt },
      { status: 201, headers: corsHeaders },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "서버 오류가 발생했습니다.";
    const status = message.includes("찾을 수 없습니다") ? 404 : 500;
    return new NextResponse(message, { status, headers: corsHeaders });
  }
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}
