/* Beta 35.3 — role identification in player selection, without changing scouting logic */
(function(){
const roles=[
{test:/liber/i,key:"libero",short:"L",name:"Libero",glyph:"◈"},
{test:/palleggiat|setter/i,key:"palleggiatore",short:"P",name:"Palleggiatore",glyph:"✧"},
{test:/oppost/i,key:"opposto",short:"O",name:"Opposto",glyph:"◆"},
{test:/central/i,key:"centrale",short:"C",name:"Centrale",glyph:"▥"},
{test:/band|schiacciat|martello/i,key:"banda",short:"B",name:"Banda",glyph:"↗"}
];
function decoratePlayers(){
 if(typeof stage==="undefined"||stage!=="player"||typeof active!=="function")return;
 const m=active(),t=m&&team(m.teamId);if(!t)return;
 const zones=document.querySelectorAll('#content .court button.zone[data-player]');if(!zones.length)return;
 zones.forEach(btn=>{
  if(btn.querySelector(".vs-role-badge"))return;
  const p=t.players.find(x=>String(x.id)===btn.dataset.player);if(!p)return;
  let roleName="";
  if(typeof tacticalRoles!=="undefined"&&typeof tacticalPlayer==="function"){
   const tacticalRole=tacticalRoles.find(role=>tacticalPlayer(m,role)?.id===p.id);
   if(tacticalRole)roleName=tacticalRole;
  }
  if(!roleName)roleName=p.role||"";
  const role=roles.find(x=>x.test.test(roleName))||{key:"altro",short:"?",name:roleName||"Ruolo non assegnato",glyph:"•"};
  btn.classList.add("vs-player-zone","vs-role-"+role.key);
  const small=btn.querySelector("small");if(small)small.classList.add("vs-zone-label");
  const badge=document.createElement("span");badge.className="vs-role-badge";badge.textContent=role.glyph+" "+role.short;badge.title=role.name;badge.setAttribute("aria-label","Ruolo: "+role.name);
  const detail=document.createElement("span");detail.className="vs-role-name";detail.textContent=role.name;
  btn.appendChild(badge);btn.appendChild(detail);
  btn.setAttribute("aria-label","Zona "+(small?.textContent||"").replace(/[^0-9]/g,"")+", "+p.name+", numero "+p.number+", "+role.name);
 });
}
const prev=render;render=function(){prev();decoratePlayers()};decoratePlayers();
})();
