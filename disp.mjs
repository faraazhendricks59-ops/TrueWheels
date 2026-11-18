import { chromium } from 'playwright-core';
const b = await chromium.launch({ executablePath:'/usr/bin/chromium', args:['--no-sandbox'] });
const ctx = await b.newContext({viewport:{width:1280,height:1000}});
await ctx.addInitScript(()=>{localStorage.setItem('truewheels_onboarding_complete','true');localStorage.setItem('truewheels_tour_completed','true');localStorage.setItem('truewheels_cookie_consent',JSON.stringify({essential:true,analytics:false,marketing:false}));});
const p = await ctx.newPage(); const errs=[]; p.on('pageerror',e=>errs.push(String(e)));
await p.goto('http://localhost:12000/disputes/v-1',{waitUntil:'networkidle'}); await p.waitForTimeout(1500);
const r = await p.evaluate(()=>{
  const t=document.body.innerText;
  const DANGER=['binding ruling','moves real funds','Escrow (Pty) Ltd','Funds Secured','Funds held in escrow','Mediation Thread','Internal Note','Internal — hidden','SLA Breached','chain of custody holds','holds up in a real legal process','AI flags','Metadata stripped','Possible screenshot','Prestige Motors','John Doe','Lerato K.','Split','Refund Buyer','Release Seller'];
  return {
    dangerPresent: DANGER.filter(s=>t.includes(s)),
    hasNoService: /does not run a dispute resolution service/i.test(t),
    hasForums: /National Consumer Commission/.test(t) && /Motor Industry Ombudsman/.test(t),
    hasRealProcess: /How a vehicle dispute is actually resolved/i.test(t),
    hasRedFlags: /If someone offers to help you get your money back/i.test(t),
    overflow: document.documentElement.scrollWidth-document.documentElement.clientWidth,
  };
});
console.log('rendered:', JSON.stringify(r,null,1));
console.log('errors:', errs.length, errs.slice(0,3));
await b.close();
