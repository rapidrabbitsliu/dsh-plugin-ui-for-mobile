const sharp=require(process.env.SHARP_MODULE||'sharp');
(async()=>{
 const names=['wave1','wave2','wave3','wave4','pick1','pick2','pick3','pick4'];
 const meta=await sharp('assets/girl-actions.png').metadata();
 const width=meta.width/4,height=meta.height/2;
 for(let i=0;i<8;i++){
  await sharp('assets/girl-actions.png').extract({left:i%4*width,top:Math.floor(i/4)*height,width,height})
   .resize(120,160,{kernel:'nearest'}).extend({left:8,right:32,top:0,bottom:0,background:{r:0,g:0,b:0,alpha:0}}).png().toFile(`assets/girl-${names[i]}.png`);
 }
})().catch(e=>{console.error(e);process.exitCode=1});
