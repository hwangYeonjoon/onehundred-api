# 100 서 게시판 Next.js API

Next.js 14 라우트 핸들러 기반으로 JSON 파일(`data/posts.json`)에 게시글을 저장하는 간단한 서버 API 예시입니다.

## 실행

```bash
npm install
npm run dev
# http://localhost:3000
```

## API

- `GET /api/posts` : 저장된 게시글 배열 반환
- `POST /api/posts` : `{ title, body }` JSON을 받아 새 글을 추가하고 전체 목록 반환

데이터는 `process.env.DATA_FILE`로 경로를 재정의할 수 있으며, 기본값은 `data/posts.json`입니다.

## Vercel에서의 주의점

- Vercel Serverless/Edge 함수의 파일 시스템은 **배포마다 초기화**되며 실행 중 쓰기 내용이 지속되지 않습니다. JSON/txt 파일만으로 영속 저장하려면 다음 중 하나가 필요합니다:
  - Vercel Blob, KV, Neon 등 외부 스토리지에 파일 또는 레코드 저장
  - 파일을 Git에 커밋하고 읽기 전용으로만 쓰기 없이 사용
  - 또는 배포 후에도 유지되는 S3/GCS 같은 객체 스토리지 사용
- 로컬 개발이나 자체 서버(영구 디스크)에서는 현재 예시 그대로 읽기/쓰기 가능합니다.

프로덕션에서 Vercel을 사용할 계획이라면 스토리지 백엔드 선택 후 `lib/posts.ts`의 `dataFile` 부분을 해당 스토리지 SDK로 대체하면 됩니다.
