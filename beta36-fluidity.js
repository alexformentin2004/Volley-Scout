/* Beta 36 — fluidita mobile, navigazione accessibile, scroll stabile. */
(function(){
let lastTab=typeof tab==="string"?tab:"Home",lastStage=typeof stage==="string"?stage:"menu",lastFocus=null;
const content=document.getElementById("content"),navEl=document.getElementById("nav");
if(!content||!navEl)return;
const baseRender=render;
render=function(){
 const nextTab=typeof tab==="string"?tab:"Home",nextStage=typeof stage==="string"?stage:"menu";
 const changedTab=nextTab!==lastTab;
 const priorScroll=window.scrollY;
 const activeEl=document.activeElement;
 const focusId=activeEl&&activeEl.id&&content.contains(activeEl)?activeEl.id:null;
 baseRender();
 if(changedTab){
  window.scrollTo({top:0,behavior:"instant"});
  content.classList.remove("vs36-enter");void content.offsetWidth;content.classList.add("vs36-enter");
 }else{
  // During a live action the page must not jump back to the top.
  if(nextTab==="Live"||nextTab==="Statistiche"||nextTab==="Storico"){
   window.scrollTo({top:Math.min(priorScroll,Math.max(0,document.documentElement.scrollHeight-innerHeight)),behavior:"instant"});
  }
  if(focusId&&nextTab!=="Live"){const el=document.getElementById(focusId);if(el&&el.matches("input,select,textarea"))try{el.focus({preventScroll:true})}catch(e){}}
 }
 lastTab=nextTab;lastStage=nextStage;
 navEl.querySelectorAll("[data-nav]").forEach(b=>{if(b.dataset.nav===nextTab)b.setAttribute("aria-current","page");else b.removeAttribute("aria-current")});
};
navEl.addEventListener("pointerdown",e=>{const b=e.target.closest("button");if(b){b.classList.add("vs36-pressed");setTimeout(()=>b.classList.remove("vs36-pressed"),160)}},{passive:true});
document.addEventListener("visibilitychange",()=>{if(!document.hidden)document.documentElement.classList.remove("vs36-background")});
document.addEventListener("pagehide",()=>document.documentElement.classList.add("vs36-background"));
navEl.querySelectorAll("[data-nav]").forEach(b=>{if(b.dataset.nav===lastTab)b.setAttribute("aria-current","page")});
})();
