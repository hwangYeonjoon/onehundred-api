"use client";

import { useEffect, useState } from "react";

type Post = {
  id: string;
  title: string;
  body: string;
  createdAt: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/posts");
        if (!res.ok) {
          throw new Error(await res.text());
        }
        const data = (await res.json()) as Post[];
        setPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) {
        throw new Error(await res.text());
      }
      const next = (await res.json()) as Post[];
      setPosts(next);
      setTitle("");
      setBody("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1 className="title">100 서 게시판 API 샘플</h1>
        <p className="muted">
          Next.js 라우트 핸들러 기반으로 JSON 파일을 읽고 쓰는 예시입니다. 게시글은
          `data/posts.json` 파일에 저장됩니다.
        </p>
        <div style={{ marginTop: 16 }}>
          <label style={{ display: "block", marginBottom: 8 }}>
            <span style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
              제목
            </span>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #1f233b",
                background: "#0d0f1a",
                color: "#f5f7fb",
              }}
            />
          </label>
          <label style={{ display: "block", marginBottom: 8 }}>
            <span style={{ display: "block", fontSize: 14, marginBottom: 4 }}>
              내용
            </span>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={4}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 10,
                border: "1px solid #1f233b",
                background: "#0d0f1a",
                color: "#f5f7fb",
                resize: "vertical",
              }}
            />
          </label>
          <button
            onClick={submit}
            disabled={loading}
            style={{
              marginTop: 8,
              padding: "10px 14px",
              borderRadius: 10,
              border: "none",
              background:
                "linear-gradient(135deg, #37b1ff 0%, #7c5dff 50%, #ff5f9f 100%)",
              color: "#0d0f1a",
              fontWeight: 700,
              cursor: "pointer",
              width: "100%",
            }}
          >
            {loading ? "처리 중..." : "등록"}
          </button>
        </div>

        {error && (
          <p style={{ color: "#ff8ca3", marginTop: 12 }}>오류: {error}</p>
        )}

        <div style={{ marginTop: 24 }}>
          <h2 style={{ margin: "0 0 12px", fontSize: 18 }}>최근 등록</h2>
          {posts.length === 0 && (
            <p className="muted" style={{ margin: 0 }}>
              아직 게시글이 없습니다.
            </p>
          )}
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {posts.map((post) => (
              <li
                key={post.id}
                style={{
                  padding: "12px 0",
                  borderBottom: "1px solid #1f233b",
                }}
              >
                <div style={{ fontWeight: 700 }}>{post.title}</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {new Date(post.createdAt).toLocaleString("ko-KR")}
                </div>
                <p style={{ margin: "6px 0 0", lineHeight: 1.5 }}>
                  {post.body}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
