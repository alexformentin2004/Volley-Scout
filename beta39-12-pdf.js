/* Beta 39.12 — Premium PDF, A4, fully offline. Uses shared reportSections. */
(function(){
"use strict";
function pagesFor(m,filter){
 const W=595,H=842,L=43,R=552,usable=R-L,top=714,bottom=59;
 const navy=[.09,.17,.35],blue=[.18,.32,.76],green=[.08,.60,.45],muted=[.40,.47,.59],light=[.94,.96,.99],stripe=[.976,.982,.995],white=[1,1,1];
 const pages=[];let ops=[],y=top,page=0;
 const rgb=c=>c.join(" ")+" rg";
 function rect(x,base,w,h,c){ops.push(rgb(c),x+" "+base+" "+w+" "+h+" re f")}
 function line(x1,y1,x2,y2,c=light){ops.push(c.join(" ")+" RG","0.6 w",x1+" "+y1+" m "+x2+" "+y2+" l S")}
 function text(v,x,base,size=9,bold=false,c=navy){
  ops.push(rgb(c),"BT /"+(bold?"F2":"F1")+" "+size+" Tf 1 0 0 1 "+x+" "+base+" Tm ("+b32PdfEsc(v)+") Tj ET");
 }
 function width(s,size,bold=false){return b32PdfText(s).length*size*(bold?.56:.51)}
 function wrap(v,max,size=9,bold=false){
  const out=[];let row="";
  for(let word of b32PdfText(v).replace(/\s+/g," ").trim().split(" ")){
   if(!word)continue;
   while(width(word,size,bold)>max){
    if(row){out.push(row);row=""}
    let n=1;while(n<word.length&&width(word.slice(0,n+1),size,bold)<=max)n++;
    out.push(word.slice(0,n));word=word.slice(n);
   }
   if(!word)continue;
   if(row&&width(row+" "+word,size,bold)>max){out.push(row);row=word}else row=row?row+" "+word:word;
  }
  if(row)out.push(row);return out.length?out:[""];
 }
 function start(){
  page++;ops=[];rect(0,H-10,W,10,blue);rect(0,746,W,86,navy);rect(L,763,5,52,green);
  text("VOLLEY SCOUT",L+17,803,20,true,white);
  text("PERFORMANCE REPORT  /  BETA 39.12",L+18,786,8,true,[.72,.83,1]);
  const name=(typeof team==="function"?team(m.teamId)?.name:null)||"Squadra";
  const title=wrap(name+" vs "+(m.opponent||""),usable-28,11,true);
  text(title[0],L+18,765,11,true,white);
  rect(L,724,usable,24,light);
  const date=new Date(m.createdAt||Date.now());
  const dateLabel=Number.isFinite(date.getTime())?date.toLocaleDateString("it-IT"):"Data non disponibile";
  text((filter==null?"PARTITA COMPLETA":"SET "+filter)+"    /    "+dateLabel,L+9,733,8,true,blue);
  y=706;
 }
 function finish(){if(ops.length)pages.push(ops);ops=[]}
 function next(){finish();start()}
 function ensure(h){if(y-h<bottom)next()}
 function heading(name,n,continuation=false){
  ensure(40);rect(L,y-29,usable,30,light);rect(L,y-29,4,30,blue);
  const label=String(n).padStart(2,"0")+"   "+String(name).toUpperCase()+(continuation?"  /  CONTINUA":"");
  text(wrap(label,usable-26,10,true)[0],L+13,y-19,10,true,blue);y-=42;
 }
 function para(value){
  for(const t of wrap(value,usable-15,8.6)){ensure(15);text(t,L+6,y-10,8.6,false,muted);y-=14}
 }
 function table(name,rows,n){
  heading(name,n);
  if(!rows||rows.length<2){para("Nessun dato registrato per questa sezione.");y-=10;return}
  const heads=rows[0].map(String),cols=heads.length;
  if(cols<=5){
   const cw=usable/cols,fs=cols===5?7:8;
   function header(){
    ensure(36);rect(L,y-30,usable,32,navy);
    heads.forEach((h,j)=>wrap(h,cw-12,fs,true).slice(0,2).forEach((t,k)=>text(t,L+6+j*cw,y-12-k*10,fs,true,white)));
    y-=34;
   }
   header();
   rows.slice(1).forEach((row,i)=>{
    const cells=heads.map((_,j)=>wrap(row[j]??"",cw-12,fs,j===0));
    const height=Math.max(28,...cells.map(lines=>lines.length*(fs+3)+10));
    if(y-height<bottom){next();heading(name,n,true);header()}
    if(i%2===0)rect(L,y-height+3,usable,height,stripe);
    cells.forEach((lines,j)=>lines.forEach((t,k)=>text(t,L+6+j*cw,y-10-k*(fs+3),fs,j===0)));
    y-=height;
   });
  }else{
   rows.slice(1).forEach((row,i)=>{
    const label=wrap(row[0]??("Voce "+(i+1)),usable-22,9.2,true);
    const fields=heads.slice(1).map((h,j)=>({h:String(h),v:String(row[j+1]??"")})).filter(x=>x.v!=="");
    const pieces=[];
    fields.forEach(({h,v})=>wrap(h+": "+v,usable-33,8).forEach(t=>pieces.push(t)));
    let cursor=0,first=true;
    while(first||cursor<pieces.length){
     const headHeight=first?label.length*13+9:0;
     if(y-headHeight-24<bottom){next();heading(name,n,true)}
     const available=Math.max(1,Math.floor((y-bottom-headHeight-16)/12));
     const take=Math.min(available,pieces.length-cursor);
     const height=headHeight+Math.max(1,take)*12+14;
     if(y-height<bottom){next();heading(name,n,true);continue}
     rect(L,y-height+5,usable,height+1,i%2===0?stripe:light);
     let cy=y-13;
     if(first){label.forEach(t=>{text(t,L+10,cy,9.2,true,blue);cy-=13});first=false}
     for(let j=0;j<take;j++){text(pieces[cursor+j],L+18,cy,8,false,navy);cy-=12}
     cursor+=take;y-=height+5;
    }
   });
  }
  y-=13;
 }
 start();heading("Sintesi e metodologia",0);
 para("Report basato esclusivamente sulle azioni registrate nello scout.");
 para("Percentuali calcolate sui tentativi osservati. I dati assenti non vengono stimati.");
 y-=13;
 reportSections(m,filter).forEach(([name,rows],i)=>table(name,rows,i+1));
 finish();
 pages.forEach((p,i)=>{
  p.push(muted.join(" ")+" RG","0.6 w",L+" 45 m "+R+" 45 l S");
  p.push(rgb(muted),"BT /F1 8 Tf 1 0 0 1 "+L+" 28 Tm (VOLLEY SCOUT  /  ANALISI TECNICA) Tj ET");
  p.push(rgb(blue),"BT /F2 8 Tf 1 0 0 1 478 28 Tm (PAG. "+(i+1)+" / "+pages.length+") Tj ET");
 });
 return pages;
}
b32PdfPages=pagesFor;
})();
