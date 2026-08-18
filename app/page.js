import { PLAYERS } from "@/lib/players";
import {
  getAccountByRiotId,
  getLeagueEntriesByPuuid,
  getSoloQueueEntry,
} from "@/lib/riotApi";

export const revalidate = 60;

async function loadTeam() {
  return Promise.all(
    PLAYERS.map(async (player) => {
      try {
        const account = await getAccountByRiotId(player.gameName, player.tagLine);
        const entries = await getLeagueEntriesByPuuid(account.puuid);
        const solo = getSoloQueueEntry(entries);
        return {
          ...player,
          tier: solo?.tier ?? "UNRANKED",
          rank: solo?.rank ?? "",
          lp: solo?.leaguePoints ?? 0,
          wins: solo?.wins ?? 0,
          losses: solo?.losses ?? 0,
        };
      } catch (err) {
        return { ...player, error: true };
      }
    })
  );
}

export default async function HomePage() {
  const team = await loadTeam();

  return (
    <div>
      <h1>GOAVENGERS</h1>
      <p style={{ color: "#8b90a0" }}>팀 전적 현황</p>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>선수</th>
              <th>포지션</th>
              <th>티어</th>
              <th>LP</th>
              <th>전적</th>
            </tr>
          </thead>
          <tbody>
            {team.map((p) => (
              <tr key={p.slug}>
                <td>
                  <a className="player-link" href={`/players/${p.slug}`}>
                    {p.displayName}
                  </a>
                </td>
                <td>{p.position}</td>
                <td>
                  {p.error ? "불러오기 실패" : `${p.tier} ${p.rank}`}
                </td>
                <td>{p.error ? "-" : p.lp}</td>
                <td>{p.error ? "-" : `${p.wins}승 ${p.losses}패`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
