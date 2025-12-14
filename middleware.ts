import { NextResponse, type NextRequest } from "next/server";

const CORS_PATH_PREFIX = "/api/board";
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith(CORS_PATH_PREFIX)) {
    return NextResponse.next();
  }

  // Preflight 요청을 전역적으로 처리해 404/500 시에도 CORS 헤더를 보장
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

// board API 전체에만 적용
export const config = {
  matcher: ["/api/board/:path*"],
};
