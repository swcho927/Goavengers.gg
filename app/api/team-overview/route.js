import { NextResponse } from "next/server";
import { PLAYERS } from "@/lib/players";
import {
  getAccountByRiotId,
  getLeagueEntriesByPuuid,
  getSoloQueueEntry,
} from "@/lib/riotApi";

export async function GET() {
  try {
    const results = await Promise.all(
      PLAYERS.map(async (player) => {
        try {
          const account = await getAccountByRiotId(player.gameName, player.tagLine);
          const entries = await getLeagueEntriesByPuuid(account.puuid);
          const solo = getSoloQueueEntry(entries);

          return {
            ...player,
            puuid: account.puuid,
            tier: solo?.tier ?? "UNRANKED",
            rank: solo?.rank ?? "",
            lp: solo?.leaguePoints ?? 0,
            wins: solo?.wins ?? 0,
            losses: solo?.losses ?? 0,
          };
        } catch (err) {
          return { ...player, error: err.message };
        }
      })
    );

    return NextResponse.json({ players: results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
