/* Beta 39.3 — history action filters, non-destructive. */
(function(){
"use strict";
const state=new Map();
function enhance(){
 if(typeof tab!=="string"||tab!=="Storico")return;
 const root=document.getElementById("content");if(!root)return;
 root.querySelectorAll(".card").forEach(card=>{
  const resume=card.querySelector("[data-resume]");if(!resume)return;
  const matchId=resume.dataset.resume;
  const match=db.matches.find(m=>String(m.id)===String(matchId));if(!match)return;
  const details=[...card.querySelectorAll("details")].find(d=>d.querySelector("summary")?.textContent.includes("Correggi azioni"));
  if(!details||details.querySelector(".vs393-controls"))return;
  const acts=(match.events||[]).filter(e=>e.type==="action");
  const rows=[...details.querySelectorAll(".item")].filter(el=>el.querySelector("[data-edit-action]"));
  const prior=state.get(matchId)||{set:"all",fund:"all",query:""};
  const bar=document.createElement("div");bar.className="vs393-controls";
  const label=document.createElement("p");label.className="muted small";label.textContent="Filtra le azioni prima di correggerle. Nessuna modifica viene applicata finché non scegli Modifica o Elimina.";
  const setSelect=document.createElement("select");setSelect.setAttribute("aria-label","Filtra per set");
  const sets=[...new Set(acts.map(e=>String(e.set)))].sort((a,b)=>Number(a)-Number(b));
  setSelect.innerHTML='<option value="all">Tutti i set</option>'+sets.map(n=>'<option value="'+n+'">Set '+n+'</option>').join("");
  const fundSelect=document.createElement("select");fundSelect.setAttribute("aria-label","Filtra per fondamentale");
  fundSelect.innerHTML='<option value="all">Tutti i fondamentali</option>'+["Battuta","Ricezione","Difesa","Alzata","Attacco","Muro"].map(n=>'<option value="'+n+'">'+n+'</option>').join("");
  const search=document.createElement("input");search.type="search";search.placeholder="Cerca giocatrice o numero";search.setAttribute("aria-label","Cerca giocatrice");
  const counter=document.createElement("p");counter.className="muted small";counter.setAttribute("aria-live","polite");
  bar.append(label,setSelect,fundSelect,search,counter);
  const summary=details.querySelector("summary");summary.insertAdjacentElement("afterend",bar);
  setSelect.value=sets.includes(prior.set)?prior.set:"all";
  fundSelect.value=prior.fund;search.value=prior.query;
  function update(){
   const filter={set:setSelect.value,fund:fundSelect.value,query:search.value.trim().toLocaleLowerCase("it")};state.set(matchId,filter);
   let visible=0;
   for(const row of rows){
    const id=row.querySelector("[data-edit-action]")?.dataset.editAction;
    const e=acts.find(a=>String(a.id)===String(id));
    const matches=!!e&&(filter.set==="all"||String(e.set)===filter.set)&&(filter.fund==="all"||e.fundamental===filter.fund)&&(!filter.query||("#"+(e.number??"")+" "+(e.playerName||"")).toLocaleLowerCase("it").includes(filter.query));
    row.hidden=!matches;if(matches)visible++;
   }
   counter.textContent=visible+" azioni visualizzate su "+acts.length;
  }
  [setSelect,fundSelect].forEach(el=>el.addEventListener("change",update));
  search.addEventListener("input",update);
  update();
 });
}
const oldRender=render;render=function(){oldRender();enhance()};enhance();
})();
