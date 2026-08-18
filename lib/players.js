// 여기에 실제 팀원 5명의 정보를 입력하세요.
// gameName / tagLine은 게임 내 "이름#태그" 형식에서 따옵니다. (예: Hide on bush#KR1)
// slug는 URL에 쓰일 영문/숫자 값입니다 (공백 없이).

export const PLAYERS = [
  {
    slug: "player-a",
    displayName: "Player A",
    gameName: "게임닉네임A",
    tagLine: "KR1",
    position: "TOP",
  },
  {
    slug: "player-b",
    displayName: "Player B",
    gameName: "게임닉네임B",
    tagLine: "KR1",
    position: "JGL",
  },
  {
    slug: "player-c",
    displayName: "Player C",
    gameName: "게임닉네임C",
    tagLine: "KR1",
    position: "MID",
  },
  {
    slug: "player-d",
    displayName: "Player D",
    gameName: "게임닉네임D",
    tagLine: "KR1",
    position: "ADC",
  },
  {
    slug: "player-e",
    displayName: "Player E",
    gameName: "게임닉네임E",
    tagLine: "KR1",
    position: "SUP",
  },
];

export function getPlayerBySlug(slug) {
  return PLAYERS.find((p) => p.slug === slug);
}
