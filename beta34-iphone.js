/* Beta 34: indicatori di connettivita, aggiornamenti PWA e protezione tocchi iPhone. */
(function(){
 const banner=document.createElement("div");banner.id="b34-status";banner.setAttribute("role","status");banner.setAttribute("aria-live","polite");banner.style.cssText="display:none;max-width:620px;margin:-10px auto 12px;padding:10px 14px;border-radius:12px;font:600 12px system-ui;box-shadow:0 2px 10px #0000000a";
 const top=document.querySelector(".top");if(top)top.insertAdjacentElement("afterend",banner);
 let worker=null,waiting=false;
 function show(message,action){banner.textContent=message;banner.style.display="block";banner.style.background="#fff4dc";banner.style.color="#6b4a0c";if(action){const btn=document.createElement("button");btn.textContent="Aggiorna";btn.style.cssText="margin-left:10px;border-radius:8px;background:#314be7;color:white;padding:7px 10px;font-weight:700";btn.onclick=()=>{if(worker?.waiting)worker.waiting.postMessage({type:"SKIP_WAITING"});else location.reload()};banner.appendChild(btn)}}
 function online(){if(waiting)return;if(!navigator.onLine)show("Modalità offline: lo scout continua a salvare i dati su questo dispositivo.");else banner.style.display="none"}
 window.addEventListener("online",online);window.addEventListener("offline",online);online();
 if("serviceWorker"in navigator){navigator.serviceWorker.ready.then(reg=>{worker=reg;function check(){if(reg.waiting&&navigator.serviceWorker.controller){waiting=true;show("Nuova versione di Volley Scout disponibile. I dati locali rimangono sul dispositivo.",true)}}check();reg.addEventListener("updatefound",()=>{const w=reg.installing;if(w)w.addEventListener("statechange",()=>{if(w.state==="installed")check()})})}).catch(()=>{});let refreshing=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(waiting&&!refreshing){refreshing=true;location.reload()}})}
})();
