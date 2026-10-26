(function () {
  var KEY = 'dv-booted';
  try { if (sessionStorage.getItem(KEY)) return; } catch (e) {}
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var D = window.DEVOS_DATA;
  var lines = [
    '[  OK  ] Loading kernel modules',
    '[  OK  ] Mounting /dev/portfolio',
    '[  OK  ] Starting kubelet.service',
    '[  OK  ] terraform apply -auto-approve ... 0 errors',
    '[  OK  ] Reached target Cloud Reliability',
    '[  OK  ] Welcome, ' + (D ? D.name : 'visitor')
  ];
  var el = document.createElement('div');
  el.id = 'dv-boot';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', 'Boot screen');
  el.innerHTML = '<div class="dv-skip">click / Esc to skip</div><div class="dv-title">aman.cloud OS v1.0</div><pre></pre><div class="dv-prompt dv-hidden">Press Enter or click to continue</div>';
  document.body.appendChild(el);
  var pre = el.querySelector('pre'), prompt = el.querySelector('.dv-prompt');
  var done = false, i = 0, timer;

  function finish() {
    if (done) return; done = true; clearTimeout(timer);
    try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
    document.removeEventListener('keydown', onKey);
    el.classList.add('dv-out');
    setTimeout(function () { el.remove(); }, 600);
  }
  function onKey(e) { if (e.key === 'Enter' || e.key === 'Escape' || e.key === ' ') finish(); }
  function step() {
    if (i < lines.length) { pre.textContent += lines[i++] + '\n'; timer = setTimeout(step, reduce ? 0 : 280); }
    else prompt.classList.remove('dv-hidden');
  }
  el.addEventListener('click', finish);
  document.addEventListener('keydown', onKey);
  step();
})();
