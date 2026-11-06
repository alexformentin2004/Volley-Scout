/* Beta 39.6 — iPhone stability and accessibility, without altering scout data. */
(function(){
"use strict";
const root=document.getElementById("content"),nav=document.getElementById("nav");
if(!root||!nav)return;
let focusMemory=null;
function decorate(){
 const current=typeof tab==="string"?tab:"Home";
 root.dataset.vs396Tab=current;
 root.querySelectorAll('input:not([type="file"]),textarea,select').forEach(el=>{
  if(el.tagName==="INPUT"&&["text","search","number","email","tel"].includes(el.type)||el.tagName==="TEXTAREA"||el.tagName==="SELECT"){
   el.style.fontSize="max(16px, 1em)";
  }
 });
 root.querySelectorAll('button[data-quality],button[data-fund],button[data-player],button.zone').forEach(el=>{
  el.classList.add("vs396-touch");
 });
 root.querySelectorAll("details > summary").forEach(el=>{if(!el.hasAttribute("tabindex"))el.tabIndex=0});
 nav.querySelectorAll("button").forEach(el=>{el.setAttribute("type","button");el.setAttribute("aria-current",el.dataset.nav===current?"page":"false")});
}
function updateViewport(){
 const viewport=window.visualViewport;
 const height=viewport?viewport.height:window.innerHeight;
 const offset=viewport?viewport.offsetTop:0;
 const bottom=Math.max(0,window.innerHeight-height-offset);
 document.documentElement.style.setProperty("--vs396-keyboard",Math.round(bottom)+"px");
 document.documentElement.classList.toggle("vs396-keyboard-open",bottom>120);
}
const prevRender=render;
render=function(){
 const old=typeof tab==="string"?tab:"Home";
 const focused=document.activeElement;
 const key=focused&&root.contains(focused)&&focused.matches("input,textarea,select")?{id:focused.id,selection:focused.selectionStart??null}:null;
 prevRender();decorate();
 // Restore focus only to an identical field, never force focus on Live.
 if(old!=="Live"&&key?.id){
  const next=document.getElementById(key.id);
  if(next&&next.matches("input,textarea,select")&&document.activeElement!==next){
   try{next.focus({preventScroll:true});if(key.selection!==null&&next.setSelectionRange)next.setSelectionRange(key.selection,key.selection)}catch(e){}
  }
 }
};
if(window.visualViewport){
 window.visualViewport.addEventListener("resize",updateViewport,{passive:true});
 window.visualViewport.addEventListener("scroll",updateViewport,{passive:true});
}
window.addEventListener("orientationchange",()=>{document.documentElement.style.removeProperty("--vs396-keyboard");},{passive:true});
window.addEventListener("resize",updateViewport,{passive:true});
root.addEventListener("focusin",e=>{if(e.target.matches("input,textarea,select"))focusMemory=e.target.id||null});
root.addEventListener("focusout",e=>{if(e.target.id===focusMemory)focusMemory=null});
decorate();updateViewport();
})();
