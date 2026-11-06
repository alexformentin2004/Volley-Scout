/* Beta 39.10 — Stats Studio visual redesign. No statistical formulas changed. */
(function(){
"use strict";
function decorate(){
 if(typeof tab!=="string"||tab!=="Statistiche")return;
 const root=document.getElementById("content");if(!root)return;
 root.classList.add("vs3910-studio");
 const cards=[...root.querySelectorAll(":scope > .card")];
 const summary=cards.find(c=>c.querySelector("h3")?.textContent.trim()==="Riepilogo squadra");
 const ranking=cards.find(c=>c.querySelector("h3")?.textContent.trim()==="Classifica atlete");
 const setComparison=cards.find(c=>c.querySelector("h3")?.textContent.trim()==="Confronto tra set");
 const playerComparison=cards.find(c=>c.querySelector("h3")?.textContent.trim()==="Andamento delle atlete per set");
 if(summary){
  summary.classList.add("vs3910-overview");
  const tiles=[...summary.querySelectorAll(":scope > .grid > .item")];
  tiles.forEach((tile,index)=>{
   tile.classList.add("vs3910-kpi");
   if(index===0)tile.classList.add("vs3910-kpi-featured");
   if([1,2,3].includes(index))tile.classList.add("vs3910-kpi-scoring");
   const value=tile.querySelector("b");if(value)value.classList.add("vs3910-kpi-value");
  });
  if(!summary.querySelector(".vs3910-overview-label")){
   const label=document.createElement("div");label.className="vs3910-overview-label";label.textContent="PERFORMANCE OVERVIEW";
   summary.prepend(label);
  }
 }
 if(ranking){ranking.classList.add("vs3910-ranking");const table=ranking.querySelector("table");if(table)table.classList.add("vs3910-ranking-table")}
 if(setComparison)setComparison.classList.add("vs3910-compare");
 if(playerComparison)playerComparison.classList.add("vs3910-compare");
 const filter=root.querySelector("#stats-set");
 if(filter){const container=filter.closest(".card");if(container)container.classList.add("vs3910-filter");filter.setAttribute("aria-label","Filtra statistiche per set")}
 const detailHeading=[...root.querySelectorAll("h2")].find(h=>h.textContent.trim()==="Analisi individuale");
 if(detailHeading)detailHeading.classList.add("vs3910-section-heading");
 root.querySelectorAll("details.card").forEach(d=>d.classList.add("vs3910-player-detail"));
 const fundamentalNames=["Battuta","Ricezione","Difesa","Alzata","Attacco","Muro"];
 cards.forEach(c=>{const heading=c.querySelector("h3");if(heading&&fundamentalNames.some(n=>heading.textContent.startsWith(n+" ·")))c.classList.add("vs3910-fundamental")});
 const visuals=root.querySelector(".vs38-visual");if(visuals)visuals.classList.add("vs3910-visual");
}
const previous=render;render=function(){previous();decorate()};decorate();
})();
