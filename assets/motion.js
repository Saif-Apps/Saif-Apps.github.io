/* Progressive enhancement: readable HTML first, optional motion second. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const compact = matchMedia('(max-width: 860px)');
  const home = document.body.classList.contains('home');
  const story = document.querySelector('.story-section');
  const sticky = document.querySelector('.story-sticky');
  const hero = document.querySelector('.cinematic-hero');
  const ending = document.querySelector('.download-section');
  const stage = document.querySelector('.hero-stage');
  const result = document.querySelector('.gather-result');
  const photoGroup = document.querySelector('.gather-photos');
  const toggle = document.querySelector('.motion-toggle');
  let paused = reduced.matches, frame = 0, tilt = 0, layoutPending = true;
  const chapters = [];
  const clamp = (n, a=0, b=1) => Math.min(b, Math.max(a, n));
  const ease = n => n*n*(3-2*n);
  const set = (el, name, value) => el?.style.setProperty(name, value);
  const clearMotion = () => {
    [hero, story, ending].forEach(el => el?.removeAttribute('style'));
    if (result) result.removeAttribute('style');
    photoGroup?.removeAttribute('style');
  };
  const draw = () => {
    frame = 0;
    if (document.hidden) return;
    if (layoutPending) { layoutChapters(); layoutPending = false; }
    chapters.forEach(drawChapter);
    if (paused) return;
    const height = window.innerHeight;
    if (hero) {
      const rect = hero.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < height) {
        const p=clamp(-rect.top / rect.height);
        set(hero, '--hero-lift', `${-p*65}px`);
        set(hero, '--hero-turn', `${-p*7}deg`);
        set(hero, '--card-lift', `${-p*95}px`);
        set(hero, '--card-drop', `${p*50}px`);
        set(hero, '--tilt-x', `${tilt}deg`);
      }
    }
    if (story && !compact.matches && !root.classList.contains('static-story')) {
      const rect=story.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < height) {
        const pinTop=parseFloat(getComputedStyle(sticky).top)||0;
        const travel=Math.max(1,story.offsetHeight-sticky.offsetHeight);
        const p=clamp((pinTop-rect.top)/travel);
        const gather=ease(clamp(p/.42));
        // Finish the outgoing scene before revealing the screenshot. Scrubbing
        // in either direction never blends two sets of photos together.
        const outgoing=1-ease(clamp((p-.42)/.16));
        const reveal=ease(clamp((p-.6)/.26));
        set(story,'--story-progress',String(p));
        set(story,'--g1x',`${gather*105}px`);set(story,'--g1y',`${gather*70}px`);set(story,'--g1r',`${-12+gather*12}deg`);
        set(story,'--g2x',`${gather*-115}px`);set(story,'--g2y',`${gather*10}px`);set(story,'--g2r',`${12-gather*12}deg`);
        set(story,'--g3x',`${gather*20}px`);set(story,'--g3y',`${gather*-75}px`);set(story,'--g3r',`${-3+gather*3}deg`);
        result.style.opacity=String(reveal);
        result.style.transform=`translateY(calc(-50% + ${(1-reveal)*40}px)) scale(${.92+reveal*.08})`;
        // Composite the outgoing cards as one layer so their overlap stays opaque.
        photoGroup.style.opacity=String(outgoing);
      }
    }
    if (ending) {
      const rect=ending.getBoundingClientRect();
      if (rect.bottom > 0 && rect.top < height) {
        const p=clamp((height-rect.top)/(height+rect.height));
        set(ending,'--end-lift',`${(p-.5)*-90}px`);set(ending,'--end-drop',`${(p-.5)*70}px`);
      }
    }
  };
  const schedule=()=>{if(!frame) frame=requestAnimationFrame(draw);};
  const updateStoryLayout=()=>{
    const needsStatic=innerHeight<740 || parseFloat(getComputedStyle(root).fontSize)>20;
    if(root.classList.contains('static-story')!==needsStatic)clearMotion();
    root.classList.toggle('static-story',needsStatic);
  };
  const updateMode=()=>{
    updateStoryLayout();
    root.classList.toggle('motion-paused',paused);
    root.classList.toggle('no-scroll-motion',paused);
    clearMotion();
    layoutPending = true;
    if(toggle){
      toggle.textContent=reduced.matches?'Reduced motion enabled':paused?'Enable motion':'Pause motion';
      toggle.disabled=reduced.matches;
      toggle.removeAttribute('aria-pressed');
    }
    if(paused && frame){cancelAnimationFrame(frame);frame=0;}
    schedule();
  };

  // Normal document scrolling is the timeline. Nothing intercepts the wheel,
  // touch gestures, Page Down, or the scrollbar; there is no autoplay timer.
  function selectChapter(chapter, index) {
    const focusInPanel = chapter.panels.some(panel => panel.contains(document.activeElement));
    chapter.active = index;
    chapter.tabs.forEach((tab, i) => {
      tab.classList.toggle('is-active', i === index);
      tab.setAttribute('aria-selected', String(i === index));
      tab.tabIndex = i === index ? 0 : -1;
    });
    chapter.panels.forEach((panel, i) => {
      panel.classList.toggle('chapter-active', i === index);
      panel.setAttribute('aria-hidden', String(i !== index));
      panel.inert = i !== index;
      panel.tabIndex = i === index ? 0 : -1;
    });
    // Preserve a keyboard reader's place only when they deliberately entered
    // the scene. Ordinary wheel/touch scrolling never takes focus from the page.
    if (focusInPanel) chapter.panels[index].focus({ preventScroll: true });
    chapter.count.textContent = `0${index + 1} / 0${chapter.panels.length}`;
  }
  function changeChapter(chapter, index, immediate = false) {
    if (chapter.target === index && (!immediate || chapter.animations.length === 0)) return;
    const outgoing = chapter.panels[chapter.active];
    const opacity = getComputedStyle(outgoing).opacity;
    const transform = getComputedStyle(outgoing).transform;
    const direction = index >= chapter.active ? 1 : -1;
    chapter.target = index;
    const version = ++chapter.version;
    chapter.animations.forEach(animation => animation.cancel());
    chapter.animations = [];
    const enter = () => {
      if (version !== chapter.version) return;
      selectChapter(chapter, index);
      if (!immediate) {
        chapter.animations.push(chapter.panels[index].animate([
          { opacity: 0, transform: `translateY(${direction * 16}px)` },
          { opacity: 1, transform: 'translateY(0)' }
        ], { duration: 340, easing: 'cubic-bezier(.2,.65,.3,1)' }));
      }
    };
    if (immediate) { enter(); return; }
    if (chapter.active === index) {
      chapter.animations.push(outgoing.animate([
        { opacity, transform }, { opacity: 1, transform: 'translateY(0)' }
      ], { duration: 200, easing: 'ease-out' }));
      return;
    }
    // Fade out, then reveal. Readable screenshots and text never overlap.
    const exit = outgoing.animate([
      { opacity, transform },
      { opacity: 0, transform: `translateY(${-direction * 12}px)` }
    ], { duration: 130, easing: 'ease-out', fill: 'forwards' });
    chapter.animations.push(exit);
    exit.finished.then(enter).catch(() => {}); // A reverse scroll cancels this exit.
  }
  function drawChapter(chapter) {
    if (!chapter.pinned) return;
    const rect = chapter.element.getBoundingClientRect();
    const progress = clamp((chapter.top - rect.top) / chapter.travel);
    const index = Math.min(chapter.panels.length - 1, Math.floor(progress * chapter.panels.length));
    set(chapter.element, '--chapter-progress', String(progress));
    const stageRect = chapter.stage.getBoundingClientRect();
    changeChapter(chapter, index, stageRect.bottom <= chapter.top || stageRect.top >= innerHeight);
  }
  function layoutChapters() {
    const headerHeight = document.querySelector('.topbar')?.getBoundingClientRect().height || 0;
    const top = Math.ceil(headerHeight + 16);
    const room = innerHeight - top - 24;
    const largeText = parseFloat(getComputedStyle(root).fontSize) > 20;
    chapters.forEach(chapter => {
      chapter.element.classList.add('chapter-measuring');
      set(chapter.element, '--chapter-top', `${top}px`);
      set(chapter.element, '--chapter-room', `${room}px`);
      // All panels occupy one grid cell while measuring, including inactive
      // panels. The tallest scene determines the fit and prevents clipping.
      const stageHeight = chapter.stage.offsetHeight;
      const pinned = !paused && !largeText && stageHeight <= room;
      // Tall/zoomed-out windows need less extra scrolling and a centered scene.
      chapter.top = Math.max(top, Math.round((innerHeight - stageHeight) / 2));
      const stepTravel = clamp(Math.min(innerHeight * .52, 1500 - innerHeight), 180, 440);
      chapter.travel = Math.round(stepTravel * chapter.panels.length);
      set(chapter.element, '--chapter-top', `${chapter.top}px`);
      chapter.element.classList.toggle('chapter-pinned', pinned);
      chapter.element.classList.remove('chapter-measuring');
      chapter.pinned = pinned;
      set(chapter.element, '--chapter-height', `${stageHeight + chapter.travel}px`);
      chapter.tabs.forEach(tab => { tab.tabIndex = 0; });
      chapter.panels.forEach((panel, index) => {
        panel.hidden = false;
        panel.setAttribute('role', pinned ? 'tabpanel' : 'region');
        panel.setAttribute('aria-labelledby', pinned ? chapter.tabs[index].id : chapter.labels[index]);
        panel.removeAttribute('aria-hidden');
        panel.removeAttribute('tabindex');
        panel.inert = false;
      });
      const focusedTab = chapter.tabs.indexOf(document.activeElement);
      if (!pinned && focusedTab !== -1) {
        chapter.panels[focusedTab].tabIndex = -1;
        chapter.panels[focusedTab].focus({ preventScroll: true });
      }
      chapter.version++;
      chapter.animations.forEach(animation => animation.cancel());
      chapter.animations = [];
      chapter.target = -1;
      if (pinned) {
        const p = clamp((chapter.top - chapter.element.getBoundingClientRect().top) / chapter.travel);
        changeChapter(chapter, Math.min(chapter.panels.length - 1, Math.floor(p * chapter.panels.length)), true);
      }
      chapter.measuredHeight = chapter.stage.offsetHeight;
    });
  }
  document.querySelectorAll('[data-scroll-chapter]').forEach(element => {
    const chapter = {
      element, stage: element.querySelector('.chapter-stage'),
      tabs: [...element.querySelectorAll('[role=tab]')],
      panels: [...element.querySelectorAll('.category-panel, .walkthrough-panel')],
      count: element.querySelector('.chapter-count'),
      active: 0, target: -1, version: 0, animations: [], pinned: false
    };
    chapter.labels = chapter.panels.map(panel => panel.getAttribute('aria-labelledby'));
    const jump = (index, focus = false) => {
      if (!chapter.pinned) return;
      const start = scrollY + element.getBoundingClientRect().top - chapter.top;
      const position = (index + .5) / chapter.panels.length;
      if (focus) chapter.tabs[index].focus({ preventScroll: true });
      window.scrollTo({ top: start + position * chapter.travel, behavior: 'smooth' });
    };
    // Optional direct navigation remains available to keyboard and assistive
    // technology users. It moves the timeline instead of changing hidden state.
    chapter.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => jump(index));
      tab.addEventListener('keydown', event => {
        let next = index;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % chapter.tabs.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + chapter.tabs.length - 1) % chapter.tabs.length;
        else if (event.key === 'Home') next = 0;
        else if (event.key === 'End') next = chapter.tabs.length - 1;
        else return;
        event.preventDefault(); jump(next, true);
      });
    });
    chapters.push(chapter);
  });
  if (chapters.length && 'ResizeObserver' in window) {
    const observer = new ResizeObserver(entries => {
      if (entries.some(entry => {
        const chapter = chapters.find(item => item.stage === entry.target);
        return !chapter || chapter.stage.offsetHeight !== chapter.measuredHeight;
      })) { layoutPending = true; schedule(); }
    });
    chapters.forEach(chapter => observer.observe(chapter.stage));
    const header = document.querySelector('.topbar');
    if (header) observer.observe(header);
  }
  if(home){
    if(toggle){toggle.hidden=false;toggle.addEventListener('click',()=>{paused=!paused;updateMode();});}
    addEventListener('scroll',schedule,{passive:true});
    addEventListener('resize',()=>{layoutPending=true;updateStoryLayout();schedule();},{passive:true});
    compact.addEventListener('change',()=>{clearMotion();schedule();});
    reduced.addEventListener('change',()=>{paused=reduced.matches;updateMode();});
    document.addEventListener('visibilitychange',schedule);
    if(stage){
      stage.addEventListener('pointermove',event=>{if(paused||compact.matches||event.pointerType==='touch')return;const r=stage.getBoundingClientRect();tilt=clamp((event.clientX-r.left)/r.width-.5,-.5,.5)*10;schedule();},{passive:true});
      stage.addEventListener('pointerleave',()=>{tilt=0;schedule();},{passive:true});
    }
    if('IntersectionObserver' in window){
      const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}});},{threshold:.08,rootMargin:'0px 0px 30px 0px'});
      document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
      root.classList.add('motion-ready');
    }
    updateMode();
  }
  const tablist=document.querySelector('.category-tabs');
  if(tablist){
    const orientation=()=>tablist.setAttribute('aria-orientation',compact.matches?'horizontal':'vertical');
    compact.addEventListener('change',orientation);orientation();
  }
  document.querySelectorAll('.mobile-menu').forEach(menu=>{
    menu.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menu.open=false;}));
    menu.addEventListener('keydown',event=>{if(event.key==='Escape'){menu.open=false;menu.querySelector('summary').focus();}});
    document.addEventListener('click',event=>{if(menu.open&&!menu.contains(event.target))menu.open=false;});
  });
})();
