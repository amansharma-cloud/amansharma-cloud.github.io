(function () {
  var D = window.DEVOS_DATA;
  var sec = document.createElement('section');
  sec.id = 'dv-exp';
  sec.innerHTML = '<h2>Time in the trenches <span>⏱</span></h2><div class="dv-timer" role="timer" aria-label="Time since career start"></div><div class="dv-skills"></div>';
  var timer = sec.querySelector('.dv-timer'), skills = sec.querySelector('.dv-skills');

  var units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
  timer.innerHTML = units.map(function (u) { return '<div class="dv-tcell"><b data-u="' + u + '">0</b><small>' + u + '</small></div>'; }).join('');
  var cells = {};
  units.forEach(function (u) { cells[u] = timer.querySelector('[data-u="' + u + '"]'); });

  function tick() {
    var s = new Date(D.careerStart), n = new Date();
    var y = n.getFullYear() - s.getFullYear(), mo = n.getMonth() - s.getMonth(), d = n.getDate() - s.getDate();
    var h = n.getHours() - s.getHours(), mi = n.getMinutes() - s.getMinutes(), se = n.getSeconds() - s.getSeconds();
    if (se < 0) { se += 60; mi--; }
    if (mi < 0) { mi += 60; h--; }
    if (h < 0) { h += 24; d--; }
    if (d < 0) { d += new Date(n.getFullYear(), n.getMonth(), 0).getDate(); mo--; }
    if (mo < 0) { mo += 12; y--; }
    var v = { years: y, months: mo, days: d, hours: h, minutes: mi, seconds: se };
    units.forEach(function (u) { cells[u].textContent = v[u]; });
  }
  tick(); setInterval(tick, 1000);

  D.skills.forEach(function (s) {
    var r = document.createElement('div');
    r.className = 'dv-skill';
    r.innerHTML = '<div class="dv-skill-head"><span></span><span>' + s.pct + '%</span></div><div class="dv-track"><div class="dv-fill" data-pct="' + s.pct + '"></div></div>';
    r.querySelector('span').textContent = s.name;
    skills.appendChild(r);
  });

  var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.querySelectorAll('.dv-fill').forEach(function (f) { f.style.width = f.dataset.pct + '%'; });
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 }) : null;
  if (io) io.observe(skills); else skills.querySelectorAll('.dv-fill').forEach(function (f) { f.style.width = f.dataset.pct + '%'; });

  // The main page is rendered by the x-dc runtime, so wait for the footer before inserting.
  // It may re-render and drop foreign nodes, so re-insert whenever we go missing.
  function place() {
    var anchor = document.getElementById('contact');
    if (anchor && anchor.parentNode && !(sec.parentNode === anchor.parentNode && sec.nextElementSibling === anchor)) {
      anchor.parentNode.insertBefore(sec, anchor);
    }
  }
  place();
  new MutationObserver(place).observe(document.body, { childList: true, subtree: true });

  DevOS.register('exp', {
    title: 'Experience', icon: '⏱',
    build: function (body) {
      body.innerHTML = '<div>Jump to the experience &amp; skills section.</div>';
      var b = document.createElement('button'); b.className = 'dv-btn'; b.textContent = 'Scroll there';
      b.style.marginTop = '10px';
      b.addEventListener('click', function () { sec.scrollIntoView({ behavior: 'smooth' }); });
      body.appendChild(b);
    }
  });
})();
