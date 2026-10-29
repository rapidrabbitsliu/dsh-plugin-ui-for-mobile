// Development-only asset processing; requires sharp, not a runtime dependency.
const sharp = require(process.env.SHARP_MODULE || 'sharp');
(async () => {
 const input = 'assets/whale-sprites.png';
 const metadata = await sharp(input).metadata();
 console.log('source', {width:metadata.width,height:metadata.height,hasAlpha:metadata.hasAlpha});
 const names = ['idle','happy','wave','sleep'];
 for (let i=0;i<4;i++) {
   const cell = await sharp(input).extract({left:(i%2)*512,top:Math.floor(i/2)*512,width:512,height:512}).png().toBuffer();
   await sharp(cell).trim().resize({width:192,kernel:'nearest'}).png().toFile(`assets/whale-${names[i]}.png`);
 }
})().catch(error => { console.error(error); process.exitCode=1; });
