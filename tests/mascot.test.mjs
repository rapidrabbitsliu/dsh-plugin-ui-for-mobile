import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mascotPose} from '../src/mascot.mjs';
function timeline(action){const frames=[],changes=[];let last=-1,t=0;for(;t<20000;t+=10){const p=mascotPose(action,t);if(p.done)break;if(p.frame!==last){frames.push(p.frame);changes.push({frame:p.frame,time:t});last=p.frame;}}return {frames,changes,duration:t};}
test('apple has sixteen poses, extended chewing and exactly two bites',()=>{
 const {frames,duration}=timeline('apple');
 for(let i=22;i<=37;i++)assert.ok(frames.includes(i));
 assert.equal(frames.filter(f=>f===31).length,1);assert.equal(frames.filter(f=>f===35).length,1);
 assert.ok(duration>=10000&&duration<=12000);
 assert.ok(frames.indexOf(27)<frames.indexOf(29));
 assert.ok(frames.indexOf(31)<frames.indexOf(35));
});
test('wave progresses through rise, alternating wrist poses and return',()=>{
 assert.deepEqual([0,150,270,390,510,630,750,870,1030,1200].map(t=>mascotPose('wave',t).frame),[6,7,8,7,8,7,8,9,0,0]);
 assert.equal(mascotPose('wave',1200).done,true);
});
test('mischief has sixteen intermediate poses and one late flick window',()=>{
 const {frames,duration,changes}=timeline('mischief');
 for(let i=38;i<=53;i++)assert.ok(frames.includes(i));
 assert.ok(duration>=7000&&duration<=9000);
 assert.equal(frames.filter(f=>f===52).length,1);
 const flick=changes.find(c=>c.frame===52);
 assert.ok(flick.time>5000);assert.equal(mascotPose('mischief',flick.time).flick,true);
 assert.equal(mascotPose('mischief',duration).flick,false);
});
