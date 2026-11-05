/* Beta 37 — Live Match Pro: visual hierarchy and stage guidance, no changes to scouting logic. */
(function(){
const stages={menu:["01","Scegli il fondamentale"],"serve-quick":["02","Conferma chi batte"],player:["02","Seleziona la giocatrice"],quality:["03","Registra la valutazione"],suggest:["04","Prossima azione"],sub:["↔","Gestisci la sostituzione"]};
const glyphs={rotate:"⟳","sub-open":"⇄",undo:"↶","repeat-last":"↻","quick-toggle":"⚡","next-set":"▦","finish-scout":"✓"};
function decorate(){
 const root=document.getElementById("content");
 if(!root||typeof tab==="undefined"||tab!=="Live"||typeof active!=="function"||!active())return;
 root.classList.add("vs37-live");
 const first=root.querySelector(".live-fund-first");
 if(first&&!first.querySelector(".vs37-step")){
  const info=stages[typeof stage==="string"?stage:"menu"]||stages.menu;
  const badge=document.createElement("div");badge.className="vs37-step";
  badge.innerHTML='<span class="vs37-step-number">'+info[0]+'</span><span class="vs37-step-caption">'+info[1]+'</span>';
  first.insertBefore(badge,first.firstChild);
 }
 const cards=root.querySelectorAll(":scope > .card");
 const scoreboard=cards[1];
 if(scoreboard&&!scoreboard.classList.contains("vs37-scoreboard")){
  scoreboard.classList.add("vs37-scoreboard");
  const score=scoreboard.querySelectorAll(".score");
  score.forEach(s=>s.setAttribute("aria-label","Punti: "+s.textContent.trim()));
  Object.keys(glyphs).forEach(id=>{const b=scoreboard.querySelector("#"+id);if(b&&!b.querySelector(".vs37-tool-icon")){const icon=document.createElement("span");icon.className="vs37-tool-icon";icon.setAttribute("aria-hidden","true");icon.textContent=glyphs[id];b.prepend(icon)}});
 }
 const last=cards[2];if(last)last.classList.add("vs37-last-actions");
 root.querySelectorAll(".quality").forEach(b=>{b.classList.add("vs37-quality");const t=b.querySelector("strong");if(t)t.setAttribute("aria-hidden","true")});
}
const prev=render;render=function(){prev();decorate()};decorate();
})();
