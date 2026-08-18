// 여기에 실제 팀원 5명의 정보를 입력하세요.
// gameName / tagLine은 게임 내 "이름#태그" 형식에서 따옵니다. (예: Hide on bush#KR1)
// slug는 URL에 쓰일 영문/숫자 값입니다 (공백 없이).

export const PLAYERS = [
  {
    slug: "player-a",
    displayName: "이현택",
    gameName: "오일러항등식",
    tagLine: "KR1",
    position: "TOP",
  },
  {
    slug: "player-b",
    displayName: "송민건",
    gameName: "송민건",
    tagLine: "9639",
    position: "JGL",
  },
  {
    slug: "player-c",
    displayName: "송지환",
    gameName: "Sumlimity",
    tagLine: "KR2",
    position: "MID",
  },
  {
    slug: "player-d",
    displayName: "조신우",
    gameName: "우주Univ09",
    tagLine: "9624",
    position: "ADC",
  },
  {
    slug: "player-e",
    displayName: "황선우",
    gameName: "푸른소용돌이",
    tagLine: "KOR1",
    position: "SUP",
  },
];

export function getPlayerBySlug(slug) {
  return PLAYERS.find((p) => p.slug === slug);
}
