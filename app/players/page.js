import { PLAYERS } from "@/lib/players";

export default function PlayersPage() {
  return (
    <div>
      <h1>선수 목록</h1>
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>이름</th>
              <th>포지션</th>
            </tr>
          </thead>
          <tbody>
            {PLAYERS.map((p) => (
              <tr key={p.slug}>
                <td>
                  <a className="player-link" href={`/players/${p.slug}`}>
                    {p.displayName}
                  </a>
                </td>
                <td>{p.position}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
