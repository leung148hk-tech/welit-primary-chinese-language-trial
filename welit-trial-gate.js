/*
 * Welit Education public trial gate
 * This component intentionally uses no persistent browser storage.
 */
(() => {
  'use strict';

  const fileName = window.location.pathname.split('/').pop() || 'index.html';
  const levelMatch = fileName.match(/_(basic|standard|advanced)\.html$/);
  const trialRules = {
    basic: { label: '補底版', subtopics: 3, questions: 5, colour: 'emerald' },
    standard: { label: '標準版', subtopics: 2, questions: 3, colour: 'orange' }
  };
  const rule = levelMatch ? trialRules[levelMatch[1]] : null;

  const style = document.createElement('style');
  style.textContent = `
    .welit-brand-mark { display: inline-flex; align-items: center; gap: .65rem; font-weight: 900; letter-spacing: .02em; }
    .welit-brand-mark__icon { display: inline-flex; align-items: center; justify-content: center; width: 2.25rem; height: 2.25rem; border-radius: .8rem; background: linear-gradient(135deg, #14b8a6, #2563eb); color: #fff; box-shadow: 0 5px 14px rgba(37,99,235,.25); font-size: 1.15rem; }
    .welit-brand-mark__name { display: flex; flex-direction: column; line-height: 1.02; text-align: left; }
    .welit-brand-mark__en { margin-top: .18rem; color: #64748b; font-size: .62rem; letter-spacing: .1em; text-transform: uppercase; }
    .welit-locked { position: relative !important; overflow: hidden; cursor: pointer !important; border-color: #cbd5e1 !important; background: linear-gradient(135deg, #f8fafc, #eef2ff) !important; color: #334155 !important; opacity: 1 !important; filter: none !important; }
    .welit-locked:hover { transform: none !important; box-shadow: 0 8px 18px rgba(15,23,42,.10) !important; }
    .welit-locked::before { content: ''; position: absolute; inset: 0; background: repeating-linear-gradient(-45deg, transparent 0 10px, rgba(148,163,184,.10) 10px 20px); pointer-events: none; }
    .welit-locked__content { position: relative; display: flex; min-height: 100%; width: 100%; align-items: center; justify-content: center; gap: .7rem; text-align: center; }
    .welit-lock-tile { min-width: 0 !important; padding: .25rem !important; }
    .welit-lock-tile .welit-locked__content { flex-direction: column; gap: .08rem; font-size: .66rem; }
    .welit-lock-tile .welit-brand-mark__icon { width: 1.8rem; height: 1.8rem; border-radius: .62rem; font-size: .95rem; }
    .welit-lock-tile .welit-brand-mark__name { display: none; }
    .welit-lock-tile .welit-lock-copy { display: none; }
    .welit-trial-banner { border: 1px solid #99f6e4; background: linear-gradient(115deg, #f0fdfa, #eff6ff); color: #134e4a; border-radius: 1rem; padding: .9rem 1rem; margin: 0 0 1rem; font-weight: 700; line-height: 1.6; }
    .welit-trial-banner strong { color: #0f766e; }
    .welit-lock-modal { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(15,23,42,.72); backdrop-filter: blur(5px); }
    .welit-lock-modal__card { width: min(100%, 30rem); border-radius: 1.5rem; border: 1px solid rgba(255,255,255,.65); background: #fff; padding: 2rem; text-align: center; box-shadow: 0 25px 70px rgba(15,23,42,.35); }
    .welit-lock-modal__card .welit-brand-mark { justify-content: center; font-size: 1.25rem; }
    .welit-lock-modal__card .welit-brand-mark__icon { width: 3.2rem; height: 3.2rem; border-radius: 1rem; font-size: 1.45rem; }
    .welit-lock-modal__card .welit-brand-mark__en { font-size: .72rem; }
    .welit-lock-modal__card h2 { margin: 1.4rem 0 .6rem; color: #0f172a; font-size: 1.5rem; font-weight: 900; }
    .welit-lock-modal__card p { margin: 0; color: #475569; font-weight: 650; line-height: 1.7; }
    .welit-lock-modal__actions { display: flex; justify-content: center; gap: .75rem; margin-top: 1.5rem; }
    .welit-lock-modal__actions button, .welit-lock-modal__actions a { display: inline-flex; align-items: center; justify-content: center; min-height: 2.9rem; border-radius: .8rem; padding: .6rem 1rem; font-weight: 850; text-decoration: none; }
    .welit-lock-modal__close { border: 0; background: #0f766e; color: #fff; }
    .welit-lock-modal__home { border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; }
    .welit-flow-lock { width: min(100%, 42rem); margin: 2rem auto; border: 2px dashed #94a3b8; border-radius: 1.5rem; background: linear-gradient(135deg, #f8fafc, #eff6ff); padding: 2.25rem 1.5rem; text-align: center; color: #334155; }
    .welit-flow-lock .welit-brand-mark { justify-content: center; font-size: 1.2rem; }
    .welit-flow-lock h2 { margin: 1.2rem 0 .55rem; color: #0f172a; font-size: 1.45rem; font-weight: 900; }
    .welit-flow-lock p { margin: 0; line-height: 1.7; font-weight: 650; }
    .welit-flow-lock a { display: inline-flex; margin-top: 1.35rem; min-height: 2.8rem; align-items: center; border-radius: .8rem; background: #0f766e; color: #fff; padding: .6rem 1rem; font-weight: 850; text-decoration: none; }
    :root { --welit-promo-top: 2.75rem; --welit-promo-bottom: 3.4rem; }
    body.welit-promo-ready { padding-top: var(--welit-promo-top) !important; padding-bottom: var(--welit-promo-bottom) !important; }
    .welit-promo-top { position: fixed; inset: 0 0 auto; z-index: 12000; display: flex; min-height: var(--welit-promo-top); align-items: stretch; overflow: hidden; background: linear-gradient(90deg, #115e59, #0f766e 45%, #1d4ed8); color: #fff; box-shadow: 0 4px 16px rgba(15,23,42,.22); }
    .welit-promo-marquee { min-width: 0; flex: 1; overflow: hidden; }
    .welit-promo-track { display: flex; width: max-content; min-height: var(--welit-promo-top); align-items: center; animation: welit-marquee 28s linear infinite; white-space: nowrap; }
    .welit-promo-top:hover .welit-promo-track, .welit-promo-top:focus-within .welit-promo-track { animation-play-state: paused; }
    .welit-promo-message { display: inline-flex; align-items: center; gap: .6rem; padding-right: 3rem; font-size: .9rem; font-weight: 850; letter-spacing: .01em; }
    .welit-promo-message strong { color: #fef08a; }
    .welit-promo-cta { z-index: 1; display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; padding: .55rem .85rem; background: rgba(15,23,42,.32); color: #fff; font-size: .78rem; font-weight: 900; text-decoration: none; white-space: nowrap; }
    .welit-promo-cta:hover, .welit-promo-cta:focus-visible { background: rgba(15,23,42,.55); }
    @keyframes welit-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .welit-promo-dock { position: fixed; z-index: 12000; right: 0; bottom: 0; left: 0; max-height: calc(var(--welit-promo-bottom) + env(safe-area-inset-bottom)); overflow: hidden; border-top: 1px solid rgba(45,212,191,.42); background: rgba(255,255,255,.97); box-shadow: 0 -7px 22px rgba(15,23,42,.15); transition: max-height .3s ease; backdrop-filter: blur(10px); }
    .welit-promo-dock.is-open { max-height: min(34rem, 78dvh); }
    .welit-promo-dock__toggle { display: flex; min-height: var(--welit-promo-bottom); width: 100%; align-items: center; justify-content: space-between; gap: .7rem; border: 0; background: transparent; color: #0f172a; padding: .65rem 1rem calc(.65rem + env(safe-area-inset-bottom)); text-align: left; }
    .welit-promo-dock__toggle:hover { background: #f0fdfa; }
    .welit-promo-dock__label { display: flex; min-width: 0; align-items: center; gap: .55rem; font-size: .9rem; font-weight: 900; }
    .welit-promo-dock__badge { display: inline-flex; height: 1.7rem; width: 1.7rem; flex: 0 0 auto; align-items: center; justify-content: center; border-radius: .55rem; background: #0f766e; color: #fff; font-size: .78rem; }
    .welit-promo-dock__hint { color: #0f766e; font-size: .75rem; font-weight: 850; white-space: nowrap; }
    .welit-promo-dock__body { border-top: 1px solid #ccfbf1; padding: 1rem 1rem calc(1rem + env(safe-area-inset-bottom)); color: #334155; }
    .welit-promo-dock__body h2 { color: #0f172a; font-size: 1.12rem; font-weight: 950; }
    .welit-promo-dock__body p { margin-top: .55rem; font-size: .9rem; font-weight: 650; line-height: 1.6; }
    .welit-promo-dock__tags { display: flex; flex-wrap: wrap; gap: .45rem; margin-top: .8rem; }
    .welit-promo-dock__tag { border: 1px solid #99f6e4; border-radius: 999px; background: #f0fdfa; color: #115e59; padding: .3rem .55rem; font-size: .75rem; font-weight: 850; }
    .welit-promo-dock__actions { display: flex; flex-wrap: wrap; gap: .65rem; margin-top: 1rem; }
    .welit-promo-dock__actions a { display: inline-flex; min-height: 2.55rem; align-items: center; justify-content: center; border-radius: .75rem; padding: .55rem .8rem; font-size: .85rem; font-weight: 900; text-decoration: none; }
    .welit-promo-dock__whatsapp { background: #0f766e; color: #fff; }
    .welit-promo-dock__whatsapp:hover { background: #115e59; }
    .welit-promo-dock__address { border: 1px solid #cbd5e1; background: #f8fafc; color: #334155; }
    @media (max-width: 640px) { .welit-promo-message { padding-right: 2rem; font-size: .76rem; } .welit-promo-cta { padding: .5rem .65rem; font-size: .68rem; } .welit-promo-dock__toggle { padding-inline: .75rem; } .welit-promo-dock__hint { font-size: .68rem; } }
    @media (prefers-reduced-motion: reduce) { .welit-promo-track { animation: none; transform: none; } }
  `;
  document.head.appendChild(style);

  const brandMark = () => `
    <span class="welit-brand-mark" aria-label="言點教育 Welit Education">
      <span class="welit-brand-mark__icon" aria-hidden="true">W</span>
      <span class="welit-brand-mark__name">言點教育<span class="welit-brand-mark__en">Welit Education</span></span>
    </span>`;

  function setupPromotions() {
    if (document.querySelector('.welit-promo-top') || document.querySelector('.welit-promo-dock')) return;
    document.body.classList.add('welit-promo-ready');

    const topBar = document.createElement('aside');
    topBar.className = 'welit-promo-top';
    topBar.setAttribute('aria-label', '言點教育招生訊息');
    const message = '<strong>想解鎖全部中文練習？</strong> 歡迎報名言點教育中文專科班｜香港荃灣南豐中心 1609B 室｜WhatsApp：6748 1044';
    topBar.innerHTML = `
      <div class="welit-promo-marquee" aria-live="polite">
        <div class="welit-promo-track">
          <span class="welit-promo-message">${message}</span>
          <span class="welit-promo-message" aria-hidden="true">${message}</span>
        </div>
      </div>
      <a class="welit-promo-cta" href="https://wa.me/85267481044" target="_blank" rel="noopener noreferrer" aria-label="以 WhatsApp 聯絡言點教育">WhatsApp 查詢</a>`;
    document.body.prepend(topBar);

    const dock = document.createElement('aside');
    dock.className = 'welit-promo-dock';
    dock.setAttribute('aria-label', '言點教育課程服務');
    dock.innerHTML = `
      <button class="welit-promo-dock__toggle" type="button" aria-expanded="false" aria-controls="welit-promo-details">
        <span class="welit-promo-dock__label"><span class="welit-promo-dock__badge" aria-hidden="true">W</span>關注言點教育課程</span>
        <span class="welit-promo-dock__hint">展開課程資料 ▴</span>
      </button>
      <div class="welit-promo-dock__body" id="welit-promo-details" hidden>
        <h2>言點教育 Welit Education</h2>
        <p><strong>服務內容：</strong>小學中、英、數專科班；升中面試班；中學專科補習（中、英、數、科學）；高中地理、經濟（ECON）、物理（PHY）、化學（CHEM）。</p>
        <p>涵蓋初中（中一至中三）基礎鞏固，以及高中香港中學文憑考試（DSE）的應試技巧、題型突破與時間管理訓練。</p>
        <p><strong>特色教學：</strong>採用小班教學、系統化教材與定期評估，並支援特殊教育需要（SEN）教學。</p>
        <div class="welit-promo-dock__tags" aria-label="課程特色">
          <span class="welit-promo-dock__tag">小班教學</span><span class="welit-promo-dock__tag">系統化教材</span><span class="welit-promo-dock__tag">定期評估</span><span class="welit-promo-dock__tag">SEN 教學支援</span>
        </div>
        <div class="welit-promo-dock__actions">
          <a class="welit-promo-dock__whatsapp" href="https://wa.me/85267481044" target="_blank" rel="noopener noreferrer">WhatsApp：6748 1044</a>
          <a class="welit-promo-dock__address" href="https://www.google.com/maps/search/?api=1&query=%E9%A6%99%E6%B8%AF%E8%8D%83%E7%81%A3%E5%8D%97%E8%B1%90%E4%B8%AD%E5%BF%831609B%E5%AE%A4" target="_blank" rel="noopener noreferrer">香港荃灣南豐中心 1609B 室</a>
        </div>
      </div>`;
    const toggle = dock.querySelector('.welit-promo-dock__toggle');
    const details = dock.querySelector('#welit-promo-details');
    const hint = dock.querySelector('.welit-promo-dock__hint');
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!expanded));
      details.hidden = expanded;
      dock.classList.toggle('is-open', !expanded);
      hint.textContent = expanded ? '展開課程資料 ▴' : '收合課程資料 ▾';
    });
    document.body.appendChild(dock);
  }

  function showLockModal(message) {
    const existing = document.querySelector('.welit-lock-modal');
    if (existing) return;
    const modal = document.createElement('div');
    modal.className = 'welit-lock-modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-labelledby', 'welit-lock-title');
    modal.innerHTML = `
      <div class="welit-lock-modal__card">
        ${brandMark()}
        <h2 id="welit-lock-title">此內容已鎖定</h2>
        <p>${message || '這是言點教育完整課程的內容。公開試用版只開放指定題目。'}</p>
        <div class="welit-lock-modal__actions">
          <button class="welit-lock-modal__close" type="button">我知道了</button>
          <a class="welit-lock-modal__home" href="index.html">返回試用首頁</a>
        </div>
      </div>`;
    modal.querySelector('.welit-lock-modal__close').addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (event) => { if (event.target === modal) modal.remove(); });
    document.body.appendChild(modal);
    modal.querySelector('.welit-lock-modal__close').focus();
  }

  function isQuestionTile(button) {
    const rawText = button.textContent.replace(/[✅❌#]/g, '').trim();
    const aria = button.getAttribute('aria-label') || '';
    return /^\d+$/.test(rawText) || /第\s*\d+\s*題/.test(aria);
  }

  function isEntryButton(button) {
    const handler = button.getAttribute('onclick') || '';
    return /(?:window\.)?start[A-Za-z]+\(\s*\d+/.test(handler);
  }

  function lockButton(button, message) {
    if (!button || button.dataset.welitLocked === 'true') return;
    const compact = isQuestionTile(button);
    button.dataset.welitLocked = 'true';
    button.removeAttribute('onclick');
    button.setAttribute('type', 'button');
    button.setAttribute('aria-label', '已鎖定：言點教育公開試用版以外內容');
    button.classList.add('welit-locked');
    if (compact) button.classList.add('welit-lock-tile');
    button.innerHTML = `
      <span class="welit-locked__content">
        ${brandMark()}
        <span class="welit-lock-copy">🔒 完整版內容</span>
      </span>`;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      showLockModal(message || '這是言點教育完整課程的內容。公開試用版只開放指定題目。');
    });
  }

  function addTrialBanner(root) {
    if (!root || root.querySelector(':scope > .welit-trial-banner')) return;
    const banner = document.createElement('div');
    banner.className = 'welit-trial-banner';
    banner.innerHTML = `${brandMark()}<br><strong>${rule.label}公開試用：</strong>每個範疇只開放首 ${rule.subtopics} 個小範疇，每個小範疇只可試做首 ${rule.questions} 題。其餘內容已保留並鎖定。`;
    root.prepend(banner);
  }

  function entryButtons(root) {
    return [...root.querySelectorAll('button[onclick]')].filter(isEntryButton);
  }

  function applyLimitToDirectory(root) {
    if (!root || !rule) return;
    const sections = [...root.querySelectorAll(':scope > section')];
    const rootEntries = entryButtons(root);
    if (!rootEntries.length && !sections.length) return;
    addTrialBanner(root);

    if (!sections.length) {
      rootEntries.forEach((button, index) => {
        if (index >= rule.subtopics) lockButton(button);
      });
      return;
    }

    const firstEntry = rootEntries[0];
    const sectionUsesQuestionTiles = firstEntry && isQuestionTile(firstEntry);
    if (sectionUsesQuestionTiles) {
      sections.forEach((section, sectionIndex) => {
        const entries = entryButtons(section);
        entries.forEach((button, questionIndex) => {
          if (sectionIndex >= rule.subtopics || questionIndex >= rule.questions) lockButton(button);
        });
      });
      return;
    }

    sections.forEach((section) => {
      entryButtons(section).forEach((button, subtopicIndex) => {
        if (subtopicIndex >= rule.subtopics) lockButton(button);
      });
    });
  }

  function applyDirectoryLimits() {
    const selectors = [
      '#directory-content', '#poem-content', '#culture-content', '#listen-content', '#speak-content',
      '#seq-content', '#framework-content', '#expand-content', '#expo-content', '#trans-content'
    ];
    selectors.forEach((selector) => document.querySelectorAll(selector).forEach(applyLimitToDirectory));
  }

  function showFlowLock(playArea) {
    if (!playArea || playArea.dataset.welitFlowLocked === 'true') return;
    playArea.dataset.welitFlowLocked = 'true';
    playArea.innerHTML = `
      <section class="welit-flow-lock" aria-labelledby="welit-flow-lock-title">
        ${brandMark()}
        <h2 id="welit-flow-lock-title">已完成公開試用題目</h2>
        <p>${rule.label}每個小範疇只開放首 ${rule.questions} 題。其餘練習已鎖定，歡迎向言點教育了解完整課程。</p>
        <a href="${fileName}">返回本頁目錄</a>
      </section>`;
  }

  function enforceQuestionLimit() {
    if (!rule || /^(word|sentence|paragraph|rhetoric)_/.test(fileName)) return;
    const playAreas = [...document.querySelectorAll('[id$="-play"], #quest-play')];
    playAreas.forEach((playArea) => {
      if (playArea.dataset.welitFlowLocked === 'true') return;
      const match = playArea.textContent.match(/第\s*(\d+)\s*\/\s*(\d+)\s*題/);
      if (match && Number(match[1]) > rule.questions) showFlowLock(playArea);
    });
  }

  function interceptQuestionNext() {
    if (!rule) return;
    let questionCount = 1;
    document.addEventListener('click', (event) => {
      const button = event.target.closest('button');
      if (!button) return;
      if (isEntryButton(button)) {
        questionCount = 1;
        return;
      }
      const label = button.textContent.replace(/\s+/g, '');
      if (!/下一題|下一篇/.test(label)) return;
      if (questionCount >= rule.questions) {
        event.preventDefault();
        event.stopImmediatePropagation();
        showLockModal(`${rule.label}每個小範疇只開放首 ${rule.questions} 題；其餘練習已鎖定。`);
        return;
      }
      questionCount += 1;
    }, true);
  }

  function lockAdvancedPage() {
    document.body.className = 'min-h-[100dvh] bg-slate-950 text-slate-800';
    document.body.innerHTML = `
      <main class="min-h-[100dvh] grid place-items-center px-4 py-10" style="background: radial-gradient(circle at top, #1e3a8a 0, #0f172a 52%, #020617 100%);">
        <section class="w-full max-w-xl rounded-3xl border border-white/20 bg-white p-8 text-center shadow-2xl md:p-12">
          ${brandMark()}
          <div class="mt-8 text-6xl" aria-hidden="true">🔒</div>
          <h1 class="mt-5 text-3xl font-black text-slate-900 md:text-4xl">拔尖版已鎖定</h1>
          <p class="mx-auto mt-4 max-w-md text-lg font-bold leading-relaxed text-slate-600">這是言點教育的完整進階課程內容。公開試用網站不提供拔尖版練習。</p>
          <a href="index.html" class="mt-8 inline-flex min-h-12 items-center rounded-xl bg-teal-700 px-6 py-3 font-black text-white no-underline shadow-lg transition hover:bg-teal-800">返回公開試用首頁</a>
        </section>
      </main>`;
  }

  function setupHomePage() {
    document.title = '言點教育 Welit Education｜小學中國語文公開試用';
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = '言點教育 Welit Education 小學中國語文公開試用題庫：免登入、免密碼、無資料儲存。';
    const heading = document.querySelector('header h1');
    if (heading) heading.textContent = '言點教育 Welit Education';
    const subheading = document.querySelector('header h1 + p');
    if (subheading) subheading.textContent = '小學中國語文公開試用題庫';
    const notice = document.querySelector('header p:last-child');
    if (notice) notice.textContent = '公開網站，毋須登入、密碼或帳戶。學生資料及作答紀錄不會儲存；本網站只提供精選試用題目。';
    const info = document.querySelector('#course-heading + p');
    if (info) info.textContent = '補底版每個範疇開放首 3 個小範疇、每個小範疇首 5 題；標準版開放首 2 個小範疇、每個小範疇首 3 題。拔尖版內容已保留並鎖定。';
    document.querySelectorAll('button[onclick*="_advanced.html"]').forEach((button) => {
      lockButton(button, '拔尖版是言點教育完整課程內容，公開試用版不提供此部分練習。');
    });
    const footer = document.querySelector('footer');
    if (footer) footer.textContent = '言點教育 Welit Education・公開試用版';
  }

  function initialise() {
    if (levelMatch && levelMatch[1] === 'advanced') {
      lockAdvancedPage();
      setupPromotions();
      return;
    }
    if (fileName === 'index.html' || fileName === '') {
      setupHomePage();
      setupPromotions();
      return;
    }
    if (!rule) {
      setupPromotions();
      return;
    }
    applyDirectoryLimits();
    enforceQuestionLimit();
    interceptQuestionNext();
    let scheduled = false;
    const scheduleApply = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        applyDirectoryLimits();
        enforceQuestionLimit();
      });
    };
    new MutationObserver(scheduleApply).observe(document.body, { childList: true, subtree: true });
    setupPromotions();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initialise, { once: true });
  } else {
    initialise();
  }
})();
