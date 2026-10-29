const sharp=require(process.env.SHARP_MODULE||'sharp');
(async()=>{
 const names=['peek','blink','wave','drag1','drag2','drag3'];
 // Service output already has alpha. Preserve it; never color-key blue hair.
 for(let i=0;i<6;i++){
  await sharp('assets/girl-sprites.png').extract({left:i%3*512,top:Math.floor(i/3)*512,width:512,height:512})
   .resize(160,160,{kernel:'nearest'}).png().toFile(`assets/girl-${names[i]}.png`);
 }
})().catch(e=>{console.error(e);process.exitCode=1});
