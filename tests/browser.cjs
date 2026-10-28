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
   window.__ModuleLoader__={load(module){window.mobile=module.factory(()=>({useSyncExternalStore(){},createElement(){}}));}};
   window.disposers=[];
   const ctx={layout:{toggleSidebar(){const el=document.querySelector('#frame');el.toggleAttribute('data-sidebar-collapsed');}},locale:{register(){return ()=>{};}},effect(fn){const stop=fn();if(stop)window.disposers.push(stop);},slots:{inject(){return ()=>{};}}};
   window.mobileContext=ctx;
   document.querySelector('#toggle').onclick=()=>ctx.layout.toggleSidebar();
 });
 await page.addScriptTag({content:readFileSync('client.js','utf8')});
 await page.evaluate(()=>window.mobile.apply(window.mobileContext));
 await page.waitForFunction(()=>document.querySelector('[data-dsh-mobile-stat-label]'));
 assert.equal(await page.locator('[data-composer-stat="activity"] [data-dsh-mobile-stat-label]').getAttribute('data-dsh-mobile-stat-label'),'5r 95s · 51/s');
 await page.locator('[data-composer-stat="activity"] [data-dsh-mobile-stat-label]').evaluate(e=>{e.firstChild.nodeValue='6 轮 96 步';});
 await page.waitForFunction(()=>document.querySelector('[data-composer-stat="activity"] [data-dsh-mobile-stat-label]').getAttribute('data-dsh-mobile-stat-label')==='6r 96s · 51/s');
 const state=()=>page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,center:document.querySelector('#center').getBoundingClientRect().toJSON(),root:document.querySelector('#root').getBoundingClientRect().toJSON(),font:getComputedStyle(document.querySelector('#editor')).fontSize,active:document.documentElement.hasAttribute('data-dsh-mobile')}));
 let closed=await state(); assert.equal(closed.active,true);assert.equal(closed.font,'16px');assert.ok(closed.scroll<=390);assert.equal(closed.center.width,334);
 await page.locator('#toggle').click();await page.waitForFunction(()=>document.querySelector('#center').inert);
 let opened=await state();assert.equal(opened.center.width,closed.center.width);assert.equal(opened.center.x,closed.center.x);assert.equal(await page.locator('[data-shell-bottom]').evaluate(e=>e.inert),true);
 await page.keyboard.press('Escape');await page.waitForFunction(()=>!document.querySelector('#center').inert);
 await page.evaluate(()=>{visualViewport.height=450;visualViewport.offsetTop=20;visualViewport.dispatchEvent(new Event('resize'));});
 await page.waitForFunction(()=>document.querySelector('#root').getBoundingClientRect().height===450);
 const keyboard=await state();assert.equal(keyboard.root.y,20);assert.equal(keyboard.root.height,450);
 assert.ok(await page.locator('#editor').evaluate(e=>e.getBoundingClientRect().bottom)<=470);
 await page.screenshot({path:'test-mobile-keyboard.png'});
 await page.setViewportSize({width:1280,height:900});await page.waitForFunction(()=>!document.documentElement.hasAttribute('data-dsh-mobile'));
 await page.setViewportSize({width:390,height:844});await page.waitForFunction(()=>document.documentElement.hasAttribute('data-dsh-mobile'));
 await page.evaluate(()=>{document.documentElement.style.setProperty('--unrelated-theme','kept');for(const stop of window.disposers.reverse())stop();});
 assert.equal(await page.locator('[data-dsh-mobile-style]').count(),0);
 assert.equal(await page.locator('[data-dsh-mobile-frame]').count(),0);
 assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--unrelated-theme')),'kept');
 assert.equal(await page.evaluate(()=>document.documentElement.style.getPropertyValue('--dsh-mobile-height')),'');
 console.log('PASS: horizontal containment, 16px editor, overlay geometry, Escape, simulated keyboard, desktop restore, dispose preserves unrelated styles');
} finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
