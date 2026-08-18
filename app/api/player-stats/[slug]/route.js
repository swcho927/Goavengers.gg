import { NextResponse } from "next/server";
import { getPlayerBySlug } from "@/lib/players";
import {
  getAccountByRiotId,
  getLeagueEntriesByPuuid,
  getSoloQueueEntry,
  getMatchIdsByPuuid,
  getMatchById,
  getParticipant,
} from "@/lib/riotApi";
import { summarizeMatches } from "@/lib/stats";

export async function GET(request, { params }) {
  const player = getPlayerBySlug(params.slug);
  if (!player) {
    return NextResponse.json({ error: "선수를 찾을 수 없습니다." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const count = Number(searchParams.get("count") ?? 20);

  try {
    const account = await getAccountByRiotId(player.gameName, player.tagLine);
    const entries = await getLeagueEntriesByPuuid(account.puuid);
    const solo = getSoloQueueEntry(entries);

    const matchIds = await getMatchIdsByPuuid(account.puuid, count);

    // 매치 상세는 순차적으로 가져옵니다 (레이트리밋 보호, 5명짜리 사이트라 속도보단 안정성 우선)
    const participants = [];
    const recentMatches = [];
    for (const matchId of matchIds) {
      const detail = await getMatchById(matchId);
      const p = getParticipant(detail, account.puuid);
      if (!p) continue;
      participants.push(p);
      recentMatches.push({
        matchId,
        champion: p.championName,
        win: p.win,
        kills: p.kills,
        deaths: p.deaths,
        assists: p.assists,
        cs: p.totalMinionsKilled + p.neutralMinionsKilled,
        durationSec: detail.info.gameDuration,
        gameEndTimestamp: detail.info.gameEndTimestamp,
      });
    }

    const summary = summarizeMatches(participants);

    return NextResponse.json({
      player,
      puuid: account.puuid,
      tier: solo?.tier ?? "UNRANKED",
      rank: solo?.rank ?? "",
      lp: solo?.leaguePoints ?? 0,
      summary,
      recentMatches,
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
