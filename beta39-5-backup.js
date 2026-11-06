/* Beta 39.5 — guarded imports, local recovery snapshot and backup timestamp. */
(function(){
"use strict";
const SNAP="volley-scout-recovery-v395",STAMP="volley-scout-backup-date-v395";
function snapshot(){
 try{localStorage.setItem(SNAP,JSON.stringify({savedAt:new Date().toISOString(),data:db}));return true}catch(e){return false}
}
function valid(data){
 if(!data||typeof data!=="object"||!Array.isArray(data.teams)||!Array.isArray(data.matches))throw Error("Il file non contiene squadre e partite valide.");
 if(data.teams.length>1000||data.matches.length>10000)throw Error("Il backup supera i limiti di sicurezza.");
 const teamIds=new Set(),matchIds=new Set();
 for(const t of data.teams){
  if(!t||typeof t.id!=="string"||!t.id||!Array.isArray(t.players)||t.players.length>1000||teamIds.has(t.id))throw Error("Squadra duplicata o non valida.");
  teamIds.add(t.id);
  if(t.players.some(p=>!p||typeof p.id!=="string"||typeof p.name!=="string"))throw Error("Giocatrice non valida.");
 }
 for(const m of data.matches){
  if(!m||typeof m.id!=="string"||!m.id||matchIds.has(m.id)||typeof m.teamId!=="string"||!teamIds.has(m.teamId)||!Array.isArray(m.events)||m.events.length>100000)throw Error("Partita non valida o squadra mancante.");
  matchIds.add(m.id);
  if(m.events.some(e=>!e||typeof e!=="object"||typeof e.type!=="string"))throw Error("Evento partita non valido.");
 }
 return true;
}
function download(name,content){
 const url=URL.createObjectURL(new Blob([content],{type:"application/json;charset=utf-8"}));
 const a=document.createElement("a");a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),30000);
}
async function importFile(e){
 const input=e.target,file=input.files?.[0];if(!file)return;
 try{
  if(file.size>25*1024*1024)throw Error("File troppo grande (massimo 25 MB).");
  const parsed=JSON.parse(await file.text());valid(parsed);
  const count=parsed.matches.reduce((n,m)=>n+m.events.filter(e=>e.type==="action").length,0);
  if(!confirm("Backup verificato: "+parsed.teams.length+" squadre, "+parsed.matches.length+" partite e "+count+" azioni.\n\nSostituire tutti i dati attuali?"))return;
  const old=JSON.stringify(db);
  download("volley-scout-prima-importazione-"+new Date().toISOString().slice(0,10)+".json",old);
  if(!snapshot()&&!confirm("Non è stato possibile creare una copia di recupero locale. Una copia JSON è stata richiesta al browser, ma verifica che sia stata salvata. Continuare?"))return;
  db={teams:parsed.teams,matches:parsed.matches,active:matchIdsafe(parsed.active,parsed.matches)};
  try{persist()}catch(err){db=JSON.parse(old);throw Error("Memoria insufficiente: i dati precedenti sono stati ripristinati in questa sessione. "+err.message)}
  render();alert("Importazione completata. Conserva il backup precedente.");
 }catch(err){alert("Importazione annullata: "+err.message)}finally{input.value=""}
}
function matchIdsafe(id,matches){return matches.some(m=>m.id===id)?id:null}
function decorate(){
 if(typeof tab!=="string"||tab!=="Storico")return;
 const input=document.getElementById("import"),exportBtn=document.getElementById("export");
 if(input&&!input.dataset.vs395){
  input.dataset.vs395="1";
  input.addEventListener("change",e=>{e.stopImmediatePropagation();importFile(e)},true);
 }
 if(exportBtn&&!exportBtn.dataset.vs395){
  exportBtn.dataset.vs395="1";
  exportBtn.addEventListener("click",()=>{try{localStorage.setItem(STAMP,new Date().toISOString())}catch(e){}},true);
 }
 const backup=exportBtn?.closest("details");if(!backup||backup.querySelector(".vs395-recovery"))return;
 const panel=document.createElement("div");panel.className="vs395-recovery";
 const label=document.createElement("p");label.className="muted small";
 const stamp=localStorage.getItem(STAMP);
 label.textContent="Ultimo backup JSON richiesto: "+(stamp?new Date(stamp).toLocaleString("it-IT"):"nessuno registrato su questo dispositivo")+". Verifica sempre che il file sia stato scaricato.";
 const saved=localStorage.getItem(SNAP);
 panel.append(label);
 if(saved){
  const b=document.createElement("button");b.type="button";b.className="secondary full";b.textContent="Ripristina copia di recupero locale";
  b.onclick=()=>{
   try{
    const obj=JSON.parse(localStorage.getItem(SNAP));valid(obj.data);
    if(!confirm("Ripristinare la copia locale del "+new Date(obj.savedAt).toLocaleString("it-IT")+"? I dati attuali saranno sostituiti."))return;
    const current=JSON.stringify(db);download("volley-scout-prima-ripristino.json",current);
    db=obj.data;persist();render();
   }catch(e){alert("Recupero non riuscito: "+e.message)}
  };
  panel.append(b);
 }
 backup.append(panel);
}
const oldRender=render;render=function(){oldRender();decorate()};decorate();
document.addEventListener("click",e=>{
 const b=e.target.closest?.("[data-delete-match],[data-delete-set],[data-delete-team]");
 if(!b)return;
 snapshot();
},true);
})();
