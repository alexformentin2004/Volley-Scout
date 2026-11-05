/* Beta 39 — stability and usability polish. No data schema changes. */
(function(){
"use strict";
let historyQuery="";
let previousTab=typeof tab==="string"?tab:"Home";
let previousRender=render;
let busy=false;
function enhance(){
 const root=document.getElementById("content");
 const nav=document.getElementById("nav");
 if(!root)return;
 const current=typeof tab==="string"?tab:"Home";
 root.dataset.vs39Tab=current;
 if(nav){
  nav.setAttribute("aria-label","Navigazione principale");
  nav.querySelectorAll("button[data-nav]").forEach(b=>{
   b.setAttribute("type","button");
   b.setAttribute("aria-label","Apri "+b.dataset.nav);
   if(b.dataset.nav===current)b.setAttribute("aria-current","page");
   else b.removeAttribute("aria-current");
  });
 }
 root.querySelectorAll("button:not([type])").forEach(b=>b.type="button");
 root.querySelectorAll("button").forEach(b=>{
  if(!b.hasAttribute("aria-label")&&!b.textContent.trim())b.setAttribute("aria-label",b.title||"Comando");
 });
 root.querySelectorAll("details").forEach(d=>{const summary=d.querySelector(":scope > summary");if(summary)summary.setAttribute("role","button")});
 if(current==="Storico"){
  const search=root.querySelector("#vs38-history-search");
  if(search){
   search.value=historyQuery;
   if(historyQuery)search.dispatchEvent(new Event("input",{bubbles:true}));
   search.addEventListener("input",()=>{historyQuery=search.value},{passive:true});
  }
 }
 if(current!==previousTab)historyQuery="";
 previousTab=current;
}
render=function(){
 if(busy)return previousRender();
 busy=true;
 try{previousRender();enhance()}finally{busy=false}
};
enhance();
})();
