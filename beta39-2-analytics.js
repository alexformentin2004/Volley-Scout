/* Beta 39.2 — shared per-set and per-player performance for UI and all exports. */
(function(){
"use strict";
const FUNDS=["Battuta","Ricezione","Difesa","Alzata","Attacco","Muro"];
function pct(a,n){return n?(100*a/n).toFixed(1).replace(".",",")+"%":"—"}
function metrics(actions){
 const n=actions.length,by=(f,q)=>actions.filter(a=>a.fundamental===f&&(q===undefined||a.quality===q)).length;
 const att=by("Attacco"),kills=by("Attacco","#"),errors=by("Attacco","=")+by("Attacco","-");
 const rec=by("Ricezione"),recGood=by("Ricezione","#")+by("Ricezione","+");
 const srv=by("Battuta"),ace=by("Battuta","#");
 return {n,att,kills,errors,attackPct:pct(kills,att),attackEff:pct(kills-errors,att),rec,recGood,recPct:pct(recGood,rec),srv,ace,servicePct:pct(ace,srv),points:kills+ace+by("Muro","#")};
}
function model(matches,filter){
 const rows=[],players=new Map();
 for(const m of matches){
  const all=(m.events||[]).filter(a=>a.type==="action");
  const sets=[...new Set(all.map(a=>Number(a.set)))].filter(Number.isFinite).sort((a,b)=>a-b);
  const teamObj=typeof team==="function"?team(m.teamId):null;
  for(const p of teamObj?.players||[])players.set(String(p.id),p);
  for(const a of all)if(a.playerId&&!players.has(String(a.playerId)))players.set(String(a.playerId),{id:a.playerId,number:a.number,name:a.playerName});
  for(const set of sets){
   if(filter!=null&&set!==Number(filter))continue;
   const events=all.filter(a=>Number(a.set)===set);
   rows.push({match:m,set,events,metrics:metrics(events)});
  }
 }
 const filtered=rows.flatMap(x=>x.events);
 const playerRows=[...players.values()].map(p=>{
  const actions=filtered.filter(a=>String(a.playerId)===String(p.id));
  return {player:p,actions,metrics:metrics(actions),bySet:rows.map(x=>({set:x.set,match:x.match,metrics:metrics(x.events.filter(a=>String(a.playerId)===String(p.id)))}))};
 }).filter(x=>x.actions.length).sort((a,b)=>b.metrics.points-a.metrics.points||b.metrics.n-a.metrics.n);
 return {rows,players:playerRows,totals:metrics(filtered)};
}
function sections(matches,filter){
 const data=model(matches,filter);
 const setRows=[["Partita","Set","Azioni","Attacchi","Punti attacco","Attacco punto %","Efficienza attacco %","Ricezioni","Ricezioni positive","Ricezione positiva %","Battute","Ace","Ace %","Punti individuali"]];
 for(const x of data.rows){const v=x.metrics;setRows.push([(typeof team==="function"?team(x.match.teamId)?.name:"Squadra"||"Squadra")+" vs "+(x.match.opponent||""),x.set,v.n,v.att,v.kills,v.attackPct,v.attackEff,v.rec,v.recGood,v.recPct,v.srv,v.ace,v.servicePct,v.points])}
 const playerRows=[["Giocatrice","Set","Azioni","Attacchi","Punti attacco","Attacco punto %","Efficienza attacco %","Ricezioni","Ricezione positiva %","Ace","Punti individuali"]];
 for(const p of data.players)for(const x of p.bySet){if(!x.metrics.n)continue;const v=x.metrics;playerRows.push(["#"+(p.player.number??"")+" "+(p.player.name||""),x.set,v.n,v.att,v.kills,v.attackPct,v.attackEff,v.rec,v.recPct,v.ace,v.points])}
 return [["39.2 Confronto set",setRows],["39.2 Atlete per set",playerRows]];
}
function table(rows){return '<div class="vs392-scroll"><table class="vs392-table"><thead><tr>'+rows[0].map(x=>'<th>'+esc(String(x))+'</th>').join("")+'</tr></thead><tbody>'+rows.slice(1).map(row=>'<tr>'+row.map(x=>'<td>'+esc(String(x))+'</td>').join("")+'</tr>').join("")+'</tbody></table></div>'}
function html(matches,filter){
 const ss=sections(matches,filter),data=model(matches,filter);
 return '<div class="card vs392-card"><h3>Confronto tra set</h3><p class="muted small">Dati osservati: le percentuali con — non hanno tentativi registrati. Efficienza attacco = (punti − errori − murate) / attacchi.</p>'+table(ss[0][1])+'</div><div class="card vs392-card"><h3>Andamento delle atlete per set</h3><p class="muted small">Una riga per atleta e set con azioni registrate.</p>'+table(ss[1][1])+'</div>';
}
const oldStats=stats;
stats=function(m){const base=oldStats(m),matches=m?[m]:db.matches;if(!matches.length)return base;const filter=statsSet==="all"?null:Number(statsSet);return base+html(matches,filter)};
const oldSections=reportSections;
reportSections=function(m,filter){return [...oldSections(m,filter),...sections([m],filter)]};
const oldCSV=matchCSV;
matchCSV=function(m){return oldCSV(m)+"\r\n\r\n"+sections([m],null).map(([title,rows])=>title+"\r\n"+rows.map(row=>row.map(csvCell).join(";")).join("\r\n")).join("\r\n\r\n")};
const oldHTML=matchReportHTML;
matchReportHTML=function(m,filter){
 const output=oldHTML(m,filter),a=output.indexOf("const views="),b=output.indexOf(";const labels=",a);
 if(a<0||b<0)return output;
 try{
  const views=JSON.parse(output.slice(a+12,b));
  for(const key of Object.keys(views)){const f=key==="all"?null:Number(key);views[key]+='<section><h2>Confronti per set e atlete · Beta 39.2</h2>'+html([m],f)+'</section>'}
  return output.slice(0,a+12)+JSON.stringify(views)+output.slice(b);
 }catch(e){return output}
};
const oldBind=bind;
bind=function(){
 oldBind();
 document.querySelectorAll("[data-report]").forEach(btn=>{
  const original=btn.onclick;
  btn.onclick=()=>{
   const m=db.matches.find(x=>String(x.id)===btn.dataset.report);if(!m)return original?.();
   const additions=sections([m],null).map(([name,rows])=>name+"\n"+rows.map(row=>row.join(" | ")).join("\n")).join("\n\n");
   const previousDownload=downloadText;
   // Preserve prior report content and append new analysis without changing the existing file format.
   downloadText=function(filename,body,mime){downloadText=previousDownload;return previousDownload(filename,body+"\n\n"+additions,mime)};
   try{original?.()}finally{downloadText=previousDownload}
  };
 });
};
window.vs392={model,sections};
})();
