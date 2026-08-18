// participant 배열(각 매치에서 해당 선수 데이터)을 받아 요약 통계를 계산합니다.

export function summarizeMatches(participants) {
  const games = participants.length;
  if (games === 0) {
    return {
      games: 0,
      wins: 0,
      losses: 0,
      winrate: 0,
      avgKills: 0,
      avgDeaths: 0,
      avgAssists: 0,
      kda: 0,
      champions: [],
    };
  }

  let wins = 0;
  let kills = 0;
  let deaths = 0;
  let assists = 0;
  const champMap = new Map();

  for (const p of participants) {
    if (p.win) wins++;
    kills += p.kills;
    deaths += p.deaths;
    assists += p.assists;

    const champ = p.championName;
    if (!champMap.has(champ)) {
      champMap.set(champ, { champion: champ, games: 0, wins: 0, kills: 0, deaths: 0, assists: 0 });
    }
    const c = champMap.get(champ);
    c.games++;
    if (p.win) c.wins++;
    c.kills += p.kills;
    c.deaths += p.deaths;
    c.assists += p.assists;
  }

  const champions = Array.from(champMap.values())
    .map((c) => ({
      champion: c.champion,
      games: c.games,
      wins: c.wins,
      losses: c.games - c.wins,
      winrate: Math.round((c.wins / c.games) * 1000) / 10,
      kda:
        c.deaths === 0
          ? c.kills + c.assists
          : Math.round(((c.kills + c.assists) / c.deaths) * 100) / 100,
    }))
    .sort((a, b) => b.games - a.games);

  return {
    games,
    wins,
    losses: games - wins,
    winrate: Math.round((wins / games) * 1000) / 10,
    avgKills: Math.round((kills / games) * 10) / 10,
    avgDeaths: Math.round((deaths / games) * 10) / 10,
    avgAssists: Math.round((assists / games) * 10) / 10,
    kda: deaths === 0 ? kills + assists : Math.round(((kills + assists) / deaths) * 100) / 100,
    champions,
  };
}
