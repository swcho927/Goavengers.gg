// Riot API 서버 사이드 전용 래퍼.
// RIOT_API_KEY는 .env.local에서 읽어오며, 클라이언트로는 절대 전달하지 않습니다.
// (API route / server component에서만 import 해서 사용하세요)

const API_KEY = process.env.RIOT_API_KEY;

// 한국 플랫폼 = "kr", 매치/계정 데이터의 리전 라우팅 = "asia"
const PLATFORM = "kr";
const REGIONAL = "asia";

async function riotFetch(url) {
  const res = await fetch(url, {
    headers: { "X-Riot-Token": API_KEY },
    // 너무 자주 같은 데이터를 다시 긁지 않도록 짧게 캐싱
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Riot API 오류 (${res.status}): ${url} - ${text}`);
  }

  return res.json();
}

// gameName#tagLine -> puuid 등 계정 정보
export async function getAccountByRiotId(gameName, tagLine) {
  const url = `https://${REGIONAL}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${encodeURIComponent(
    gameName
  )}/${encodeURIComponent(tagLine)}`;
  return riotFetch(url);
}

// puuid -> 솔로랭크/자유랭크 티어 정보 (league-v4 by-puuid)
export async function getLeagueEntriesByPuuid(puuid) {
  const url = `https://${PLATFORM}.api.riotgames.com/lol/league/v4/entries/by-puuid/${puuid}`;
  return riotFetch(url);
}

// puuid -> 최근 매치 id 목록
export async function getMatchIdsByPuuid(puuid, count = 20) {
  const url = `https://${REGIONAL}.api.riotgames.com/lol/match/v5/matches/by-puuid/${puuid}/ids?start=0&count=${count}`;
  return riotFetch(url);
}

// matchId -> 매치 상세 정보
export async function getMatchById(matchId) {
  const url = `https://${REGIONAL}.api.riotgames.com/lol/match/v5/matches/${matchId}`;
  return riotFetch(url);
}

// 특정 puuid의 참가자 데이터만 매치에서 뽑아오는 헬퍼
export function getParticipant(matchDetail, puuid) {
  return matchDetail.info.participants.find((p) => p.puuid === puuid);
}

// 솔로랭크 항목만 뽑는 헬퍼 (없으면 null)
export function getSoloQueueEntry(leagueEntries) {
  return (
    leagueEntries.find((e) => e.queueType === "RANKED_SOLO_5x5") || null
  );
}
