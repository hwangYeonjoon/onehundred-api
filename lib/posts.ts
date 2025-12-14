import { promises as fs } from "fs";
import path from "path";
import { randomUUID } from "crypto";

export type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

// 기본 저장 위치는 로컬 개발: repo/data/posts.json, Vercel 등 읽기 전용 환경: /tmp/posts.json
const dataFile =
  process.env.DATA_FILE ??
  (process.env.VERCEL ? "/tmp/posts.json" : path.join(process.cwd(), "data/posts.json"));

async function ensureFileExists() {
  try {
    await fs.access(dataFile);
  } catch {
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, "[]", "utf-8");
  }
}

export async function readPosts(): Promise<Post[]> {
  await ensureFileExists();
  const raw = await fs.readFile(dataFile, "utf-8");
  try {
    return JSON.parse(raw) as Post[];
  } catch (error) {
    // Reset corrupt file to avoid hard failures.
    await fs.writeFile(dataFile, "[]", "utf-8");
    throw new Error(`데이터 파일 파싱에 실패했습니다: ${(error as Error).message}`);
  }
}

export async function appendPost(input: { title: string; body: string }): Promise<Post[]> {
  const posts = await readPosts();
  const next: Post = {
    id: randomUUID(),
    title: input.title,
    body: input.body,
    createdAt: new Date().toISOString(),
  };
  const updated = [next, ...posts];
  await fs.writeFile(dataFile, JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}
