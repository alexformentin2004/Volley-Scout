/* Beta 38 — presentation only: stats visualizations and searchable history. */
(function(){
function icon(){return '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 18V9m6 9V5m6 13v-7m6 7V3"/></svg>'}
function statsView(root){
 const cards=[...root.querySelectorAll(":scope > .card")];
 const overview=cards.find(c=>c.querySelector("h3")?.textContent.trim()==="Riepilogo squadra");
 if(!overview||overview.querySelector(".vs38-visual"))return;
 const matches=typeof active==="function"&&active()?[active()]:db.matches;
 const actions=matches.flatMap(m=>(m.events||[]).filter(e=>e.type==="action"&&(statsSet==="all"||Number(e.set)===Number(statsSet))));
 const names=["Battuta","Ricezione","Difesa","Alzata","Attacco","Muro"];
 const counts=names.map(name=>actions.filter(a=>a.fundamental===name).length);
 const max=Math.max(1,...counts);
 const panel=document.createElement("section");panel.className="vs38-visual";panel.setAttribute("aria-label","Grafico azioni per fondamentale");
 panel.innerHTML='<div class="vs38-chart-title">'+icon()+'<span>Distribuzione dei fondamentali</span></div><p class="muted small">Numero di azioni registrate nel filtro attivo</p>'+names.map((n,i)=>'<div class="vs38-chart-row"><span>'+n+'</span><div class="vs38-track"><div class="vs38-fill vs38-fill-'+i+'" style="width:'+(counts[i]/max*100).toFixed(1)+'%"></div></div><strong>'+counts[i]+'</strong></div>').join("");
 overview.appendChild(panel);
 const ranking=cards.find(c=>c.querySelector("h3")?.textContent.trim()==="Classifica atlete");
 if(ranking){ranking.classList.add("vs38-ranking");const table=ranking.querySelector("table");if(table){table.setAttribute("aria-label","Classifica atlete, scorri orizzontalmente");table.parentElement.classList.add("vs38-table-scroll")}}
 root.querySelectorAll("details.card").forEach(d=>d.classList.add("vs38-detail"));
}
function historyView(root){
 const title=root.querySelector(".title");if(!title||root.querySelector(".vs38-history-tools"))return;
 const cards=[...root.querySelectorAll(":scope > .card")].filter(c=>c.querySelector("[data-resume]"));
 const bar=document.createElement("div");bar.className="vs38-history-tools";
 const label=document.createElement("label");label.textContent="Cerca nello storico";label.htmlFor="vs38-history-search";
 const input=document.createElement("input");input.id="vs38-history-search";input.type="search";input.placeholder="Squadra, avversario o data…";input.autocomplete="off";
 const count=document.createElement("span");count.className="vs38-history-count";count.setAttribute("aria-live","polite");
 bar.append(label,input,count);const subtitle=root.querySelector(".vs-section-subtitle");(subtitle||title).insertAdjacentElement("afterend",bar);
 const update=()=>{const q=input.value.trim().toLocaleLowerCase("it");let shown=0;cards.forEach(c=>{const head=c.querySelector(".row");const match=(head?.textContent||"").toLocaleLowerCase("it").includes(q);c.hidden=!match;if(match)shown++});count.textContent=shown+" partite visualizzate su "+cards.length};
 input.addEventListener("input",update);update();
 cards.forEach(c=>c.classList.add("vs38-match-card"));
}
function enhance(){const root=document.getElementById("content");if(!root||typeof tab!=="string")return;if(tab==="Statistiche")statsView(root);if(tab==="Storico")historyView(root)}
const previous=render;render=function(){previous();enhance()};enhance();
})();
