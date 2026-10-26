// Tiny window manager + dock. Apps register via DevOS.register(id, {title, icon, build(body, win)}).
(function () {
  var apps = {}, open = {}, z = 9100, dock;

  function focus(w) { w.style.zIndex = ++z; }

  function drag(w, bar) {
    var sx, sy, ox, oy, on = false;
    bar.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.dv-dot') || window.innerWidth <= 700) return;
      on = true; sx = e.clientX; sy = e.clientY;
      var r = w.getBoundingClientRect(); ox = r.left; oy = r.top;
      bar.setPointerCapture(e.pointerId); focus(w);
    });
    bar.addEventListener('pointermove', function (e) {
      if (!on) return;
      var x = Math.max(0, Math.min(window.innerWidth - 80, ox + e.clientX - sx));
      var y = Math.max(0, Math.min(window.innerHeight - 40, oy + e.clientY - sy));
      w.style.left = x + 'px'; w.style.top = y + 'px';
    });
    function end() { on = false; }
    bar.addEventListener('pointerup', end);
    bar.addEventListener('pointercancel', end);
  }

  function launch(id) {
    var app = apps[id];
    if (!app) return;
    if (open[id]) { open[id].classList.remove('dv-min'); focus(open[id]); var inp = open[id].querySelector('input'); if (inp) inp.focus(); return; }
    var n = Object.keys(open).length;
    var w = document.createElement('div');
    w.className = 'dv-win';
    w.setAttribute('role', 'dialog');
    w.setAttribute('aria-label', app.title);
    w.style.left = Math.max(8, (window.innerWidth - 640) / 2 + n * 28) + 'px';
    w.style.top = (70 + n * 28) + 'px';
    w.innerHTML = '<div class="dv-bar"><button class="dv-dot close" aria-label="Close"></button><button class="dv-dot min" aria-label="Minimize"></button><div class="dv-wtitle"></div></div><div class="dv-body"></div>';
    w.querySelector('.dv-wtitle').textContent = app.title;
    var close = function () { delete open[id]; w.remove(); if (app.onClose) app.onClose(); };
    w.querySelector('.close').addEventListener('click', close);
    w.querySelector('.min').addEventListener('click', function () { w.classList.toggle('dv-min'); });
    w.addEventListener('pointerdown', function () { focus(w); });
    w.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
    drag(w, w.querySelector('.dv-bar'));
    document.body.appendChild(w);
    open[id] = w; focus(w);
    app.build(w.querySelector('.dv-body'), w);
  }

  function register(id, app) {
    apps[id] = app;
    if (!app.icon) return;
    var b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span class="dv-ico">' + app.icon + '</span><span>' + app.title + '</span>';
    b.addEventListener('click', function () { launch(id); });
    dock.appendChild(b);
  }

  function init() {
    dock = document.createElement('div');
    dock.id = 'dv-dock';
    dock.setAttribute('role', 'toolbar');
    dock.setAttribute('aria-label', 'Apps');
    document.body.appendChild(dock);
  }
  if (document.body) init(); else document.addEventListener('DOMContentLoaded', init);

  window.DevOS = { register: register, launch: launch };
})();
