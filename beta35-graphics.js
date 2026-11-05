/* Beta 35.2 — visual identity with illustrated fundamental icons and section headers. */
(function(){
const shapes={
 Battuta:'<circle cx="12" cy="12" r="8"/><path d="M5 7c5 0 8 4 8 12M9 4c1 5 5 8 11 8M4 14c5-2 10-2 15 2"/>',
 Ricezione:'<path d="M3 17l6-5 4 2 7-6M6 7l3 5M15 4l5 4M3 21h18"/><circle cx="16" cy="5" r="2"/>',
 Difesa:'<path d="M12 2l8 4v6c0 5-3 8-8 10-5-2-8-5-8-10V6z"/><path d="M8 12l3 3 5-6"/>',
 Alzata:'<path d="M5 19l3-7 4 2 4-2 3 7M8 12V8m8 4V8"/><circle cx="12" cy="5" r="3"/>',
 Attacco:'<path d="M4 20l6-7 4 2 6-9M14 6h6v6"/><path d="M4 9h6M7 6v6"/>',
 Muro:'<path d="M3 21V9l4-3 4 3v12M11 21V5l4-3 4 3v16M3 14h16M3 18h16"/>'
};
const section={
 Home:['house','Il tuo campo, la tua partita'],
 Live:['activity','Ogni azione conta'],
 Statistiche:['chart','Dati chiari, decisioni migliori'],
 Storico:['archive','Le tue partite, sempre con te'],
 Impostazioni:['users','La tua squadra, organizzata']
};
const icons={
 house:'<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/>',
 activity:'<path d="M2 12h4l3-7 5 14 3-7h5"/>',
 chart:'<rect x="3" y="12" width="4" height="9" rx="1"/><rect x="10" y="7" width="4" height="14" rx="1"/><rect x="17" y="3" width="4" height="18" rx="1"/>',
 archive:'<rect x="3" y="4" width="18" height="5" rx="1"/><path d="M5 9v11h14V9M10 14h4"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><circle cx="18" cy="9" r="2"/><path d="M17 15a5 5 0 0 1 4 5"/>'
};
function svg(path,cls){return '<svg class="'+cls+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+path+'</svg>'}
function decorate(){const root=document.getElementById("content");if(!root)return;const tabName=typeof tab==="string"?tab:"Home";root.classList.remove("vs-home","vs-live","vs-statistiche","vs-storico","vs-impostazioni");root.classList.add("vs-"+tabName.toLowerCase());const title=root.querySelector(".title");if(title&&!title.querySelector(".vs-title-icon")){const [ico,subtitle]=section[tabName]||section.Home;title.insertAdjacentHTML("afterbegin",'<span class="vs-title-icon">'+svg(icons[ico],"vs-section-svg")+'</span>');const subtitleEl=document.createElement("span");subtitleEl.className="vs-section-subtitle";subtitleEl.textContent=subtitle;title.insertAdjacentElement("afterend",subtitleEl)}
root.querySelectorAll("[data-fund]").forEach(btn=>{if(btn.querySelector(".vs-fund-icon"))return;const name=btn.dataset.fund;if(!shapes[name])return;btn.classList.add("vs-fund-art");btn.insertAdjacentHTML("afterbegin",'<span class="vs-fund-icon">'+svg(shapes[name],"vs-fund-svg")+'</span>')});
document.querySelectorAll("#nav [data-nav]").forEach(btn=>{const name=btn.dataset.nav,entry=section[name];if(!entry)return;const b=btn.querySelector("b");if(b)b.innerHTML=svg(icons[entry[0]],"vs-nav-svg")});
const headers=[["Nuovo scout","🏐"],["Partita in corso","●"],["Aggiungi squadra","♧"]];root.querySelectorAll(".card > h3,.card > .row > h3").forEach(h=>{const match=headers.find(x=>h.textContent.trim()===x[0]);if(match&&!h.querySelector(".vs-card-icon"))h.insertAdjacentHTML("afterbegin",'<span class="vs-card-icon" aria-hidden="true">'+match[1]+'</span>')});
}
const originalRender=render;render=function(){originalRender();decorate()};decorate();
})();
