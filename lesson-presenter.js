/* Lesson Presenter
 * Opens lesson cards in a full-screen presentation overlay.
 * This file is intentionally standalone so it does not alter existing lesson data.
 */
(function () {
  'use strict';

  function textFrom(el) {
    return el ? (el.innerText || el.textContent || '').trim() : '';
  }

  function createPresenter() {
    if (document.getElementById('lesson-presenter-overlay')) return;

    const overlay = document.createElement('div');
    overlay.id = 'lesson-presenter-overlay';
    overlay.innerHTML = `
      <div class="lesson-presenter-backdrop"></div>
      <section class="lesson-presenter-panel" role="dialog" aria-modal="true" aria-label="Lição">
        <header class="lesson-presenter-header">
          <button type="button" class="lesson-presenter-close" aria-label="Fechar">×</button>
          <div class="lesson-presenter-title"></div>
        </header>
        <main class="lesson-presenter-content"></main>
      </section>`;

    const style = document.createElement('style');
    style.textContent = `
      #lesson-presenter-overlay{position:fixed;inset:0;z-index:2147483647;display:none}
      #lesson-presenter-overlay.open{display:block}
      .lesson-presenter-backdrop{position:absolute;inset:0;background:rgba(0,0,0,.78);backdrop-filter:blur(5px)}
      .lesson-presenter-panel{position:relative;width:min(1100px,94vw);height:min(92vh,900px);margin:4vh auto;background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 20px 70px rgba(0,0,0,.45);display:flex;flex-direction:column}
      .lesson-presenter-header{display:flex;align-items:center;gap:16px;padding:14px 18px;border-bottom:1px solid #ddd;background:#fff;flex:0 0 auto}
      .lesson-presenter-title{font-size:20px;font-weight:700;flex:1}
      .lesson-presenter-close{border:0;background:transparent;font-size:34px;line-height:1;cursor:pointer;padding:2px 10px;border-radius:10px}
      .lesson-presenter-close:hover{background:#eee}
      .lesson-presenter-content{overflow:auto;padding:28px;flex:1;font-size:18px;line-height:1.65}
      .lesson-presenter-content img{max-width:100%;height:auto}
      .lesson-presenter-content table{max-width:100%;overflow:auto;display:block}
      body.lesson-presenter-open{overflow:hidden}
      @media(max-width:600px){.lesson-presenter-panel{width:100vw;height:100vh;margin:0;border-radius:0}.lesson-presenter-content{padding:18px;font-size:16px}.lesson-presenter-title{font-size:17px}}
    `;
    document.head.appendChild(style);
    document.body.appendChild(overlay);

    const close = () => { overlay.classList.remove('open'); document.body.classList.remove('lesson-presenter-open'); };
    overlay.querySelector('.lesson-presenter-close').addEventListener('click', close);
    overlay.querySelector('.lesson-presenter-backdrop').addEventListener('click', close);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && overlay.classList.contains('open')) close(); });
  }

  function openLesson(source) {
    createPresenter();
    const overlay = document.getElementById('lesson-presenter-overlay');
    const title = overlay.querySelector('.lesson-presenter-title');
    const content = overlay.querySelector('.lesson-presenter-content');
    const heading = source.querySelector('h1,h2,h3,h4,h5,h6,[class*="title"],[class*="name"]');
    title.textContent = textFrom(heading) || textFrom(source).slice(0,120) || 'Lição';
    content.innerHTML = source.outerHTML;
    content.querySelectorAll('button,a').forEach(el => {
      if (el !== source) el.addEventListener('click', e => e.stopPropagation());
    });
    overlay.classList.add('open');
    document.body.classList.add('lesson-presenter-open');
  }

  document.addEventListener('click', function (e) {
    const target = e.target.closest('[data-lesson], .lesson, .lesson-card, .lesson-item, [class*="lesson-card"], [class*="lesson-item"]');
    if (!target || target.closest('#lesson-presenter-overlay')) return;
    // Only intercept elements that look like lesson entries, avoiding generic containers.
    const label = textFrom(target).toLowerCase();
    if (!label || (!/lição|lesson|aula/.test(label) && !target.dataset.lesson)) return;
    e.preventDefault();
    e.stopPropagation();
    openLesson(target);
  }, true);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createPresenter);
  else createPresenter();
})();
