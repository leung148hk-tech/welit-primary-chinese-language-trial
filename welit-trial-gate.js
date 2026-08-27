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
    :root { --welit-promo-top: 2.9rem; --welit-promo-bottom: 4.35rem; }
    body.welit-promo-ready { padding-top: var(--welit-promo-top) !important; padding-bottom: var(--welit-promo-bottom) !important; }
    .welit-promo-top { position: fixed; inset: 0 0 auto; z-index: 12000; display: flex; min-height: var(--welit-promo-top); align-items: stretch; overflow: hidden; background: linear-gradient(105deg, #0b1220 0%, #0f766e 48%, #1d4ed8 100%); color: #fff; box-shadow: 0 6px 20px rgba(15,23,42,.28); }
    .welit-promo-top::before { position: absolute; inset: 0; content: ''; opacity: .38; background-image: radial-gradient(circle at 18% 25%, rgba(94,234,212,.8) 0 1px, transparent 1.5px), radial-gradient(circle at 82% 60%, rgba(191,219,254,.8) 0 1px, transparent 1.5px); background-size: 12px 12px, 18px 18px; pointer-events: none; }
    .welit-promo-marquee { z-index: 1; min-width: 0; flex: 1; overflow: hidden; }
    .welit-promo-track { display: flex; width: max-content; min-height: var(--welit-promo-top); align-items: center; animation: welit-marquee 28s linear infinite; white-space: nowrap; }
    .welit-promo-top:hover .welit-promo-track, .welit-promo-top:focus-within .welit-promo-track { animation-play-state: paused; }
    .welit-promo-message { display: inline-flex; align-items: center; gap: .6rem; padding-right: 3rem; font-size: .92rem; font-weight: 850; letter-spacing: .01em; }
    .welit-promo-message strong { color: #fef08a; }
    .welit-promo-cta { z-index: 2; display: inline-flex; flex: 0 0 auto; align-items: center; justify-content: center; margin: .36rem .45rem .36rem 0; border: 1px solid rgba(255,255,255,.45); border-radius: .65rem; padding: .55rem .85rem; background: rgba(255,255,255,.16); color: #fff; font-size: .76rem; font-weight: 900; text-decoration: none; white-space: nowrap; backdrop-filter: blur(8px); }
    .welit-promo-cta:hover, .welit-promo-cta:focus-visible { background: rgba(255,255,255,.29); }
    @keyframes welit-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
    .welit-promo-dock { position: fixed; z-index: 12000; right: 0; bottom: 0; left: 0; max-height: calc(var(--welit-promo-bottom) + env(safe-area-inset-bottom)); overflow: hidden; border-top: 1px solid rgba(94,234,212,.5); background: #081b2d; box-shadow: 0 -10px 30px rgba(15,23,42,.23); transition: max-height .38s cubic-bezier(.2,.8,.2,1); }
    .welit-promo-dock::before { position: absolute; inset: 0; content: ''; opacity: .72; background: radial-gradient(circle at 10% 0%, rgba(45,212,191,.23), transparent 36%), radial-gradient(circle at 88% 38%, rgba(96,165,250,.25), transparent 30%); pointer-events: none; }
    .welit-promo-dock.is-open { max-height: min(42rem, 82dvh); overflow-y: auto; }
    .welit-promo-dock__compact { position: relative; z-index: 1; display: flex; min-height: var(--welit-promo-bottom); align-items: stretch; padding: .38rem .55rem calc(.38rem + env(safe-area-inset-bottom)); }
    .welit-promo-dock__toggle { display: flex; min-width: 0; flex: 1; align-items: center; justify-content: space-between; gap: .7rem; border: 0; border-radius: .8rem; background: transparent; color: #fff; padding: .5rem .65rem; text-align: left; }
    .welit-promo-dock__toggle:hover { background: rgba(255,255,255,.08); }
    .welit-promo-dock__label { display: flex; min-width: 0; align-items: center; gap: .62rem; font-size: .92rem; font-weight: 900; letter-spacing: .01em; }
    .welit-promo-dock__badge { display: inline-flex; height: 2.15rem; width: 2.15rem; flex: 0 0 auto; align-items: center; justify-content: center; border: 1px solid rgba(255,255,255,.48); border-radius: .72rem; background: linear-gradient(135deg, #14b8a6, #2563eb); color: #fff; box-shadow: 0 6px 16px rgba(15,23,42,.28); font-size: .95rem; }
    .welit-promo-dock__title { display: flex; flex-direction: column; gap: .08rem; }
    .welit-promo-dock__title small { color: #99f6e4; font-size: .65rem; font-weight: 800; letter-spacing: .11em; }
    .welit-promo-dock__hint { color: #99f6e4; font-size: .74rem; font-weight: 850; white-space: nowrap; }
    .welit-promo-dock__quick-cta { z-index: 1; display: inline-flex; min-width: 7rem; align-items: center; justify-content: center; border-radius: .75rem; background: linear-gradient(135deg, #facc15, #f59e0b); color: #422006; padding: .4rem .72rem; font-size: .77rem; font-weight: 950; text-decoration: none; box-shadow: 0 7px 16px rgba(0,0,0,.22); }
    .welit-promo-dock__quick-cta:hover { filter: brightness(1.08); transform: translateY(-1px); }
    .welit-promo-dock__body { position: relative; z-index: 1; border-top: 1px solid rgba(153,246,228,.25); padding: 1.05rem 1rem calc(1.15rem + env(safe-area-inset-bottom)); color: #e2e8f0; }
    .welit-promo-dock__hero { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 1rem; align-items: end; max-width: 78rem; margin: 0 auto; }
    .welit-promo-dock__eyebrow { margin: 0; color: #99f6e4; font-size: .72rem; font-weight: 900; letter-spacing: .13em; }
    .welit-promo-dock__body h2 { margin: .25rem 0 0; color: #fff; font-size: clamp(1.35rem, 3vw, 2rem); font-weight: 950; line-height: 1.17; }
    .welit-promo-dock__body h2 span { color: #fef08a; }
    .welit-promo-dock__intro { max-width: 45rem; margin: .45rem 0 0; color: #dbeafe; font-size: .9rem; font-weight: 600; line-height: 1.65; }
    .welit-promo-dock__hero-cta { display: inline-flex; min-height: 3.2rem; align-items: center; justify-content: center; border-radius: .9rem; background: linear-gradient(135deg, #facc15, #f59e0b); color: #422006; padding: .75rem 1rem; font-size: .92rem; font-weight: 950; text-decoration: none; box-shadow: 0 10px 22px rgba(0,0,0,.24); }
    .welit-promo-dock__hero-cta:hover { transform: translateY(-2px); filter: brightness(1.07); }
    .welit-promo-dock__course-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: .65rem; max-width: 78rem; margin: 1rem auto 0; }
    .welit-promo-course { min-width: 0; border: 1px solid rgba(148,163,184,.35); border-radius: .95rem; background: rgba(15,23,42,.42); padding: .8rem; }
    .welit-promo-course__icon { display: inline-flex; height: 1.8rem; width: 1.8rem; align-items: center; justify-content: center; border-radius: .6rem; background: rgba(45,212,191,.17); color: #99f6e4; font-size: .85rem; font-weight: 900; }
    .welit-promo-course h3 { margin: .45rem 0 0; color: #fff; font-size: .85rem; font-weight: 900; }
    .welit-promo-course p { margin: .3rem 0 0; color: #cbd5e1; font-size: .72rem; font-weight: 600; line-height: 1.55; }
    .welit-promo-dock__footer { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: .75rem; max-width: 78rem; margin: .9rem auto 0; border-top: 1px solid rgba(148,163,184,.25); padding-top: .9rem; }
    .welit-promo-dock__location { margin: 0; color: #cbd5e1; font-size: .76rem; font-weight: 700; }
    .welit-promo-dock__location strong { color: #fef08a; }
    .welit-promo-dock__address { display: inline-flex; min-height: 2.35rem; align-items: center; justify-content: center; border: 1px solid rgba(191,219,254,.5); border-radius: .7rem; background: rgba(255,255,255,.08); color: #fff; padding: .45rem .75rem; font-size: .77rem; font-weight: 850; text-decoration: none; }
    .welit-promo-dock__address:hover { background: rgba(255,255,255,.16); }
    @media (max-width: 720px) { :root { --welit-promo-bottom: 4.15rem; } .welit-promo-message { padding-right: 2rem; font-size: .73rem; } .welit-promo-cta { margin-right: .25rem; padding: .45rem .55rem; font-size: .65rem; } .welit-promo-dock__compact { padding-inline: .35rem; } .welit-promo-dock__toggle { padding-inline: .38rem; } .welit-promo-dock__hint { display: none; } .welit-promo-dock__quick-cta { min-width: 6.65rem; padding-inline: .5rem; font-size: .7rem; } .welit-promo-dock__hero { grid-template-columns: 1fr; gap: .75rem; } .welit-promo-dock__hero-cta { width: 100%; } .welit-promo-dock__course-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .5rem; } .welit-promo-dock__body { padding-inline: .75rem; } }
    @media (max-width: 380px) { .welit-promo-dock__title small { display: none; } .welit-promo-dock__quick-cta { min-width: 5.6rem; font-size: .64rem; } .welit-promo-dock__label { font-size: .8rem; } }
    @media (prefers-reduced-motion: reduce) { .welit-promo-track { animation: none; transform: none; } .welit-promo-dock__quick-cta:hover, .welit-promo-dock__hero-cta:hover { transform: none; } }
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
      <div class="welit-promo-dock__compact">
        <button class="welit-promo-dock__toggle" type="button" aria-expanded="false" aria-controls="welit-promo-details">
          <span class="welit-promo-dock__label">
            <span class="welit-promo-dock__badge" aria-hidden="true">W</span>
            <span class="welit-promo-dock__title"><small>WELIT EDUCATION</small>關注言點教育課程</span>
          </span>
          <span class="welit-promo-dock__hint">展開課程資料 ▴</span>
        </button>
        <a class="welit-promo-dock__quick-cta" href="https://wa.me/85267481044" target="_blank" rel="noopener noreferrer">立即 WhatsApp 報名</a>
      </div>
      <section class="welit-promo-dock__body" id="welit-promo-details" hidden>
        <div class="welit-promo-dock__hero">
          <div>
            <p class="welit-promo-dock__eyebrow">WELIT EDUCATION · 小班專科教育</p>
            <h2>把學習的壓力，<span>變成孩子的自信。</span></h2>
            <p class="welit-promo-dock__intro">由小學基礎鞏固到 DSE 應試訓練，言點教育以系統化教材與貼身支援，陪學生逐步突破學習難關。</p>
          </div>
          <a class="welit-promo-dock__hero-cta" href="https://wa.me/85267481044" target="_blank" rel="noopener noreferrer">WhatsApp 查詢課程 →</a>
        </div>
        <div class="welit-promo-dock__course-grid" aria-label="言點教育課程服務">
          <article class="welit-promo-course"><span class="welit-promo-course__icon" aria-hidden="true">01</span><h3>小學專科班</h3><p>中、英、數專科班，聚焦基礎鞏固與學習習慣。</p></article>
          <article class="welit-promo-course"><span class="welit-promo-course__icon" aria-hidden="true">02</span><h3>升中面試班</h3><p>建立表達、自信與面試應對能力，迎接升中挑戰。</p></article>
          <article class="welit-promo-course"><span class="welit-promo-course__icon" aria-hidden="true">03</span><h3>中學至高中</h3><p>中、英、數、科學，以及地理、ECON、PHY、CHEM。</p></article>
          <article class="welit-promo-course"><span class="welit-promo-course__icon" aria-hidden="true">04</span><h3>DSE 與特色支援</h3><p>題型突破、時間管理；小班教學、定期評估及 SEN 支援。</p></article>
        </div>
        <div class="welit-promo-dock__footer">
          <p class="welit-promo-dock__location"><strong>言點教育中文專科班</strong>｜香港荃灣南豐中心 1609B 室</p>
          <a class="welit-promo-dock__address" href="https://www.google.com/maps/search/?api=1&query=%E9%A6%99%E6%B8%AF%E8%8D%83%E7%81%A3%E5%8D%97%E8%B1%90%E4%B8%AD%E5%BF%831609B%E5%AE%A4" target="_blank" rel="noopener noreferrer">查看地址及路線</a>
        </div>
      </section>`;
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
