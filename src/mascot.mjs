// Frame order: base 0..5, wave 6..9, playful pick/flick 10..13.
export function mascotPose(action, elapsed) {
  const sequences = {
    blink: [[1,120],[0,100],[1,100],[0,120]],
    wave: [[6,140],[7,120],[8,120],[7,120],[8,120],[7,120],[8,120],[9,160],[0,140]],
    apple: [[22,180],[23,180],[24,180],[25,450],[26,500],[25,260],[26,400],[27,180],[26,380],[28,220],[29,800],[28,220],[30,180],[31,200],[32,180],[33,260],[32,180],[33,260],[32,180],[33,400],[34,200],[35,200],[36,220],[37,300],[36,220],[37,300],[36,220],[37,1500],[36,200],[37,500],[22,220],[0,300]],
    mischief: [[38,200],[39,180],[40,180],[41,220],[42,300],[43,240],[44,300],[43,220],[44,300],[45,240],[44,280],[45,200],[46,240],[47,400],[48,1000],[49,900],[48,450],[50,250],[51,200],[52,160],[53,300],[38,200],[0,400]],
  };
  const sequence=sequences[action] ?? [];
  let boundary=0;
  for(const [frame,duration] of sequence){boundary+=duration;if(elapsed<boundary)return {frame,done:false,flick:action==='mischief'&&frame===52};}
  return {frame:0,done:true,flick:false};
}

