(() => {
'use strict';
const C = {blue:'#4da3ff', teal:'#2dd4bf', nginx:'#f472b6', gold:'#fbbf24', green:'#34d399', red:'#f87171', txt:'#e6edf7', mut:'#a3b1cc', sg:'#7dd3fc'};
const $ = s => document.querySelector(s);
const rm = matchMedia('(prefers-reduced-motion: reduce)');

const box = (x, y, w, h, o = {}) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx ?? 12}" fill="${o.fill || 'none'}" stroke="${o.stroke || C.mut}" stroke-width="${o.sw || 2}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
const t = (x, y, s, o = {}) => `<text x="${x}" y="${y}" fill="${o.fill || C.txt}" font-size="${o.size || 14}" font-weight="${o.w || 500}" text-anchor="${o.a || 'middle'}"${o.m ? ' class="m"' : ''}>${s}</text>`;
const wire = (id, color) => `<use href="#p-${id}" class="wire" stroke="${color}"/>`;

const ICON = {
  env:  `<rect x="-13" y="-9" width="26" height="18" rx="3" fill="${C.gold}"/><path d="M-13-9L0 2L13-9" fill="none" stroke="#7a5a00" stroke-width="2"/>`,
  doc:  `<rect x="-10" y="-13" width="20" height="26" rx="3" fill="#e6edf7"/><path d="M-6-6H6M-6-1H6M-6 4H2" stroke="#475569" stroke-width="2"/>`,
  ok:   `<circle r="13" fill="${C.green}"/><path d="M-6 0L-2 5L6-5" fill="none" stroke="#052e1c" stroke-width="3" stroke-linecap="round"/>`,
  x:    `<circle r="13" fill="${C.red}"/><path d="M-5-5L5 5M5-5L-5 5" stroke="#450a0a" stroke-width="3" stroke-linecap="round"/>`,
  pkg:  `<rect x="-12" y="-12" width="24" height="24" rx="3" fill="#c08a4a"/><path d="M0-12V12M-12 0H12" stroke="#6b4423" stroke-width="2"/>`,
  lock: `<rect x="-10" y="-3" width="20" height="15" rx="3" fill="${C.gold}"/><path d="M-6-3V-8A6 6 0 0 1 6-8V-3" fill="none" stroke="${C.gold}" stroke-width="3"/>`
};
const at = (k, x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${ICON[k]}</g>`;

const PATHS = {
  ssh:'M170 195 H420', pkg:'M650 108 V250', doc:'M900 120 V345 H860', lock:'M300 300 H385',
  req:'M170 435 H300 V300 H450', resp:'M450 335 H262 V455 H170', fetch:'M740 345 H640',
  prox:'M700 415 H740', proxb:'M740 435 H700'
};
const at8 = '170 455';

/* ---------- components: s = first step, e = last step ---------- */
const COMPS = [
  {s:1, svg:() =>
    box(190,20,890,580,{stroke:C.blue,fill:'rgba(77,163,255,.06)',rx:20}) + t(210,50,'AWS Cloud: the cloud city',{a:'start',size:17,w:700,fill:C.blue}) +
    box(215,62,840,520,{stroke:C.blue,dash:'8 6',fill:'rgba(77,163,255,.05)'}) + t(235,88,'VPC: your private street',{a:'start',fill:C.blue}) +
    box(360,100,670,440,{stroke:C.blue,fill:'rgba(77,163,255,.08)'}) + t(380,126,'Public subnet',{a:'start',fill:C.blue}) +
    t(285,243,'Internet Gateway',{fill:C.blue,w:700}) + box(235,255,100,100,{stroke:C.blue,fill:'rgba(77,163,255,.18)'}) +
    `<path d="M252 345V290a33 33 0 0 1 66 0V345" fill="none" stroke="${C.blue}" stroke-width="3"/>` +
    box(420,180,550,300,{stroke:C.teal,fill:'rgba(45,212,191,.10)',sw:3}) + t(435,472,'EC2: rented shop building (Amazon Linux 2023)',{a:'start',fill:C.teal,w:700})},
  {s:2, svg:() => box(20,150,150,90,{stroke:C.mut,fill:'rgba(255,255,255,.05)'}) + t(95,178,'Administrator',{w:700}) + t(95,198,"Ravi's laptop",{size:13,fill:C.mut}) + t(95,220,'SSH / EC2 Connect',{size:12,fill:C.mut}) + wire('ssh',C.teal) + t(290,186,'SSH, port 22',{size:12,fill:C.teal})},
  {s:2, svg:() => box(450,230,250,220,{stroke:C.nginx,fill:'rgba(244,114,182,.12)',sw:3}) + t(575,257,'NGINX',{size:17,w:700,fill:C.nginx}) + t(575,277,'the receptionist',{size:13,fill:C.mut})},
  {s:2, e:2, svg:() => t(575,360,'installed, not running yet',{size:13,fill:C.mut})},
  {s:3, e:7, svg:() => t(575,360,'active (running)',{size:14,fill:C.green,w:700}) + `<circle cx="478" cy="355" r="6" fill="${C.green}"/>` + `<rect x="443" y="305" width="14" height="40" rx="3" fill="${C.gold}"/>` + t(575,318,'port 80: the entrance',{size:12,fill:C.gold})},
  {s:3, e:7, svg:() => t(575,395,'listening on port 80',{size:13}) + t(575,425,'systemctl = power controls',{size:12,fill:C.mut})},
  {s:4, svg:() => box(740,260,200,120,{stroke:C.gold,fill:'rgba(251,191,36,.08)'}) + t(840,284,'Web root shelf',{size:13,w:700,fill:C.gold}) + t(840,303,'/usr/share/nginx/html/',{size:12,m:1,fill:C.mut}) + box(795,322,90,36,{stroke:C.txt,fill:'rgba(255,255,255,.12)',rx:6,sw:1.5}) + t(840,345,'index.html',{size:12,m:1})},
  {s:5, svg:() => box(390,140,610,392,{stroke:C.sg,dash:'10 6',rx:16}) + t(405,162,'Security Group: door guard',{a:'start',fill:C.sg,w:700}) + `<rect x="382" y="284" width="16" height="32" rx="3" fill="${C.sg}"/>` +
    box(720,190,240,52,{stroke:C.sg,fill:'rgba(125,211,252,.10)',rx:8,sw:1.5}) + t(732,210,'Open: HTTP 80 from anyone',{a:'start',size:12,fill:C.green}) + t(732,230,'Open: SSH 22 from admin IP only',{a:'start',size:12,fill:C.sg})},
  {s:6, svg:() => t(95,330,'The Internet',{size:13,fill:C.mut}) + box(20,380,150,110,{stroke:C.gold,fill:'rgba(251,191,36,.07)'}) + t(95,398,'Visitor browser',{size:13,w:700}) +
    box(28,406,134,20,{stroke:C.mut,rx:5,sw:1,fill:'none'}) + t(95,421,'http://PUBLIC-IP',{size:12,m:1,fill:C.gold}) + box(28,432,134,50,{stroke:C.mut,rx:5,sw:1,fill:'rgba(255,255,255,.04)'}) +
    wire('req',C.gold) + t(180,424,'HTTP request',{a:'start',size:12,fill:C.gold}) + t(435,200,'Public IPv4: the shop address',{a:'start',size:13,fill:C.teal})},
  {s:6, e:6, svg:() => t(95,462,'waiting...',{size:12,fill:C.mut})},
  {s:7, svg:() => wire('resp',C.green) + t(180,478,'HTTP 200 OK',{a:'start',size:12,fill:C.green,w:700}) + t(95,454,'Welcome to',{size:12,w:700}) + t(95,472,'ShowTime',{size:12,w:700})},
  {s:8, svg:() => wire('prox',C.nginx) + wire('proxb',C.nginx) + box(740,395,200,60,{stroke:C.green,fill:'rgba(52,211,153,.08)',rx:10}) + t(840,418,'App server',{size:13,w:700,fill:C.green}) + t(840,438,'127.0.0.1:3000',{size:12,m:1,fill:C.mut})},
  {s:8, svg:() => t(575,360,'active (running)',{size:14,fill:C.green,w:700}) + `<circle cx="478" cy="355" r="6" fill="${C.green}"/><rect x="443" y="305" width="14" height="40" rx="3" fill="${C.gold}"/>` + t(575,318,'port 80: the entrance',{size:12,fill:C.gold}) + t(575,395,'/ serves files',{size:12}) + t(575,415,'/api/ goes to the app',{size:12}) + t(575,435,'anything else: 404',{size:12,fill:C.red})},
  {s:9, svg:() => box(430,488,420,38,{stroke:C.mut,rx:8,sw:1.5,fill:'rgba(255,255,255,.05)'}) + t(640,512,'access.log = visitor register   error.log = problem register',{size:12}) +
    box(790,32,276,26,{stroke:C.gold,rx:13,sw:1.5,fill:'rgba(251,191,36,.12)'}) + t(928,50,'Next: HTTPS + your own domain name',{size:12,fill:C.gold})}
];

/* ---------- moving objects ---------- */
let sim = null, appOn = true;
function simMovers() {
  const p = sim.p, M = (path, icon, win, pos) => ({path, icon, dur:7, win, pos, once:true});
  if (p === '/') return [M('req','env',[0,.2],'450 300'), M('fetch','doc',[.22,.36],'640 345'), M('resp','ok',[.4,1],at8)];
  if (p === '/missing') return [M('req','env',[0,.2],'450 300'), M('resp','x',[.25,.8],at8)];
  return [M('req','env',[0,.18],'450 300'), M('prox','env',[.2,.32],'740 415'), M('proxb', appOn ? 'pkg' : 'x', [.34,.46],'700 435'), M('resp', appOn ? 'ok' : 'x', [.5,1], at8)];
}
function movers() {
  switch (cur) {
    case 2: return [{path:'ssh', icon:'lock', dur:3.5, win:[0,.9], pos:'420 195'}, {path:'pkg', icon:'pkg', dur:3.5, win:[0,.9], pos:'650 250'}];
    case 4: return [{path:'doc', icon:'doc', dur:3.5, win:[0,.9], pos:'860 345'}];
    case 5: return [{path:'lock', icon:'lock', dur:2.5, win:[0,.9], pos:'385 300'}];
    case 6: return [{path:'req', icon:'env', dur:4, win:[0,.9], pos:'450 300'}];
    case 7: case 8: case 9:
      if (sim) return simMovers();
      return [{path:'req', icon:'env', dur:7, win:[0,.2], pos:'450 300'}, {path:'fetch', icon:'doc', dur:7, win:[.22,.36], pos:'640 345'}, {path:'resp', icon:'ok', dur:7, win:[.4,1], pos:at8}];
    default: return [];
  }
}
function mover(m) {
  const [a, b] = m.win, rc = m.once ? 'repeatCount="1" fill="freeze"' : 'repeatCount="indefinite"';
  return `<g><animateMotion dur="${m.dur}s" ${rc} calcMode="linear" keyPoints="0;0;1;1" keyTimes="0;${a};${b};1"><mpath href="#p-${m.path}"/></animateMotion>` +
    `<animate attributeName="opacity" calcMode="discrete" values="0;1;0" keyTimes="0;${a};${b}" dur="${m.dur}s" ${rc}/>${ICON[m.icon]}</g>`;
}

/* ---------- step content ---------- */
const STEPS = [
  {t:'AWS Cloud and EC2', sub:'Rent a shop in the cloud city', plain:'Ravi rents a building in the AWS cloud city. That building is an EC2 instance, a small computer, with Amazon Linux as its operating system.', tech:'EC2 instance (Amazon Linux 2023) in a public subnet of a VPC. The Internet Gateway connects the VPC to the internet, and a public IPv4 address makes the instance reachable.', cmd:['# Console: EC2 > Launch instance','# AMI: Amazon Linux 2023, type t3.micro','# Network: public subnet, auto-assign public IPv4'], watch:'The cloud, VPC, public subnet, Internet Gateway and the teal EC2 building fade in.'},
  {t:'Connect and install NGINX', sub:'Hire the receptionist', plain:"Ravi walks into his shop through a secure remote connection, then hires a receptionist called NGINX (say \"engine-x\"). A package delivers it.", tech:'Connect with SSH (port 22) or EC2 Instance Connect, then install the nginx package with dnf, the package manager of Amazon Linux 2023.', cmd:['ssh -i my-key.pem ec2-user@PUBLIC-IP','sudo dnf install nginx -y','nginx -v'], watch:'A lock slides along the SSH line, and a package drops into the new NGINX box.'},
  {t:'Start and enable NGINX', sub:'Switch the power on', plain:'The receptionist is hired but asleep. systemctl is the power control: start wakes her now, enable makes her wake up after every reboot.', tech:'systemd manages the nginx service. "enable --now" starts it and enables it at boot. NGINX then listens on TCP port 80 for HTTP.', cmd:['sudo systemctl enable --now nginx','sudo systemctl status nginx',"sudo ss -tlnp | grep ':80'"], watch:'The status turns green and a gold door marks port 80.'},
  {t:'Create the website file', sub:'Put the welcome page on the shelf', plain:'NGINX hands out whatever is on its web root shelf. Ravi places a welcome page there called index.html.', tech:'On Amazon Linux the default web root is /usr/share/nginx/html. For requests to /, NGINX serves index.html from that folder (the index directive).', cmd:["echo '<h1>Welcome to ShowTime</h1>' | sudo tee /usr/share/nginx/html/index.html",'ls -l /usr/share/nginx/html/'], watch:'A document slides onto the shelf and index.html appears.'},
  {t:'Configure the Security Group', sub:'Brief the door guard', plain:'The door guard decides who may come in. Visitors may use the public entrance (port 80). Only Ravi, from his own address, may use the staff door (SSH, port 22).', tech:'A Security Group is a stateful virtual firewall. Inbound rules: HTTP TCP 80 from 0.0.0.0/0, SSH TCP 22 from your IP /32. Anything not allowed is denied.', cmd:['# EC2 > Security Groups > Inbound rules','# HTTP  TCP 80  0.0.0.0/0','# SSH   TCP 22  YOUR-IP/32'], watch:'A dashed border wraps the building and a lock checks who gets through.'},
  {t:'Visitor opens the public IP', sub:'The request travels', plain:'A customer types the shop address into the browser. The request, an envelope, travels through the main entrance and down the street to the shop.', tech:'The browser opens a TCP connection to PUBLIC-IP:80 and sends an HTTP GET request. It enters the VPC through the Internet Gateway and passes the Security Group.', cmd:['http://PUBLIC-IP','curl -i http://PUBLIC-IP'], watch:'A gold envelope leaves the visitor, passes the Internet Gateway and reaches NGINX.'},
  {t:'NGINX serves the page', sub:'200 OK, and the page appears', plain:'The receptionist reads the request, fetches the welcome page from the shelf and hands it back with a stamp that says everything is fine: 200 OK.', tech:'A server block matches the request. For location /, NGINX maps the URL to a file under root, reads it, and returns HTTP/1.1 200 OK with the HTML body.', cmd:['server {','  listen 80;','  root /usr/share/nginx/html;','  location / { try_files $uri $uri/ =404; }','}','sudo nginx -t && sudo systemctl reload nginx'], watch:'The envelope arrives, a document is fetched from the shelf, and a green check carries the response back. The live preview below turns into the page.'},
  {t:'Routes and reverse proxy', sub:'Try it yourself', plain:'NGINX is not only a file handler. It also reads the address and decides: serve a file, pass the visitor to a back-room app, or say "not found". Click the buttons and watch.', tech:'location blocks route by URL. A missing file returns 404. proxy_pass forwards /api/ to an app on 127.0.0.1:3000 (reverse proxy). If the app is down, NGINX returns 502 Bad Gateway.', cmd:['location /api/ {','  proxy_pass http://127.0.0.1:3000;','}','curl -i http://localhost/missing','curl -i http://localhost/api/shows'], watch:'Use GET /, GET /missing and GET /api/shows. Turn the app server off and request /api/shows to see a 502. The preview and access.log update.'},
  {t:'Logs and the full picture', sub:'Registers and troubleshooting', plain:'Every visitor is written in the visitor register (access log). Every problem goes into the problem register (error log). If something breaks, Ravi checks the registers and tests the receptionist first.', tech:'Logs live in /var/log/nginx. Check config syntax with nginx -t, then reload. Troubleshooting order: service status, port 80 listener, localhost test, Security Group, public IP, route table, logs. For production add HTTPS (TLS, port 443) and a domain name.', cmd:['sudo nginx -t','sudo systemctl status nginx','sudo journalctl -u nginx','sudo tail -f /var/log/nginx/access.log','sudo tail -f /var/log/nginx/error.log'], watch:'The log register box appears. Keep sending requests from the Try it buttons and read them in access.log.'}
];
const LEGEND = [['env','HTTP request'],['doc','HTML file'],['ok','HTTP 200 response'],['pkg','Installation or app reply'],['lock','Security filtering'],['x','Error or blocked']];

/* ---------- preview and log ---------- */
const OUT = {
  '/': {code:200, view:'home', note:'200 OK: index.html was found and delivered.', err:''},
  '/missing': {code:404, view:'404', note:'404 Not Found: no such file on the shelf.', err:'open() "/usr/share/nginx/html/missing" failed (2: No such file or directory)'},
  '/api/shows': {code:200, view:'api', note:'200 OK: NGINX passed the request to the app and returned its answer.', err:''}
};
const SITES = {
  down: `<h4>This site can't be reached</h4><p>The page appears after step 7.</p>`,
  home: `<h4>ShowTime</h4><p>Stories, shows and movies, served by NGINX on EC2.</p><span class="btn">Watch now</span><div class="posters"><i></i><i></i><i></i></div>`,
  '404': `<h4>404 Not Found</h4><p>nginx says: that file is not on the shelf.</p>`,
  api: `<h4>JSON from the app</h4><p><code>{"shows":["Night Market","Cloud City","Ravi's Shop"]}</code></p>`,
  '502': `<h4>502 Bad Gateway</h4><p>The app behind NGINX is not answering.</p>`
};
let logLines = [], tmo = null;
const stamp = () => { const d = new Date(); return `24/Oct/2026:${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}:${String(d.getSeconds()).padStart(2,'0')} +0000`; };
function addLog(p, code) { logLines.push(`203.0.113.7 - - [${stamp()}] "GET ${p} HTTP/1.1" ${code}`); logLines = logLines.slice(-6); $('#log').textContent = logLines.join('\n'); }
function show(view, path) {
  $('#url').textContent = 'http://54.210.x.x' + (path || '');
  const s = $('#site'); s.className = 'site' + (view === 'home' || view === 'api' ? '' : ' err'); s.innerHTML = SITES[view];
}
function outcome(p) {
  let o = OUT[p]; if (p === '/api/shows' && !appOn) o = {code:502, view:'502', note:'502 Bad Gateway: the app server is off.', err:'connect() failed (111: Connection refused) while connecting to upstream'};
  show(o.view, p === '/' ? '' : p); addLog(p, o.code); $('#msg').textContent = o.note;
  if (o.err) $('#log').textContent += '\n[error.log] ' + o.err;
}

/* ---------- rendering ---------- */
let cur = 1, glow = true, playT = null;
function draw() {
  const defs = '<defs>' + Object.entries(PATHS).map(([k, d]) => `<path id="p-${k}" d="${d}"/>`).join('') + '</defs>';
  const comps = COMPS.filter(c => cur >= c.s && cur <= (c.e || 99)).map(c => `<g class="${glow && c.s === cur ? 'new' : ''}">${c.svg()}</g>`).join('');
  let mv = movers(); if (rm.matches && mv.length) mv = [Object.assign({}, mv[mv.length - 1], {once:true, win:[0,1], dur:.01})];
  $('#scene').innerHTML = defs + comps + mv.map(mover).join('');
}
function caption() {
  const s = STEPS[cur - 1];
  $('#c-title').textContent = `Step ${cur}: ${s.t}`; $('#c-plain').textContent = s.plain; $('#c-tech').textContent = s.tech; $('#c-cmd').textContent = s.cmd.join('\n'); $('#c-watch').textContent = s.watch;
  $('#count').textContent = `Step ${cur} of ${STEPS.length}`;
  document.querySelectorAll('.step').forEach((b, i) => { b.classList.toggle('done', i + 1 < cur); if (i + 1 === cur) b.setAttribute('aria-current', 'step'); else b.removeAttribute('aria-current'); });
  $('#prev').disabled = cur === 1; $('#next').disabled = cur === STEPS.length;
  $('#sim').hidden = cur < 7;
}
function go(n) {
  clearTimeout(tmo);
  cur = Math.max(1, Math.min(STEPS.length, n)); glow = true; sim = null; $('#msg').textContent = '';
  logLines = []; $('#log').textContent = '(empty: no visitors yet)';
  if (cur < 7) show('down', ''); else { show('home', ''); tmo = setTimeout(() => outcome('/'), 2800); }
  draw(); caption();
}
function request(p) {
  clearTimeout(tmo); sim = {p, id: Date.now()}; glow = false; draw();
  $('#msg').textContent = 'Request sent...'; tmo = setTimeout(() => outcome(p), rm.matches ? 100 : 3200);
}
function setPlay(on) {
  clearInterval(playT);
  const b = $('#play'); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Pause' : 'Auto-play';
  if (on) playT = setInterval(() => { if (cur >= STEPS.length) setPlay(false); else go(cur + 1); }, 5000);
}
function init() {
  $('#steps').innerHTML = STEPS.map((s, i) => `<li><button type="button" class="step" data-i="${i + 1}"><span class="n">${i + 1}</span><span><b>${s.t}</b><small>${s.sub}</small></span></button></li>`).join('');
  $('#legend').innerHTML = LEGEND.map(([k, l]) => `<li><svg width="28" height="28" viewBox="-16 -16 32 32" aria-hidden="true">${ICON[k]}</svg>${l}</li>`).join('');
  $('#steps').addEventListener('click', e => { const b = e.target.closest('.step'); if (b) { setPlay(false); go(+b.dataset.i); } });
  $('#sim').addEventListener('click', e => { const b = e.target.closest('button[data-p]'); if (b) { setPlay(false); request(b.dataset.p); } });
  $('#app').onclick = () => { appOn = !appOn; $('#app').setAttribute('aria-pressed', String(appOn)); $('#app').textContent = 'App server: ' + (appOn ? 'ON' : 'OFF'); $('#msg').textContent = appOn ? 'App server is back on.' : 'App server is off. Try GET /api/shows.'; };
  $('#prev').onclick = () => { setPlay(false); go(cur - 1); };
  $('#next').onclick = () => { setPlay(false); go(cur + 1); };
  $('#reset').onclick = () => { setPlay(false); appOn = true; $('#app').setAttribute('aria-pressed', 'true'); $('#app').textContent = 'App server: ON'; go(1); };
  $('#play').onclick = () => { const on = $('#play').getAttribute('aria-pressed') !== 'true'; if (on && cur >= STEPS.length) go(1); setPlay(on); };
  $('#theme').onclick = () => { const d = document.documentElement, n = d.dataset.theme === 'dark' ? 'light' : 'dark'; d.dataset.theme = n; try { localStorage.setItem('nsv-theme', n); } catch (e) { /* ignore */ } };
  let saved = null; try { saved = localStorage.getItem('nsv-theme'); } catch (e) { /* ignore */ }
  document.documentElement.dataset.theme = saved || (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  go(1);
}
init();
})();
