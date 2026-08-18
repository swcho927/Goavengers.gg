const KEY="RGAPI-3a558d5f-cd40-4e09-8475-d1e7bf38806c";
const PLAYERS=[
{name:"Sumlimity",tag:"KR2",role:"ADC"},
{name:"푸른소용돌이",tag:"KOR1",role:"SUP"},
{name:"우주Univ09",tag:"9624",role:"TOP"},
{name:"오일러항등식",tag:"KR1",role:"JGL"},
{name:"송민건",tag:"9639",role:"JGL"}];
const ACC="https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/";
const KR="https://kr.api.riotgames.com", MATCH="https://asia.api.riotgames.com/lol/match/v5/matches/";
let D=PLAYERS.map(p=>({...p,tier:"조회 중",rank:"",lp:0,wins:0,losses:0,recent:[],champs:[],kda:"-",recentWin:"-",score:0,error:""}));

async function api(u){let r=await fetch(u,{headers:{"X-Riot-Token":KEY}});if(!r.ok)throw Error("HTTP "+r.status);return r.json()}
async function load(p){
 try{
  let a=await api(ACC+encodeURIComponent(p.name)+"/"+encodeURIComponent(p.tag));
  let s=await api(KR+"/lol/summoner/v4/summoners/by-puuid/"+encodeURIComponent(a.puuid));
  let l=await api(KR+"/lol/league/v4/entries/by-summoner/"+encodeURIComponent(s.id));
  let solo=l.find(x=>x.queueType==="RANKED_SOLO_5x5");
  if(solo){p.tier=solo.tier;p.rank=solo.rank;p.lp=solo.leaguePoints;p.wins=solo.wins;p.losses=solo.losses}
  let ids=await api(MATCH+"by-puuid/"+encodeURIComponent(a.puuid)+"/ids?start=0&count=20"), games=[];
  for(let id of ids){try{let m=await api(MATCH+id);let me=m.info.participants.find(x=>x.puuid===a.puuid);if(me)games.push({win:me.win,champ:me.championName,k:me.kills,d:me.deaths,a:me.assists,cs:(me.totalMinionsKilled||0)+(me.neutralMinionsKilled||0),dur:m.info.gameDuration})}catch(e){}}
  p.recent=games;
  let cm={};games.forEach(g=>{cm[g.champ]??={n:0,w:0,k:0,d:0,a:0};let c=cm[g.champ];c.n++;if(g.win)c.w++;c.k+=g.k;c.d+=g.d;c.a+=g.a});
  p.champs=Object.entries(cm).map(([n,c])=>({n,g:c.n,w:Math.round(c.w/c.n*100),kda:c.d?((c.k+c.a)/c.d).toFixed(2):"Perfect"})).sort((a,b)=>b.g-a.g);
  let k=games.reduce((x,g)=>x+g.k+g.a,0),d=games.reduce((x,g)=>x+g.d,0);p.kda=d?(k/d).toFixed(2):"Perfect";
  p.recentWin=games.length?Math.round(games.filter(g=>g.win).length/games.length*100):"-";
  p.score=Math.min(100,Math.round((p.recentWin==="-"?0:p.recentWin)*.65+(p.kda==="Perfect"?10:Number(p.kda)*5)));
 }catch(e){p.error=e.message}
}
function tier(p){return p.tier==="조회 중"?"조회 중":p.tier==="UNRANKED"?"Unranked":`${p.tier} ${p.rank} · ${p.lp} LP`}
function wr(p){return p.wins+p.losses?((p.wins/(p.wins+p.losses))*100).toFixed(1):"-"}
function render(){
 cards.innerHTML=D.map((p,i)=>`<div class="card"><b>${p.name}#${p.tag}</b><div class="muted">${p.role}</div><div class="big blue">${tier(p)}</div><span class="green">${wr(p)}% 승률</span></div>`).join("");
 playersList.innerHTML=D.map((p,i)=>`<div class="player" onclick="profile(${i})"><span class="avatar">${p.name[0]}</span><b>${p.name}#${p.tag}</b><span class="muted">${p.role} · ${tier(p)}</span><span class="green">${wr(p)}%</span></div>`).join("");
 let s=[...D].sort((a,b)=>b.score-a.score),r=s.map((p,i)=>`<div class="player"><b>${i+1}. ${p.name}#${p.tag}</b><span>${tier(p)}</span><span class="blue">Score ${p.score||"-"}</span></div>`).join("");homeRank.innerHTML=r;rankList.innerHTML=r;
 who.innerHTML=D.map((p,i)=>`<option value="${i}">${p.name}#${p.tag}</option>`).join("");
}
function profile(i){let p=D[i],ch=p.champs.map(c=>`<tr><td>${c.n}</td><td>${c.g}</td><td>${c.w}%</td><td>${c.kda}</td></tr>`).join(""),m=p.recent.slice(0,10).map(g=>`<tr><td class="${g.win?'green':'red'}">${g.win?'승':'패'}</td><td>${g.champ}</td><td>${g.k}/${g.d}/${g.a}</td><td>${g.cs}</td></tr>`).join("");
profileData.innerHTML=`<h1>${p.name}#${p.tag}</h1><p>${p.role} · ${tier(p)}</p><div class="grid"><div class="card">승률<div class="big green">${wr(p)}%</div></div><div class="card">KDA<div class="big">${p.kda}</div></div><div class="card">AI Score<div class="big blue">${p.score}</div></div></div>${p.error?`<div class="box red">조회 실패: ${p.error}</div>`:""}<div class="box"><h2>챔피언 분석</h2><table><tr><th>챔피언</th><th>게임</th><th>승률</th><th>KDA</th></tr>${ch||"<tr><td colspan=4>데이터 없음</td></tr>"}</table></div><div class="box"><h2>최근 경기</h2><table><tr><th>결과</th><th>챔피언</th><th>KDA</th><th>CS</th></tr>${m||"<tr><td colspan=4>데이터 없음</td></tr>"}</table></div>`;page("profile")}
function coach(){let p=D[+who.value],m=mode.value;if(m==="recent")answer.innerHTML=`<h2>최근 전적 분석</h2><p>${p.name}의 최근 ${p.recent.length}게임 승률은 <b class="green">${p.recentWin}%</b>, KDA는 <b>${p.kda}</b>입니다.</p><p>패배 경기의 데스와 CS를 비교해 반복되는 실수를 먼저 확인하는 것을 추천합니다.</p>`;if(m==="plan")answer.innerHTML=`<h2>티어 상승 계획</h2><p>1. 주력 챔피언을 2~3개로 유지</p><p>2. 10게임 단위로 승률/KDA 측정</p><p>3. 패배 경기의 첫 데스 원인 기록</p>`;if(m==="champ"){let c=p.champs[0];answer.innerHTML=`<h2>챔피언 분석</h2><p>가장 많이 한 챔피언: <b>${c?.n||"없음"}</b></p><p>${c?`${c.g}게임 · ${c.w}% 승률 · KDA ${c.kda}`:"데이터 없음"}</p>`}}
function page(id){document.querySelectorAll("section").forEach(x=>x.classList.add("hide"));document.getElementById(id).classList.remove("hide");scrollTo(0,0)}
async function start(){render();status.textContent="5명 Riot 데이터 조회 중...";await Promise.all(D.map(load));render();let e=D.filter(p=>p.error).length;status.innerHTML=e?`<span class="red">${e}명 조회 실패</span> — 브라우저에서 Riot API 요청이 차단되었을 수 있습니다.`:`<span class="green">5명 데이터 조회 완료</span>`}
start();