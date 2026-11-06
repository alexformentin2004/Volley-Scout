/* Volley Scout Beta 39.13 — storage safety, diagnostics, emergency export.
   Keeps the original storage key and existing scouting workflow unchanged. */
(function(){
"use strict";
const KEY="volley-scout-beta-v1";
let lastFailure=false,lastNotice=0;
function validState(v){return !!v&&typeof v==="object"&&Array.isArray(v.teams)&&Array.isArray(v.matches)}
function stateStatus(){
 try{
  const raw=localStorage.getItem(KEY);
  if(raw===null)return {ok:true,empty:true,bytes:0};
  const parsed=JSON.parse(raw);
  return {ok:validState(parsed),empty:false,bytes:new Blob([raw]).size};
 }catch(e){return {ok:false,empty:false,bytes:0}}
}
function downloadEmergency(){
 const data=JSON.stringify({version:1,...db},null,2);
 const blob=new Blob([data],{type:"application/json;charset=utf-8"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="volley-scout-salvataggio-emergenza-"+new Date().toISOString().slice(0,10)+".json";
 document.body.appendChild(a);a.click();a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),30000);
}
const previousPersist=persist;
persist=function(){
 try{
  if(!validState(db))throw Error("struttura dati non valida");
  previousPersist();
  lastFailure=false;
 }catch(e){
  lastFailure=true;
  const now=Date.now();
  if(now-lastNotice>1500){
   lastNotice=now;
   alert("ATTENZIONE: i dati NON sono stati salvati sul dispositivo. Non chiudere l'app. Apri Storico > Backup e usa 'Esporta copia di emergenza'. Dettaglio: "+(e?.message||"memoria non disponibile"));
  }
  throw e;
 }
};
function decorate(){
 if(typeof tab!=="string"||tab!=="Storico")return;
 const root=document.getElementById("content");
 const exportButton=root?.querySelector("#export");
 const parent=exportButton?.closest("details");
 if(!parent||parent.querySelector(".vs3913-safety"))return;
 const panel=document.createElement("section");panel.className="vs3913-safety";
 const heading=document.createElement("h4");heading.textContent="Protezione dati";panel.append(heading);
 const status=document.createElement("p");status.className="vs3913-status";
 const result=stateStatus();
 status.textContent=lastFailure?"Salvataggio non riuscito: esporta immediatamente una copia.":!result.ok?"Archivio locale non leggibile: conserva i dati attuali ed esporta una copia.":result.empty?"Nessun archivio locale ancora registrato.":"Archivio locale leggibile · "+(result.bytes/1024).toFixed(1)+" KB";
 status.classList.toggle("vs3913-warning",lastFailure||!result.ok);
 panel.append(status);
 const note=document.createElement("p");note.className="muted small";
 note.textContent="I dati restano su questo dispositivo. Un backup JSON esterno è essenziale prima di cancellazioni, cambi di telefono o pulizia di Safari.";
 panel.append(note);
 const button=document.createElement("button");button.type="button";button.className="secondary full vs3913-emergency";button.textContent="Esporta copia di emergenza";
 button.addEventListener("click",()=>{try{downloadEmergency()}catch(e){alert("Esportazione non riuscita: "+e.message)}});
 panel.append(button);
 parent.append(panel);
}
const previousRender=render;render=function(){previousRender();decorate()};decorate();
window.addEventListener("storage",e=>{if(e.key!==KEY)return;const result=stateStatus();if(!result.ok)lastFailure=true;});
})();
