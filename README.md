# GOAVENGERS.GG

Goavengers 팀 전용 LoL 전적/분석 플랫폼 (MVP).

## 로컬 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local 파일 열어서 RIOT_API_KEY 값 채워넣기
npm run dev
```

http://localhost:3000 접속.

## 선수 등록

`lib/players.js` 파일에서 5명의 실제 `gameName`(닉네임), `tagLine`(태그, # 뒤 부분), `position`을 입력하세요.

## 배포 (Vercel 추천)

1. 이 프로젝트를 GitHub 저장소에 push (`.env.local`은 `.gitignore`에 있어서 자동으로 제외됩니다)
2. Vercel에서 저장소 import
3. Vercel 프로젝트 Settings → Environment Variables에 `RIOT_API_KEY` 추가
   (Riot API 개발자 키는 24시간마다 만료되니 만료될 때마다 여기서 값만 갱신하면 됩니다)
4. Deploy

## 참고

- Riot API 원본 키(RGAPI-...)는 절대 GitHub에 커밋하지 마세요. `.env.local`에만 두면 됩니다.
- 개발자 키(Development API Key)는 분당/초당 호출 제한이 낮고 24시간마다 새로 발급해야 합니다.
  팀원 5명이 계속 쓸 거면 나중에 Riot Developer Portal에서 Personal API Key를 신청하는 걸 고려하세요.

## 현재 구현된 기능 (MVP)

- 홈: 팀 5명 실시간 티어/LP 현황
- 선수별 페이지: 최근 20게임 요약(승률/KDA), 챔피언별 통계, 최근 경기 목록

## 다음 단계 (아직 구현 안 됨)

- 같이 게임한 소환사(듀오) 분석
- AI 코치 상담
- 자체 랭킹 점수 / 시즌 시스템
- 팀 전체 분석, 경기 리포트