export function installMascot(button, frames, win = window) {
  if (!button) return () => {};
  const image=button.querySelector('img');
  // Decode frames once before idle playback, not at every visible frame switch.
  const decoded=frames.map(src=>{const img=new win.Image();img.src=src;return img.decode?.().catch(()=>{});});
  let ready=false,disposed=false;
  Promise.all(decoded).then(()=>{if(!disposed)ready=true;});
  let ratio=.38, gesture=null, suppress=false, tick=0, timer, snapTimer;
  let action=null, started=0, nextAction=win.performance.now()+5000, nextBlink=win.performance.now()+2600, flicked=false;
  const particles=new Set();
  function clearParticles(){for(const p of particles){win.clearTimeout(p.timeout);p.animation.cancel();p.node.remove();}particles.clear();}
  function flick(){
    const node=win.document.createElement('i');node.className='dsh-mobile-mascot-speck';node.setAttribute('aria-hidden','true');
    const box=button.getBoundingClientRect();
    node.style.left=`${box.left+box.width*.72}px`;node.style.top=`${box.top+box.height*.46}px`;
    win.document.body.append(node);
    const animation=node.animate([{transform:'translate(0,0)',opacity:1},{transform:'translate(32px,-22px)',opacity:1,offset:.17},{transform:`translate(78px,${height()+120}px) rotate(380deg)`,opacity:0}],{duration:1300,easing:'cubic-bezier(.35,0,.8,.5)'});
    const entry={node,animation};particles.add(entry);
    const cleanup=()=>{win.clearTimeout(entry.timeout);node.remove();particles.delete(entry);};
    animation.onfinish=cleanup;
    entry.timeout=win.setTimeout(()=>{animation.cancel();cleanup();},1400);
  }
  const reduced=win.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  const height=()=>win.visualViewport?.height ?? win.innerHeight;
  try { const stored=Number(win.localStorage.getItem('dsh-mobile-mascot-y')); if(stored>0&&stored<1)ratio=stored; } catch {}
  function place(){if(!gesture){button.style.top=`${clamp(ratio*height(),16,Math.max(16,height()-112))}px`;button.style.left='-12px';}}
  function animate(){
    tick++;
    const now=win.performance.now();
    if(gesture?.drag){image.src=frames[reduced.matches ? 3 : 3+(Math.floor(tick/2)%3)];return;}
    if(!ready||reduced.matches||win.document.hidden||gesture){action=null;delete button.dataset.action;clearParticles();image.src=frames[0];return;}
    if(!action&&now>=nextAction){const choice=Math.random();action=choice<.25?'mischief':choice<.60?'apple':'wave';started=now;flicked=false;}
    if(!action&&now>=nextBlink){action='blink';started=now;nextBlink=now+3500+Math.random()*3500;}
    if(action){
      const pose=mascotPose(action,now-started);
      button.dataset.pose=String(pose.frame);button.dataset.action=action;image.src=frames[pose.frame]??frames[0];
      if(pose.flick&&!flicked){flicked=true;flick();}
      if(pose.done){if(action!=='blink')nextAction=now+14000+Math.random()*18000;action=null;delete button.dataset.action;}
    }else image.src=frames[0];
  }
  function down(e){
    if(!e.isPrimary||e.button!==0)return;
    if(gesture)return;
    suppress=false;action=null;delete button.dataset.action;clearParticles();image.src=frames[0];nextAction=win.performance.now()+12000;
    const rect=button.getBoundingClientRect();
    const parent=button.offsetParent?.getBoundingClientRect() ?? {left:0,top:0};
    gesture={id:e.pointerId,x:e.clientX,y:e.clientY,left:rect.left-parent.left,top:rect.top-parent.top,drag:false};
    button.setPointerCapture(e.pointerId);
  }
  function move(e){
    if(!gesture||gesture.id!==e.pointerId)return;
    const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;
    if(!gesture.drag&&Math.hypot(dx,dy)<8)return;
    gesture.drag=true;suppress=true;
    image.src=frames[3];
    button.dataset.dragging='';
    button.style.left=`${clamp(gesture.left+dx,0,Math.max(0,win.innerWidth-96))}px`;
    button.style.top=`${clamp(gesture.top+dy,12,Math.max(12,height()-112))}px`;
    e.preventDefault();
  }
  function end(e){
    if(!gesture||gesture.id!==e.pointerId)return;
    const dragged=gesture.drag;
    if(dragged){ratio=clamp(parseFloat(button.style.top)/height(),.02,.95);try{win.localStorage.setItem('dsh-mobile-mascot-y',String(ratio));}catch{}}
    gesture=null;delete button.dataset.dragging;
    if(button.hasPointerCapture(e.pointerId))button.releasePointerCapture(e.pointerId);
    image.src=frames[0];place();
    if(dragged){button.dataset.snapping='';win.clearTimeout(snapTimer);snapTimer=win.setTimeout(()=>{delete button.dataset.snapping;},240);}
  }
  function click(e){if(e.detail===0)return;if(suppress){e.preventDefault();e.stopImmediatePropagation();suppress=false;}}
  function cancel(e){end(e);suppress=true;}
  function stopIdle(){action=null;delete button.dataset.action;clearParticles();if(!gesture?.drag)image.src=frames[0];}
  function preferenceChanged(){if(reduced.matches)stopIdle();}
  function visibilityChanged(){if(win.document.hidden)stopIdle();}
  reduced.addEventListener('change',preferenceChanged);
  win.document.addEventListener('visibilitychange',visibilityChanged);
  button.addEventListener('pointerdown',down);
  button.addEventListener('pointermove',move);
  button.addEventListener('pointerup',end);
  button.addEventListener('pointercancel',cancel);
  button.addEventListener('lostpointercapture',end);
  button.addEventListener('click',click,true);
  win.addEventListener('resize',place);win.visualViewport?.addEventListener('resize',place);
  place();timer=win.setInterval(animate,60);
  return ()=>{disposed=true;reduced.removeEventListener('change',preferenceChanged);win.document.removeEventListener('visibilitychange',visibilityChanged);clearParticles();win.clearInterval(timer);win.clearTimeout(snapTimer);button.removeEventListener('pointerdown',down);button.removeEventListener('pointermove',move);button.removeEventListener('pointerup',end);button.removeEventListener('pointercancel',cancel);button.removeEventListener('lostpointercapture',end);button.removeEventListener('click',click,true);win.removeEventListener('resize',place);win.visualViewport?.removeEventListener('resize',place);};
}
