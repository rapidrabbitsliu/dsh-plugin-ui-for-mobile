const sharp=require(process.env.SHARP_MODULE||'sharp');
(async()=>{
 for(const kind of ['apple','pick'])for(let i=0;i<16;i++){
  await sharp(`assets/${kind}-expanded.png`).extract({left:i%4*256,top:Math.floor(i/4)*256,width:256,height:256})
   .resize(138,138,{kernel:'nearest'}).extend({left:9,right:13,top:10,bottom:12,background:{r:0,g:0,b:0,alpha:0}})
   .png().toFile(`assets/girl-${kind}-smooth${i+1}.png`);
 }
})().catch(e=>{console.error(e);process.exitCode=1});
