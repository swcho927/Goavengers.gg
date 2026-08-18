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

export const revalidate = 60;

async function loadPlayerData(slug, count = 20) {
  const player = getPlayerBySlug(slug);
  if (!player) return null;

  const account = await getAccountByRiotId(player.gameName, player.tagLine);
  const entries = await getLeagueEntriesByPuuid(account.puuid);
  const solo = getSoloQueueEntry(entries);
  const matchIds = await getMatchIdsByPuuid(account.puuid, count);

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
    });
  }

  return {
    player,
    tier: solo?.tier ?? "UNRANKED",
    rank: solo?.rank ?? "",
    lp: solo?.leaguePoints ?? 0,
    summary: summarizeMatches(participants),
    recentMatches,
  };
}

function formatDuration(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default async function PlayerDetailPage({ params }) {
  const data = await loadPlayerData(params.slug);

  if (!data) {
    return <p>선수를 찾을 수 없습니다.</p>;
  }

  const { player, tier, rank, lp, summary, recentMatches } = data;

  return (
    <div>
      <h1>{player.displayName}</h1>
      <p style={{ color: "#8b90a0" }}>
        {player.position} · {tier} {rank} · {lp} LP
      </p>

      <div className="card">
        <h2>최근 {summary.games}게임 요약</h2>
        <p>
          {summary.wins}승 {summary.losses}패 (승률 {summary.winrate}%) · KDA{" "}
          {summary.kda} ({summary.avgKills}/{summary.avgDeaths}/{summary.avgAssists})
        </p>
      </div>

      <div className="card">
        <h2>챔피언별 통계</h2>
        <table>
          <thead>
            <tr>
              <th>챔피언</th>
              <th>게임</th>
              <th>승률</th>
              <th>KDA</th>
            </tr>
          </thead>
          <tbody>
            {summary.champions.map((c) => (
              <tr key={c.champion}>
                <td>{c.champion}</td>
                <td>{c.games} ({c.wins}승 {c.losses}패)</td>
                <td>{c.winrate}%</td>
                <td>{c.kda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>최근 경기</h2>
        <table>
          <thead>
            <tr>
              <th>결과</th>
              <th>챔피언</th>
              <th>KDA</th>
              <th>CS</th>
              <th>시간</th>
            </tr>
          </thead>
          <tbody>
            {recentMatches.map((m) => (
              <tr key={m.matchId}>
                <td className={m.win ? "win" : "loss"}>{m.win ? "승" : "패"}</td>
                <td>{m.champion}</td>
                <td>{m.kills}/{m.deaths}/{m.assists}</td>
                <td>{m.cs}</td>
                <td>{formatDuration(m.durationSec)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
