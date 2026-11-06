/* Beta 39.4 — redesigned paginated PDF report; same reportSections as Excel. */
(function(){
"use strict";
function pdfPages(m,filter){
 const sections=reportSections(m,filter),pages=[];let ops=[],y=0;
 const ink=[0.12,0.18,0.31],blue=[0.18,0.29,0.68],pale=[0.93,0.95,0.99];
 function rgb(c){return c.join(" ")+" rg"}
 function rect(x,top,w,h,color){ops.push(rgb(color),x+" "+(top-h)+" "+w+" "+h+" re f")}
 function text(t,x,yy,size=9,bold=false,color=ink){
  ops.push(rgb(color),"BT /"+(bold?"F2":"F1")+" "+size+" Tf 1 0 0 1 "+x+" "+yy+" Tm ("+b32PdfEsc(t)+") Tj ET");
 }
 function width(t,size,bold){return b32PdfText(t).length*size*(bold?.57:.51)}
 function wrap(v,max,size=9,bold=false){
  const words=b32PdfText(v).replace(/\s+/g," ").trim().split(" "),out=[];let line="";
  for(let word of words){
   if(!word)continue;
   while(width(word,size,bold)>max){if(line){out.push(line);line=""}let cut=1;while(cut<word.length&&width(word.slice(0,cut+1),size,bold)<=max)cut++;out.push(word.slice(0,cut));word=word.slice(cut)}
   if(!word)continue;
   if(line&&width(line+" "+word,size,bold)>max){out.push(line);line=word}else line=line?line+" "+word:word;
  }
  if(line)out.push(line);return out.length?out:[""];
 }
 function start(){
  ops=[];rect(0,842,595,9,blue);rect(0,833,595,86,pale);
  text("VOLLEY SCOUT",42,801,17,true,blue);
  text("REPORT TECNICO  /  BETA 39.4",42,783,9,true);
  const teamName=typeof team==="function"?team(m.teamId)?.name:null;
  text(wrap((teamName||"Squadra")+" vs "+(m.opponent||""),505,11,true)[0],42,764,11,true);
  text((filter==null?"Partita completa":"Set "+filter)+"   |   "+new Date(m.createdAt||Date.now()).toLocaleDateString("it-IT"),42,748,9);
  y=722;
 }
 function finish(){if(ops.length)pages.push(ops);ops=[]}
 function space(h){if(y-h<56){finish();start()}}
 function sectionTitle(name,index){
  space(44);rect(42,y+7,511,27,pale);rect(42,y+7,4,27,blue);
  text(String(index).padStart(2,"0")+"  "+wrap(name.toUpperCase(),470,11,true)[0],54,y-11,11,true,blue);y-=40;
 }
 function paragraph(value,x=52,max=490,size=8.5,bold=false){
  const lines=wrap(value,max,size,bold);for(const part of lines){space(size+5);text(part,x,y,size,bold);y-=size+5}
 }
 start();
 sectionTitle("Riepilogo e metodo",0);
 paragraph("Report basato sulle azioni registrate. I valori mancanti non vengono stimati.");
 paragraph("Le percentuali sono calcolate sui tentativi osservati; il simbolo - indica assenza di dati.");
 y-=10;
 sections.forEach(([name,rows],index)=>{
  sectionTitle(name,index+1);
  if(!rows||rows.length<2){paragraph("Nessuna azione disponibile per questa sezione.");y-=8;return}
  const heads=rows[0];
  const narrow=heads.length<=5;
  if(narrow){
   const cols=heads.length,cellW=511/cols,fs=cols>=5?7.1:8;
   const drawHeader=()=>{space(35);rect(42,y+8,511,29,pale);heads.forEach((h,j)=>text(wrap(h,cellW-12,fs,true)[0],48+j*cellW,y-9,fs,true,blue));y-=32};
   drawHeader();
   rows.slice(1).forEach((row,i)=>{
    const formatted=row.map((v,j)=>wrap(v,cellW-12,fs,j===0));
    const height=Math.max(25,...formatted.map(lines=>lines.length*(fs+3)+9));
    if(y-height<56){finish();start();sectionTitle(name+" (continua)",index+1);drawHeader()}
    if(i%2===0)rect(42,y+7,511,height,[.975,.982,.995]);
    formatted.forEach((lines,j)=>lines.forEach((line,k)=>text(line,48+j*cellW,y-8-k*(fs+3),fs,j===0)));
    y-=height;
   });
  }else{
   rows.slice(1).forEach((row,i)=>{
    const pairs=row.slice(1).map((v,j)=>[heads[j+1]||"Campo "+(j+2),v]).filter(x=>x[1]!==null&&x[1]!==undefined&&x[1]!=="");
    const label=String(row[0]??"Riga "+(i+1));
    const prepared=wrap(label,485,9.5,true);
    const values=pairs.flatMap(([k,v])=>wrap(String(k)+": "+String(v),470,8).map(s=>s));
    const required=prepared.length*14+values.length*12+18;
    if(required<570){space(required)}else space(55);
    rect(42,y+7,511,Math.min(required+2,Math.max(25,y-56)),[.975,.982,.995]);
    for(const l of prepared){space(15);text(l,50,y,9.5,true,blue);y-=14}
    for(const l of values){space(13);text(l,58,y,8);y-=12}
    y-=12;
   });
  }
  y-=14;
 });
 finish();
 pages.forEach((p,i)=>{p.push(rgb([.45,.51,.63]),"0.5 w 42 42 m 553 42 l S");p.push("BT /F1 8 Tf 1 0 0 1 42 27 Tm (Volley Scout - Report tecnico) Tj ET");p.push("BT /F1 8 Tf 1 0 0 1 485 27 Tm (Pagina "+(i+1)+" / "+pages.length+") Tj ET")});
 return pages;
}
b32PdfPages=pdfPages;
})();
