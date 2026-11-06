/* Beta 39.8 — Home editorial layout and navigation visual hierarchy.
   DOM-only decoration after existing render/bind; never replaces inputs or handlers. */
(function(){
"use strict";
const root=document.getElementById("content"),navEl=document.getElementById("nav");
if(!root||!navEl)return;
const icons={Home:"⌂",Live:"●",Statistiche:"▥",Storico:"◷",Impostazioni:"⚙"};
function decorate(){
 const current=typeof tab==="string"?tab:"Home";
 navEl.querySelectorAll("button[data-nav]").forEach(button=>{
  const name=button.dataset.nav;
  button.classList.add("vs398-nav-item");
  button.setAttribute("aria-label","Apri "+name);
  button.setAttribute("aria-current",name===current?"page":"false");
  const textNodes=Array.from(button.childNodes).filter(n=>n.nodeType===Node.TEXT_NODE&&n.textContent.trim());
  textNodes.forEach(n=>{if(!n.parentElement?.classList.contains("vs398-nav-label")){const label=document.createElement("span");label.className="vs398-nav-label";label.textContent=n.textContent.trim();n.replaceWith(label)}});
  if(name==="Live")button.classList.add("vs398-nav-live");
 });
 if(current!=="Home")return;
 root.classList.add("vs398-home");
 const title=root.querySelector("h1.title");
 if(title&&!root.querySelector(".vs398-eyebrow")){
  const eyebrow=document.createElement("div");eyebrow.className="vs398-eyebrow";eyebrow.textContent="MATCH CENTER";
  title.before(eyebrow);
 }
 const cards=Array.from(root.querySelectorAll(":scope > .card"));
 const activeCard=cards.find(c=>c.querySelector('[data-nav="Live"]'));
 const createCard=cards.find(c=>c.querySelector("#start"));
 if(activeCard){
  activeCard.classList.add("vs398-active-match");
  const heading=activeCard.querySelector("h3");if(heading)heading.classList.add("vs398-card-title");
  const score=activeCard.querySelector(".score");if(score){score.classList.add("vs398-home-score");score.setAttribute("aria-label","Punteggio attuale "+score.textContent.trim())}
  const button=activeCard.querySelector('[data-nav="Live"]');if(button)button.classList.add("vs398-continue");
 }
 if(createCard){
  createCard.classList.add("vs398-create-match");
  const heading=createCard.querySelector("h3");
  if(heading){heading.classList.add("vs398-card-title");if(!createCard.querySelector(".vs398-card-kicker")){const kicker=document.createElement("span");kicker.className="vs398-card-kicker";kicker.textContent="PREPARAZIONE PARTITA";heading.before(kicker)}}
  const start=createCard.querySelector("#start");if(start)start.classList.add("vs398-start");
  const fields=createCard.querySelectorAll("select,input:not([type=hidden])");
  fields.forEach(field=>{field.classList.add("vs398-field");const previous=field.previousElementSibling;if(previous&&previous.tagName==="LABEL")previous.classList.add("vs398-field-label")});
 }
}
const old=render;render=function(){old();decorate()};decorate();
})();
