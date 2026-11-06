/* Beta 39.1 — Live fast path: player context, guided next step, no extra confirmations. */
(function(){
"use strict";
function decorate(){
 if(typeof tab!=="string"||tab!=="Live")return;
 const root=document.getElementById("content");if(!root)return;
 const card=root.querySelector(".live-fund-first");if(!card)return;
 card.classList.add("vs391-live");
 const state=typeof stage==="string"?stage:"menu";
 const heading=card.querySelector("h3");
 if(state==="quality"&&typeof player!=="undefined"&&player){
  const panel=document.createElement("div");panel.className="vs391-player";
  const number=document.createElement("span");number.className="vs391-player-number";number.textContent="#"+(player.number??"—");
  const details=document.createElement("span");details.className="vs391-player-details";
  const name=document.createElement("strong");name.textContent=player.name||"Giocatrice";
  const action=document.createElement("small");action.textContent="Valuta "+(typeof fund==="string"?fund.toLowerCase():"l'azione")+" · salvataggio automatico";
  details.append(name,action);panel.append(number,details);
  if(heading)heading.insertAdjacentElement("afterend",panel);else card.prepend(panel);
  card.querySelectorAll("button[data-quality]").forEach(b=>{b.setAttribute("aria-label",(typeof fund==="string"?fund:"Azione")+", "+(player.name||"giocatrice")+", valutazione "+b.textContent.trim().replace(/\s+/g," "))});
 }
 if(state==="player"){
  card.querySelectorAll(".court button.zone[data-player]").forEach(b=>{b.classList.add("vs391-tap-player");b.setAttribute("title","Seleziona "+b.textContent.trim().replace(/\s+/g," "))});
 }
 if(state==="suggest"){
  const next=card.querySelector("button.suggest");if(next)next.classList.add("vs391-next");
  const dismiss=card.querySelector("#dismiss");if(dismiss)dismiss.classList.add("vs391-dismiss");
 }
 if(state==="menu")card.classList.add("vs391-menu");
}
const old=render;render=function(){old();decorate()};decorate();
})();
