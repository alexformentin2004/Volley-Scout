/* Volley Scout Beta 39.11 — History & Teams Studio.
   Presentation-only DOM decoration. Existing buttons, events and storage remain unchanged. */
(function(){
"use strict";
function make(tag,className,text){const el=document.createElement(tag);el.className=className;if(text!==undefined)el.textContent=text;return el}
function decorateHistory(root){
 root.classList.add("vs3911-history");
 const heading=root.querySelector("h1.title");
 if(heading&&!root.querySelector(".vs3911-eyebrow"))heading.before(make("div","vs3911-eyebrow","ARCHIVIO PARTITE"));
 const cards=Array.from(root.querySelectorAll(":scope > .card"));
 const backup=cards.find(c=>c.querySelector("#export"));
 if(backup){backup.classList.add("vs3911-backup");const s=backup.querySelector("summary");if(s)s.classList.add("vs3911-backup-summary")}
 const matches=cards.filter(c=>c.querySelector("[data-resume]"));
 if(matches.length&&!root.querySelector(".vs3911-history-count")){
  const count=make("div","vs3911-history-count");
  const big=make("strong","vs3911-history-count-number",String(matches.length));
  const label=make("span","vs3911-history-count-label",matches.length===1?"Partita archiviata":"Partite archiviate");
  count.append(big,label);
  if(backup)backup.after(count);else if(heading)heading.after(count);
 }
 matches.forEach(card=>{
  card.classList.add("vs3911-match-card");
  const resume=card.querySelector("[data-resume]");
  if(resume)resume.classList.add("vs3911-open-match");
  const summary=card.querySelector(":scope > .row");
  if(summary)summary.classList.add("vs3911-match-header");
  const firstTitle=summary?.querySelector("b");if(firstTitle)firstTitle.classList.add("vs3911-match-name");
  card.querySelectorAll("details").forEach(d=>{
   d.classList.add("vs3911-match-detail");
   const label=d.querySelector("summary");if(label)label.classList.add("vs3911-detail-summary");
   if(label?.textContent.includes("Gestione partita"))d.classList.add("vs3911-danger-section");
  });
 });
}
function decorateSettings(root){
 root.classList.add("vs3911-settings");
 const heading=root.querySelector("h1.title");
 if(heading&&!root.querySelector(".vs3911-eyebrow"))heading.before(make("div","vs3911-eyebrow","TEAM MANAGER"));
 const cards=Array.from(root.querySelectorAll(":scope > .card"));
 const create=cards.find(c=>c.querySelector("#add-team"));
 if(create){
  create.classList.add("vs3911-create-team");
  const h=create.querySelector("h3");if(h)h.before(make("div","vs3911-card-eyebrow","NUOVA SQUADRA"));
 }
 const teams=cards.filter(c=>c.querySelector("[data-delete-team]"));
 if(teams.length&&!root.querySelector(".vs3911-team-count")){
  const count=make("div","vs3911-team-count");
  count.append(make("strong","vs3911-team-count-number",String(teams.length)),make("span","vs3911-team-count-label",teams.length===1?"Squadra configurata":"Squadre configurate"));
  if(create)create.after(count);else if(heading)heading.after(count);
 }
 teams.forEach(card=>{
  card.classList.add("vs3911-team-card");
  const header=card.querySelector(":scope > .row");
  if(header)header.classList.add("vs3911-team-header");
  const name=header?.querySelector("h3");if(name)name.classList.add("vs3911-team-name");
  card.querySelectorAll("h3").forEach(h=>{if(h!==name)h.classList.add("vs3911-subheading")});
  card.querySelectorAll("select").forEach(s=>s.classList.add("vs3911-team-select"));
  card.querySelectorAll(".list > .item").forEach(item=>item.classList.add("vs3911-roster-item"));
  const deleteButton=card.querySelector("[data-delete-team]");if(deleteButton)deleteButton.classList.add("vs3911-delete-team");
  card.querySelectorAll("[data-save-lineup],[data-save-tactical],[data-add-player]").forEach(b=>b.classList.add("vs3911-save-button"));
 });
}
function decorate(){
 const root=document.getElementById("content");if(!root||typeof tab!=="string")return;
 if(tab==="Storico")decorateHistory(root);
 if(tab==="Impostazioni")decorateSettings(root);
}
const prior=render;render=function(){prior();decorate()};decorate();
})();
