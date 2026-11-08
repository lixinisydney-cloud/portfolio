// Original Canvas 2D system. Typography is rasterized per glyph into reusable
// fill/outline stamps; no reference shaders, paths, code or fonts are imported.
const clamp = n => Math.max(0, Math.min(1, n));
function curve(a, b, c, d, t) { const s = 1 - t; return s*s*s*a + 3*s*s*t*b + 3*s*t*t*c + t*t*t*d; }
export function createLivingTypography(home) {
  const title = home.querySelector('#intro-title');
  const first = home.querySelector('.project-chapter');
  const portal = first.querySelector('.portal-link');
  const canvas = document.createElement('canvas');
  canvas.className = 'typography-canvas'; canvas.setAttribute('aria-hidden', 'true');
  home.prepend(canvas);
  const ctx = canvas.getContext('2d');
  const trailSurface = document.createElement('canvas');
  const trailCtx = trailSurface.getContext('2d');
  let lastTrail = { p: -1, y: -1 };
  const chapters = [...home.querySelectorAll(".project-chapter")].slice(0, 2);
  let anchors = [], segmentStart = 0, segmentEnd = 1;
  if (!ctx) { canvas.remove(); return { setEnabled() {}, destroy() {} }; }
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  let width = 0, height = 0, ratio = 1, glyphs = [], endpoint = 1;
  let raf = 0, enabled = true, disposed = false, lastFrame = 0, progress = 0, target = 0, frames = 0;
  let pointer = { x: -9999, y: -9999, vx: 0, vy: 0, stamp: 0, inside: false };
  function stamp(character, size, italic, outline) {
    const surface = document.createElement('canvas');
    const c = surface.getContext('2d');
    const font = `${italic ? 'italic ' : ''}900 ${size}px Arial, sans-serif`;
    c.font = font;
    const metrics = c.measureText(character);
    const advance = metrics.width;
    const pad = 6;
    surface.width = Math.ceil(metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight + pad * 2);
    surface.height = Math.ceil(metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent + pad * 2);
    c.font = font; c.textBaseline = 'alphabetic'; c.fillStyle = character === '.' ? '#ff6345' : '#eeece5';
    c.strokeStyle = '#eeece5'; c.lineWidth = Math.max(.8, size / 220);
    const origin = { x: pad + metrics.actualBoundingBoxLeft, y: pad + metrics.actualBoundingBoxAscent };
    if (outline) c.strokeText(character, origin.x, origin.y); else c.fillText(character, origin.x, origin.y);
    return { surface, advance, ox: origin.x, oy: origin.y };
  }
  function measure() {
    if (!enabled || home.hidden || disposed) return;
    width = innerWidth; height = innerHeight; ratio = Math.min(devicePixelRatio || 1, fine.matches ? 1.5 : 1.25);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    trailSurface.width = width; trailSurface.height = height; lastTrail.p = -1;
    const style = getComputedStyle(title); const size = parseFloat(style.fontSize); const tracking = parseFloat(style.letterSpacing) || 0;
    glyphs = [];
    for (const [selector, text, italic] of [['.intro-first','SYDNEY’S',false],['.solid-word','WORLD.',true]]) {
      const rect = title.querySelector(selector).getBoundingClientRect(); let x = rect.left;
      for (const char of text) {
        const fill = stamp(char, size, italic, false), outline = stamp(char, size, italic, true);
        glyphs.push({ char, fill, outline, x, y: rect.top + scrollY + size * .72, size, fx: 0, fy: 0, dx: 0, dy: 0, energy: 0, history: [] });
        x += fill.advance + tracking;
      }
    }
    endpoint = Math.max(height, portal.getBoundingClientRect().top + scrollY - height * .25);
    // Document-space anchors are measured from section boxes, never sticky
    // children: re-entering the homepage or resizing cannot move their origins.
    const sizeA = Math.min(width <= 760 ? 88 : 190, width * .17);
    anchors = chapters.map((chapter, i) => {
      const y = chapter.getBoundingClientRect().top + scrollY + height * (width <= 760 ? .22 : .57);
      const char = i ? 'A' : 'M';
      return { char, chapter, x: width * (i ? .79 : .09), y, size: sizeA,
        fill: stamp(char,sizeA,false,false), outline: stamp(char,sizeA,false,true),
        fx:0,fy:0,dx:0,dy:0,energy:0,history:[] };
    });
    segmentStart = anchors[0].y - height * .52;
    segmentEnd = anchors[1].y - height * .52;
    canvas.dataset.anchorStart = segmentStart.toFixed(2);
    canvas.dataset.anchorEnd = segmentEnd.toFixed(2);
    target = clamp(scrollY / endpoint); progress = target;
    request();
  }
  function anchorPoint(t) {
    const [a,b] = anchors, gap = b.y-a.y;
    return { x: curve(a.x,width*.85,width*.15,b.x,t),
      y: curve(a.y,a.y+gap*.24,b.y-gap*.24,b.y,t)-scrollY,
      angle: Math.sin(t*Math.PI*2)*.22 };
  }
  function paintStamp(g, point, alpha, scale, outline, warp = 0, phase = 0, painter = ctx) {
    if (point.y < -g.size * 1.8 || point.y > height + g.size || alpha <= .002) return;
    const cache = outline ? g.outline : g.fill;
    painter.save(); painter.globalAlpha = alpha; painter.translate(point.x, point.y); painter.rotate(point.angle || 0); painter.scale(scale, scale);
    painter.transform(1, Math.sin(phase) * warp * .0015, Math.cos(phase * .7) * warp * .002, 1, 0, 0);
    if (warp > .3 && !outline) {
      // Horizontal strips bend the interior of a glyph rather than only moving
      // its DOM bounding box. The offscreen stamp is cached until resize.
      for (let y = 0; y < cache.surface.height; y += 7) {
        const h = Math.min(7, cache.surface.height - y);
        const bend = Math.sin(y / g.size * 7 + phase) * warp;
        painter.drawImage(cache.surface, 0, y, cache.surface.width, h, -cache.ox + bend, y - cache.oy, cache.surface.width, h);
      }
    } else painter.drawImage(cache.surface, -cache.ox, -cache.oy);
    painter.restore();
  }
  function render(now) {
    raf = 0;
    if (!enabled || disposed || document.hidden || home.hidden || reduce.matches) return;
    const interval = fine.matches ? 25 : 42;
    if (now - lastFrame < interval) { request(); return; }
    const dt = Math.min(.1, Math.max(.001, (now - lastFrame) / 1000));
    lastFrame = now; frames++;
    target = clamp(scrollY / endpoint); progress += (target - progress) * (1 - Math.exp(-12 * dt));
    if (Math.abs(target - progress) < .0001) progress = target;
    const p = progress, time = now / 1000;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0); ctx.clearRect(0, 0, width, height);
    // This segment has no playback clock: the same scroll position always
    // produces the same length, glyph sequence and A fill (including reverse).
    const segment = clamp((scrollY-segmentStart)/(segmentEnd-segmentStart));
    const firstReveal = clamp((scrollY-(anchors[0].y-height*.95))/(height*.35));
    const arrival = clamp((segment-.78)/.22);
    const fade = 1-clamp(scrollY/(height*.85));
    if (segment !== lastTrail.p || scrollY !== lastTrail.y) {
      trailCtx.clearRect(0,0,width,height);
      const samples = fine.matches ? 66 : 26;
      for(let i=0;i<=Math.floor(segment*samples);i++) {
        const t=i/samples, point=anchorPoint(t);
        const change=clamp((t-.38)/.24);
        const alpha=.16+.24*t;
        paintStamp(anchors[0],point,alpha*(1-change),1,true,0,0,trailCtx);
        paintStamp(anchors[1],point,alpha*change,1,true,0,0,trailCtx);
      }
      if(segment>0 && segment<1) {
        const point=anchorPoint(segment), change=clamp((segment-.38)/.24);
        paintStamp(anchors[0],point,.65*(1-change),1,true,0,0,trailCtx);
        paintStamp(anchors[1],point,.65*change,1,true,0,0,trailCtx);
      }
      lastTrail={p:segment,y:scrollY};
    }
    ctx.drawImage(trailSurface,0,0,width,height);
    let totalEnergy = 0;
    [...glyphs,...anchors].forEach((g, index) => {
      const anchorIndex = index-glyphs.length;
      const alpha = anchorIndex < 0 ? fade : anchorIndex === 0 ? firstReveal : arrival;
      const at = {x:g.x,y:g.y-scrollY,angle:0};
      if(anchorIndex===1) paintStamp(g,at,clamp((segment-.6)/.4)*(1-arrival),1,true);
      if(alpha<=0) return;
      const distance = Math.hypot(pointer.x - (at.x + g.fill.advance * .4), pointer.y - (at.y - g.size * .35));
      const weight = fine.matches && pointer.inside ? Math.pow(clamp(1 - distance / (g.size * .8)), 2) : 0;
      const speed = Math.min(60, Math.hypot(pointer.vx, pointer.vy));
      const aimX = weight * ((at.x - pointer.x) * .13 + pointer.vx * .7);
      const aimY = weight * ((at.y - g.size * .35 - pointer.y) * .13 + pointer.vy * .7);
      g.dx = (g.dx + (aimX - g.fx) * .09) * .69; g.dy = (g.dy + (aimY - g.fy) * .09) * .69;
      g.fx += g.dx; g.fy += g.dy; g.energy += (weight * (10 + speed * .5) - g.energy) * .13;
      totalEnergy += g.energy;
      if (fine.matches && p < .9) for (const [i, old] of g.history.entries()) {
        paintStamp(g, old, Math.min(.32, g.energy / 55) * i / 8 * alpha, 1, true);
      }
      const organic = fine.matches ? Math.sin(time * .68 + index * .7) * 2.2 : 0;
      const point = { x: at.x + g.fx + organic, y: at.y + g.fy + Math.cos(time * .61 + index * .5) * (fine.matches ? 2 : 0), angle: at.angle + Math.sin(time + index) * g.energy * .002 };
      paintStamp(g, point, alpha, 1, false, fine.matches ? g.energy : 0, time * 2.3 + index);
      g.history.push(point); if (g.history.length > 8) g.history.shift();
    });
    pointer.vx *= .86; pointer.vy *= .86;
    [firstReveal,clamp((segment-.56)/.44)].forEach((reveal,i)=>{
      const chapter=chapters[i];
      chapter.style.setProperty('--portal-inset',`${(1-reveal)*46}%`);
      chapter.style.setProperty('--portal-radius',`${(1-reveal)*50}%`);
      chapter.style.setProperty('--image-scale',1.25-reveal*.25);
      chapter.style.setProperty('--portal-y',`${(1-reveal)*55}px`);
      chapter.style.setProperty('--handoff-title',i?1:firstReveal);
    });
    canvas.dataset.anchorProgress=segment.toFixed(4);
    canvas.dataset.anchorFill=arrival.toFixed(4);
    canvas.dataset.anchorLetters='M,A';
    canvas.dataset.progress = p.toFixed(4); canvas.dataset.energy = totalEnergy.toFixed(2); canvas.dataset.frames = String(frames);
    canvas.dataset.state = scrollY > anchors[1].y + height ? 'settled' : 'running';
    if (canvas.dataset.state === 'running' && (fine.matches || Math.abs(target - p) > .0001)) request();
  }
  function request() { if (!raf && enabled && !disposed && !reduce.matches && !document.hidden && !home.hidden) raf = requestAnimationFrame(render); }
  function move(event) {
    if (!fine.matches || event.pointerType === 'touch') return;
    const dt = Math.max(8, event.timeStamp - pointer.stamp);
    pointer.vx = pointer.inside ? Math.max(-45, Math.min(45, (event.clientX - pointer.x) / dt * 16)) : 0; pointer.vy = pointer.inside ? Math.max(-45, Math.min(45, (event.clientY - pointer.y) / dt * 16)) : 0;
    pointer.x = event.clientX; pointer.y = event.clientY; pointer.stamp = event.timeStamp;
    pointer.inside = event.clientY > 70; request();
  }
  function leave() { pointer.inside = false; pointer.vx = pointer.vy = 0; request(); }
  function preference() {
    const active = !reduce.matches;
    home.classList.toggle('canvas-active', active); canvas.hidden = !active;
    if (!active) { cancelAnimationFrame(raf); raf = 0; chapters.forEach(c=>{ c.style.setProperty('--portal-inset','0%'); c.style.setProperty('--portal-y','0px'); }); }
    else measure();
  }
  function visibility() { if (document.hidden) { cancelAnimationFrame(raf); raf = 0; } else request(); }
  addEventListener('pointermove', move, { passive: true }); document.addEventListener('pointerleave', leave);
  addEventListener('scroll', request, { passive: true }); addEventListener('resize', measure);
  document.addEventListener('visibilitychange', visibility); reduce.addEventListener('change', preference); fine.addEventListener('change', measure);
  preference(); document.fonts.ready.then(() => { if (!disposed) measure(); });
  return {
    setEnabled(value) { enabled = value; canvas.hidden = !value || reduce.matches; if (!value) { cancelAnimationFrame(raf); raf = 0; pointer.inside = false; canvas.dataset.state = 'paused'; } else { measure(); request(); } },
    destroy() { disposed = true; cancelAnimationFrame(raf); removeEventListener('pointermove',move);document.removeEventListener('pointerleave',leave);removeEventListener('scroll',request);removeEventListener('resize',measure);document.removeEventListener('visibilitychange',visibility);reduce.removeEventListener('change',preference);fine.removeEventListener('change',measure);home.classList.remove('canvas-active');canvas.remove();glyphs=[]; },
  };
}
