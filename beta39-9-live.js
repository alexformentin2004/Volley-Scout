/* Beta 39.9 — Live Arena redesign. Presentation-only: existing handlers remain untouched. */
(function(){
"use strict";
const root=document.getElementById("content");
if(!root)return;
const stateLabels={menu:"Seleziona un fondamentale",player:"Scegli la giocatrice",quality:"Assegna la valutazione",suggest:"Prossima azione",sub:"Gestisci la sostituzione","serve-quick":"Conferma la battuta"};
function decorate(){
 if(typeof tab!=="string"||tab!=="Live")return;
 const match=typeof active==="function"?active():null;
 if(!match)return;
 root.classList.add("vs399-arena");
 const first=root.querySelector(".live-fund-first");
 const scoreboard=root.querySelector(".vs37-scoreboard")||Array.from(root.querySelectorAll(":scope > .card"))[1];
 if(first){
  first.classList.add("vs399-action-panel");
  const step=first.querySelector(".vs37-step");
  if(step){step.classList.add("vs399-stage");const label=step.querySelector(".vs37-step-caption");if(label)label.textContent=stateLabels[typeof stage==="string"?stage:"menu"]||"Registra l'azione";}
  const heading=first.querySelector("h3");
  if(heading)heading.classList.add("vs399-action-heading");
  first.querySelectorAll("[data-fund]").forEach(b=>{b.classList.add("vs399-fund");b.setAttribute("aria-label","Fondamentale "+b.dataset.fund)});
  first.querySelectorAll("[data-quality]").forEach(b=>{b.classList.add("vs399-quality");b.setAttribute("aria-label",b.getAttribute("aria-label")||"Valutazione "+b.dataset.quality+" "+b.textContent.trim())});
  first.querySelectorAll("[data-player]").forEach(b=>b.classList.add("vs399-court-player"));
  if(typeof stage==="string"&&stage==="menu"&&!first.querySelector(".vs399-menu-hint")){
   const hint=document.createElement("p");hint.className="vs399-menu-hint";hint.textContent="Tocca il fondamentale per registrare l'azione";if(heading)heading.after(hint);
  }
 }
 if(scoreboard){
  scoreboard.classList.add("vs399-scoreboard");
  const row=scoreboard.querySelector(".row");
  if(row)row.classList.add("vs399-match-meta");
  const score=scoreboard.querySelectorAll(".score");
  score.forEach(el=>el.classList.add("vs399-score-number"));
  const points=scoreboard.querySelectorAll("#point-us,#point-them");
  points.forEach(b=>b.classList.add("vs399-point-button"));
  const controls=scoreboard.querySelector(".stack");if(controls)controls.classList.add("vs399-tools");
 }
 const cards=root.querySelectorAll(":scope > .card");
 if(cards[2])cards[2].classList.add("vs399-activity");
}
const previous=render;render=function(){previous();decorate()};decorate();
})();
