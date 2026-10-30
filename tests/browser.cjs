const {createRequire}=require('node:module');
const {readFileSync}=require('node:fs');
const assert=require('node:assert/strict');
const req=createRequire(__filename);
const {chromium}=req(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH || undefined});
try {
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
 await page.setContent(`<meta name="viewport" content="width=device-width,initial-scale=1"><style>html,body,#root{height:100%;margin:0}#frame{height:100%;display:grid;grid-template-columns:56px minmax(0,1fr) 0;grid-template-rows:minmax(0,1fr) auto;overflow:hidden;position:relative}#sidebar{background:#eee;overflow:hidden}#center{min-width:0;display:flex;flex-direction:column;overflow:hidden}#messages{flex:1;min-height:0;overflow:auto}#right{position:relative}[data-shell-bottom]{grid-column:1/-1}[data-shell-overlay]{position:absolute;inset:0;pointer-events:none;z-index:20}#editor{min-height:40px;font-size:14px}#sidebar>div{height:100%;box-sizing:border-box}pre{white-space:pre;overflow:auto}</style><div id="root"><div id="frame" data-sidebar-collapsed="true"><div id="sidebar"><div><button id="toggle">导航</button><input placeholder="搜索"></div></div><div id="center"><div id="messages"><pre>${'long_code_'.repeat(100)}</pre>聊天记录</div><div data-composer-card><div><div><div id="editor" contenteditable="true" role="textbox">输入内容</div></div></div><button>发送</button></div><div data-composer-dock><span data-composer-stat="activity"><button aria-label="5 轮 95 步 · 51 tok/s"><svg></svg><span>5 轮 95 步<span>·</span>51 tok/s</span></button></span><span data-composer-stat="usage"><button><svg></svg><span>7.3M tok<span>·</span>缓存命中 32%</span></button></span><span>41%</span></div></div><div id="right" data-rightbar-col></div><div data-shell-bottom></div><div data-shell-overlay></div></div></div>`);
 await page.evaluate(()=>{
   const fake=new EventTarget(); Object.assign(fake,{height:844,offsetTop:0,scale:1});
   Object.defineProperty(window,'visualViewport',{value:fake,configurable:true});
   let render=()=>{}, effects=[], cleanups=[];
    const subscriptions=new Set();
    const fakeReact={
      useSyncExternalStore(subscribe,get){if(!subscriptions.has(subscribe)){subscriptions.add(subscribe);subscribe(()=>queueMicrotask(()=>render()));}return get();},
      useRef(){return {current:null};},useEffect(fn){effects.push(fn);},
      createElement(tag,props,...children){const el=document.createElement(tag);for(const [key,value] of Object.entries(props??{})){if(key==='ref'){value.current=el;}else if(key==='onClick')el.onclick=value;else if(key==='onPointerDown')el.onpointerdown=value;else if(key==='onMouseDown')el.onmousedown=value;else if(key==='className')el.className=value;else el.setAttribute(key,value);}for(const child of children)if(child)el.append(child);return el;},
    };
    window.__ModuleLoader__={load(module){window.mobile=module.factory(()=>fakeReact);}};
   window.disposers=[];
   const ctx={layout:{toggleSidebar(){const el=document.querySelector('#frame');el.toggleAttribute('data-sidebar-collapsed');}},locale:{register(){return ()=>{};}},effect(fn){const stop=fn();if(stop)window.disposers.push(stop);},slots:{inject(name,setup){return setup();},register(options,Component){if(options.name==='conversation.input.right'){
      const actions={captureInsertion(){return {selection:window.getSelection().getRangeAt(0).cloneRange()};},insertText(text,span){const r=span.selection;r.deleteContents();const node=document.createTextNode(text);r.insertNode(node);r.setStartAfter(node);r.collapse(true);const s=window.getSelection();s.removeAllRanges();s.addRange(r);return true;},persistDraft(){window.newlinePersisted=true;}};
      const node=Component({t:key=>key,inputActions:actions});document.querySelector('[data-composer-card]').append(node);return ()=>node.remove();
    }render=()=>{for(const stop of cleanups)stop();cleanups=[];effects=[];const host=document.querySelector('[data-shell-overlay]');host.replaceChildren();const node=Component({t:key=>key});if(node)host.append(node);for(const effect of effects){const stop=effect();if(stop)cleanups.push(stop);}};render();return ()=>{for(const stop of cleanups)stop();cleanups=[];render=()=>{};document.querySelector('[data-shell-overlay]').replaceChildren();};}}};
   window.mobileContext=ctx;
   document.querySelector('#toggle').onclick=()=>ctx.layout.toggleSidebar();
 });
 await page.evaluate(()=>{
    const header=document.createElement('header');header.innerHTML='<div data-conversation-header-leading></div><div><div><nav>标题</nav></div><div><div><button aria-haspopup="tree" aria-expanded="false" aria-label="3 个子智能体"><span><i>•</i></span><span>3 个子智能体</span><svg></svg></button></div><div><button aria-expanded="false" aria-label="6 个后台任务"><span>6 个后台任务</span><svg></svg></button></div></div><div data-conversation-header-corner><button aria-label="更多">⋯</button></div></div>';
    header.insertAdjacentHTML('beforeend','<div><div role="tablist" data-conversation-tabs><button>聊天</button></div><span><button aria-haspopup="menu" aria-expanded="false" aria-label="更多会话视图">⋯</button></span></div>');
     header.querySelector('[data-conversation-header-corner]').insertAdjacentHTML('beforebegin','<div data-open-target="directory"><button aria-label="在资源管理器中打开">📁</button><button aria-label="打开方式">⌄</button></div>');
     const row=header.children[1],cluster=row.children[0];
     cluster.append(row.children[1]);
     cluster.querySelector('nav').innerHTML='<span><button title="移动端体验独立插件可行性评估">移动端体验独立插件可行性评估</button></span>';
     header.querySelector('[data-conversation-header-corner] button').setAttribute('aria-label','展开右侧栏');
     const hostStyle=document.createElement('style');hostStyle.textContent='header{display:grid;grid-template-columns:auto minmax(0,1fr);padding:10px 28px 0 20px}header>div:nth-child(2){display:flex;grid-column:2;align-items:center;container-type:inline-size}header>div:nth-child(2)>div:first-child{display:flex;flex:1;min-width:0;align-items:center}header nav{display:flex;min-width:0;white-space:nowrap}header nav+div{display:flex;flex:none;gap:8px}[data-conversation-header-corner]{display:flex;margin-left:8px;margin-right:-16px}';document.head.append(hostStyle);
     document.querySelector('#center').prepend(header);
    for(const b of header.querySelectorAll('button[aria-expanded]'))b.onclick=()=>b.setAttribute('aria-expanded',String(b.getAttribute('aria-expanded')!=='true'));
  });
  await page.addScriptTag({content:readFileSync('client.js','utf8')});
 await page.clock.install();
 await page.evaluate(()=>window.mobile.apply(window.mobileContext));
 await page.waitForFunction(()=>document.querySelector('[data-dsh-mobile-stat-label]'));
 assert.equal(await page.locator('[data-composer-stat="activity"] [data-dsh-mobile-stat-label]').getAttribute('data-dsh-mobile-stat-label'),'5r 95s · 51/s');
 await page.locator('[data-composer-stat="activity"] [data-dsh-mobile-stat-label]').evaluate(e=>{e.firstChild.nodeValue='6 轮 96 步';});
 await page.waitForFunction(()=>document.querySelector('[data-composer-stat="activity"] [data-dsh-mobile-stat-label]').getAttribute('data-dsh-mobile-stat-label')==='6r 96s · 51/s');
 assert.equal(await page.locator('[data-open-target="directory"]').isVisible(),false);
  assert.equal(await page.getByRole('button',{name:'更多会话视图',exact:true}).count(),0);
  assert.equal(await page.locator('[data-conversation-header-corner] button').isVisible(),true);
  const cornerBox=await page.locator('[data-conversation-header-corner]').boundingBox();
  assert.ok(cornerBox.x+cornerBox.width<=390-4);
  assert.equal(await page.locator('[data-conversation-header-corner]').evaluate(e=>getComputedStyle(e).marginRight),'0px');
  const agents=page.locator('[data-dsh-mobile-header-counter="agents"]');
  const jobs=page.locator('[data-dsh-mobile-header-counter="jobs"]');
  assert.equal(await agents.locator('[data-dsh-mobile-header-count]').getAttribute('data-dsh-mobile-header-count'),'3');
  assert.equal(await jobs.locator('[data-dsh-mobile-header-count]').getAttribute('data-dsh-mobile-header-count'),'6');
  assert.equal(await agents.locator('svg').evaluate(e=>getComputedStyle(e).display),'none');
  assert.equal(await agents.locator('[data-dsh-mobile-header-count]').evaluate(e=>getComputedStyle(e).fontSize),'0px');
  assert.ok((await jobs.boundingBox()).width<65);
  await agents.click();assert.equal(await agents.getAttribute('aria-expanded'),'true');
  assert.equal(await agents.getAttribute('aria-label'),'3 个子智能体');
  await jobs.locator('[data-dsh-mobile-header-count]').evaluate(e=>{e.textContent='12 个后台任务';});
  await page.waitForFunction(()=>document.querySelector('[data-dsh-mobile-header-counter="jobs"] [data-dsh-mobile-header-count]').getAttribute('data-dsh-mobile-header-count')==='12');
  const state=()=>page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,center:document.querySelector('#center').getBoundingClientRect().toJSON(),root:document.querySelector('#root').getBoundingClientRect().toJSON(),font:getComputedStyle(document.querySelector('#editor')).fontSize,active:document.documentElement.hasAttribute('data-dsh-mobile')}));
 let closed=await state(); assert.equal(closed.active,true);assert.equal(closed.font,'16px');assert.ok(closed.scroll<=390);assert.equal(closed.center.width,390);assert.equal(closed.center.x,0);
 assert.equal(await page.locator('#sidebar').isVisible(),false);
 const mascot=page.locator('.dsh-mobile-whale');
  const start=await mascot.boundingBox();
  await page.mouse.move(start.x+40,start.y+30);await page.mouse.down();
  await page.mouse.move(160,start.y+150,{steps:8});
  assert.equal(await mascot.getAttribute('data-dragging'),'');
  assert.equal(await mascot.evaluate(e=>e.getBoundingClientRect().width),96);
  await page.screenshot({path:'test-mascot-drag.png'});
  await page.mouse.up();
  await page.waitForFunction(()=>Math.abs(document.querySelector('.dsh-mobile-whale').getBoundingClientRect().x+12)<1);
  assert.equal(await page.locator('#frame').getAttribute('data-sidebar-collapsed'),'true');
  assert.ok((await mascot.boundingBox()).y>start.y+80);
  await page.screenshot({path:'test-mascot-peek.png'});
  await page.evaluate(()=>{Math.random=()=>0;});
  for(let i=0;i<400 && await page.locator('.dsh-mobile-mascot-speck').count()===0;i++)await page.clock.runFor(60);
  assert.equal(await page.locator('.dsh-mobile-mascot-speck').count(),1);
  assert.equal(await page.locator('.dsh-mobile-mascot-speck').evaluate(e=>getComputedStyle(e).pointerEvents),'none');
  await page.clock.runFor(1600);
  assert.equal(await page.locator('.dsh-mobile-mascot-speck').count(),0);
  await page.evaluate(()=>{Math.random=()=>.4;});
  for(let i=0;i<350 && await mascot.getAttribute('data-action')!=='apple';i++)await page.clock.runFor(60);
  assert.equal(await mascot.getAttribute('data-action'),'apple');
  for(let i=0;i<80 && await mascot.getAttribute('data-pose')!=='27';i++)await page.clock.runFor(60);
  assert.equal(await mascot.getAttribute('data-pose'),'27');
  await page.screenshot({path:'test-mascot-apple.png'});
  for(let i=0;i<180 && await mascot.getAttribute('data-pose')!=='37';i++)await page.clock.runFor(60);
  assert.equal(await mascot.getAttribute('data-pose'),'37');
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.clock.runFor(120);
  assert.equal(await mascot.getAttribute('data-action'),null);
  await page.emulateMedia({reducedMotion:'no-preference'});
  await page.clock.resume();
  await mascot.click();await page.waitForFunction(()=>document.querySelector('#center').inert);
 let opened=await state();assert.equal(opened.center.width,closed.center.width);assert.equal(opened.center.x,closed.center.x);assert.equal(await page.locator('[data-shell-bottom]').evaluate(e=>e.inert),true);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#center').inert);
 await page.evaluate(()=>{visualViewport.height=450;visualViewport.offsetTop=20;visualViewport.dispatchEvent(new Event('resize'));});
 await page.waitForFunction(()=>document.querySelector('#root').getBoundingClientRect().height===450);
 const keyboard=await state();assert.equal(keyboard.root.y,20);assert.equal(keyboard.root.height,450);
 assert.ok(await page.locator('#editor').evaluate(e=>e.getBoundingClientRect().bottom)<=470);
 await page.screenshot({path:'test-mobile-keyboard.png'});
 await page.evaluate(()=>{
   const panel=document.createElement('div'); panel.dataset.shortcutModal='settings'; panel.setAttribute('role','dialog');
   panel.style.cssText='display:flex;width:800px;height:700px;max-width:calc(100vw - 48px);background:white';
   panel.innerHTML='<nav style="width:188px;display:flex;flex-direction:column"><div>设置</div><div style="display:flex;flex-direction:column">'+Array.from({length:12},(_,i)=>'<button>设置分类 '+i+'</button>').join('')+'</div></nav><div style="display:flex;flex-direction:column;flex:1;min-width:0"><div><div><button>操作</button></div><button aria-label="关闭">×</button></div><div style="flex:1;min-height:0">'+Array.from({length:30},(_,i)=>'<p>设置项目 '+i+' <input placeholder="设置输入"></p>').join('')+'</div></div>';
   // Host styling is normally stylesheet based rather than inline.
   panel.removeAttribute('style');
   for(const e of panel.querySelectorAll('[style]'))e.removeAttribute('style');
   document.body.append(panel);
 });
 const settings=page.locator('[data-shortcut-modal="settings"]');
 assert.equal((await settings.boundingBox()).width,390);
 assert.equal((await settings.boundingBox()).height,450);
 assert.equal((await settings.boundingBox()).y,20);
 assert.equal(await settings.locator('nav > :last-child').evaluate(e=>getComputedStyle(e).flexDirection),'row');
 assert.ok(await settings.locator('nav > :last-child').evaluate(e=>e.scrollWidth>e.clientWidth));
 assert.equal(await settings.locator('button[aria-label="关闭"]').evaluate(e=>e.getBoundingClientRect().height),44);
 await settings.evaluate(e=>e.remove());
 // Model the host keymap: successful submission clears the same editor.
  async function enterCase(mode, options={}) {
    return page.evaluate(async ({mode,options})=>{
      const e=document.querySelector('#editor');e.setAttribute('data-composer-input','');e.textContent='测试草稿';e.focus();
      const host=event=>{event.preventDefault();if(mode==='sent')e.textContent='';};
      e.addEventListener('keydown',host,{once:true});
      e.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true,...options}));
      await Promise.resolve();await Promise.resolve();
      return document.activeElement===e;
    },{mode,options});
  }
  assert.equal(await enterCase('sent'),false);
  assert.equal(await enterCase('blocked'),true);
  await page.evaluate(()=>{const e=document.querySelector('#editor');e.textContent='异步发送';e.focus();e.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));});
  await page.evaluate(()=>{document.querySelector('#editor').textContent='';});
  await page.waitForFunction(()=>document.activeElement!==document.querySelector('#editor'));
  assert.equal(await enterCase('blocked'),true);
  assert.equal(await enterCase('completion'),true);
  assert.equal(await enterCase('sent',{shiftKey:true}),true);
  assert.equal(await enterCase('sent',{isComposing:true}),true);
  assert.equal(await enterCase('sent',{keyCode:229}),true);
  assert.equal(await enterCase('sent',{repeat:true}),true);
  await page.evaluate(()=>{document.querySelector('#editor').dispatchEvent(new CompositionEvent('compositionstart',{bubbles:true}));});
  assert.equal(await enterCase('sent'),true);
  await page.evaluate(()=>{document.querySelector('#editor').dispatchEvent(new CompositionEvent('compositionend',{bubbles:true}));});
  assert.equal(await enterCase('sent'),true);
  await page.clock.runFor(30);
  await page.evaluate(()=>{const e=document.querySelector('#editor');e.textContent='甲乙';e.focus();const r=document.createRange();r.setStart(e.firstChild,1);r.collapse(true);const s=getSelection();s.removeAllRanges();s.addRange(r);});
  assert.equal(await page.locator('.dsh-mobile-newline').isVisible(),true);
  await page.locator('.dsh-mobile-newline').dispatchEvent('pointerdown',{button:0,isPrimary:true,pointerType:'touch'});
  await page.locator('.dsh-mobile-newline').dispatchEvent('click',{detail:1});
  assert.equal(await page.locator('#editor').textContent(),'甲\n乙');
  assert.equal(await page.locator('#editor').evaluate(e=>document.activeElement===e),true);
  assert.equal(await page.evaluate(()=>window.newlinePersisted),true);
  // A phone's landscape width crosses 767px: only layout deactivates,
  // text inflation prevention must survive and protect the same message nodes.
  const messageNode=await page.locator('#messages').elementHandle();
  const fontBefore=await page.locator('#messages').evaluate(e=>getComputedStyle(e).fontSize);
  for(let rotation=0;rotation<2;rotation++) {
    await page.setViewportSize({width:844,height:390});
    await page.waitForFunction(()=>!document.documentElement.hasAttribute('data-dsh-mobile')&&document.documentElement.hasAttribute('data-dsh-mobile-text-sizing'));
    assert.equal(await page.locator('#messages').evaluate(e=>getComputedStyle(e).webkitTextSizeAdjust),'100%');
    assert.equal(await page.locator('#messages').evaluate(e=>getComputedStyle(e).fontSize),fontBefore);
    await page.setViewportSize({width:390,height:844});
    await page.waitForFunction(()=>document.documentElement.hasAttribute('data-dsh-mobile'));
    assert.equal(await page.locator('#messages').evaluate(e=>getComputedStyle(e).webkitTextSizeAdjust),'100%');
    assert.equal(await messageNode.evaluate(e=>e===document.querySelector('#messages')),true);
  }
  await page.setViewportSize({width:1280,height:900});await page.waitForFunction(()=>!document.documentElement.hasAttribute('data-dsh-mobile'));
  assert.equal(await page.locator('.dsh-mobile-newline').isVisible(),false);
  assert.equal(await enterCase('sent'),true);
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.documentElement.hasAttribute('data-dsh-mobile'));
 await page.evaluate(()=>{document.documentElement.style.setProperty('--unrelated-theme','kept');for(const stop of window.disposers.reverse())stop();});
 assert.equal(await page.locator('[data-dsh-mobile-style]').count(),0);
  assert.equal(await page.evaluate(()=>document.documentElement.hasAttribute('data-dsh-mobile-text-sizing')),false);
 assert.equal(await page.locator('[data-dsh-mobile-frame]').count(),0);
 assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--unrelated-theme')),'kept');
 assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--dsh-mobile-height')),'');
 console.log('PASS: horizontal containment, 16px editor, overlay geometry, Escape, simulated keyboard, desktop restore, dispose preserves unrelated styles');
} finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
