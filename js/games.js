(function () {
  var stop = null; // cleanup for the active game

  function minesweeper(box) {
    var W = 9, H = 9, M = 10, cells, over, opened;
    var info = document.createElement('div'), grid = document.createElement('div'), reset = document.createElement('button');
    reset.className = 'dv-btn'; reset.textContent = 'New game';
    grid.className = 'dv-mines'; grid.style.gridTemplateColumns = 'repeat(' + W + ', 28px)';
    box.append(info, reset, grid);

    function nb(i) {
      var x = i % W, y = (i / W) | 0, r = [];
      for (var dy = -1; dy <= 1; dy++) for (var dx = -1; dx <= 1; dx++) {
        var nx = x + dx, ny = y + dy;
        if ((dx || dy) && nx >= 0 && ny >= 0 && nx < W && ny < H) r.push(ny * W + nx);
      }
      return r;
    }
    function start() {
      over = false; opened = 0; grid.innerHTML = ''; info.textContent = 'Click to dig, right-click / long-press to flag. ' + M + ' bugs hidden.';
      cells = [];
      var bombs = {};
      while (Object.keys(bombs).length < M) bombs[(Math.random() * W * H) | 0] = 1;
      for (var i = 0; i < W * H; i++) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = 'dv-cell';
        cells.push({ el: b, bomb: !!bombs[i], open: false, flag: false });
        (function (i) {
          b.addEventListener('click', function () { dig(i); });
          b.addEventListener('contextmenu', function (e) { e.preventDefault(); flag(i); });
          var lp; b.addEventListener('touchstart', function () { lp = setTimeout(function () { flag(i); lp = 'x'; }, 450); });
          b.addEventListener('touchend', function (e) { if (lp === 'x') e.preventDefault(); clearTimeout(lp); });
        })(i);
        grid.appendChild(b);
      }
    }
    function flag(i) { var c = cells[i]; if (over || c.open) return; c.flag = !c.flag; c.el.textContent = c.flag ? '⚑' : ''; }
    function dig(i) {
      var c = cells[i];
      if (over || c.open || c.flag) return;
      c.open = true; c.el.classList.add('open'); opened++;
      if (c.bomb) {
        over = true; c.el.classList.add('bomb');
        cells.forEach(function (x) { if (x.bomb) x.el.textContent = '🐞'; });
        info.textContent = 'Production is down. Rollback and try again.'; return;
      }
      var n = nb(i).filter(function (j) { return cells[j].bomb; }).length;
      c.el.textContent = n || '';
      if (!n) nb(i).forEach(dig);
      if (opened === W * H - M) { over = true; info.textContent = 'Zero bugs. Ship it! 🚀'; }
    }
    reset.addEventListener('click', start);
    start();
  }

  var QUIZ = [
    ['Which command applies a Terraform plan?', ['terraform apply', 'terraform run', 'terraform push', 'terraform build'], 0],
    ['What does kubectl get pods list?', ['Nodes', 'Running Pods', 'Secrets', 'Namespaces only'], 1],
    ['Which tool is a GitOps controller for Kubernetes?', ['Jenkins', 'ArgoCD', 'Ansible', 'Splunk'], 1],
    ['HTTP status for "Service Unavailable"?', ['404', '418', '503', '301'], 2],
    ['What does KEDA scale on?', ['Events', 'Disk size', 'DNS', 'Git commits'], 0],
    ['In Helm, a packaged app is called a...', ['Chart', 'Pod', 'Module', 'Playbook'], 0]
  ];
  function quiz(box) {
    var i = 0, score = 0;
    (function show() {
      box.innerHTML = '';
      if (i >= QUIZ.length) { box.textContent = 'Score: ' + score + '/' + QUIZ.length + (score === QUIZ.length ? ' — Staff engineer material!' : ''); var b = document.createElement('button'); b.className = 'dv-btn'; b.textContent = 'Play again'; b.style.display = 'block'; b.style.marginTop = '12px'; b.onclick = function () { i = 0; score = 0; show(); }; box.appendChild(b); return; }
      var q = QUIZ[i], h = document.createElement('div');
      h.textContent = (i + 1) + '/' + QUIZ.length + '  ' + q[0]; h.style.marginBottom = '8px'; box.appendChild(h);
      q[1].forEach(function (o, k) {
        var b = document.createElement('button'); b.className = 'dv-quiz-opt'; b.textContent = o;
        b.onclick = function () {
          var all = box.querySelectorAll('.dv-quiz-opt');
          all.forEach(function (x) { x.disabled = true; });
          all[q[2]].classList.add('ok'); if (k !== q[2]) b.classList.add('bad'); else score++;
          setTimeout(function () { i++; show(); }, 800);
        };
        box.appendChild(b);
      });
    })();
  }

  function pods(box) {
    var score = 0, left = 30, up = -1, timers = [];
    var info = document.createElement('div'), grid = document.createElement('div'), go = document.createElement('button');
    grid.className = 'dv-pods'; go.className = 'dv-btn'; go.textContent = 'Start'; go.style.marginTop = '12px';
    info.textContent = 'Whack the crashing pods! Score 0 · 30s';
    var els = [];
    for (var k = 0; k < 9; k++) {
      var p = document.createElement('button'); p.className = 'dv-pod'; p.type = 'button'; p.setAttribute('aria-label', 'pod');
      (function (k) { p.onclick = function () { if (k === up) { score++; up = -1; els[k].classList.remove('up'); els[k].textContent = ''; info.textContent = 'Score ' + score + ' · ' + left + 's'; } }; })(k);
      els.push(p); grid.appendChild(p);
    }
    box.append(info, grid, go);
    function clear() { timers.forEach(clearInterval); timers = []; if (up >= 0) { els[up].classList.remove('up'); els[up].textContent = ''; } up = -1; }
    go.onclick = function () {
      clear(); score = 0; left = 30; info.textContent = 'Score 0 · 30s';
      timers.push(setInterval(function () {
        if (up >= 0) { els[up].classList.remove('up'); els[up].textContent = ''; }
        up = (Math.random() * 9) | 0; els[up].classList.add('up'); els[up].textContent = '💥';
      }, 700));
      timers.push(setInterval(function () {
        left--; info.textContent = 'Score ' + score + ' · ' + left + 's';
        if (left <= 0) { clear(); info.textContent = 'Time! Final score: ' + score; }
      }, 1000));
    };
    stop = clear;
  }

  var GAMES = [['Minesweeper', minesweeper], ['DevOps Quiz', quiz], ['Whack-a-Pod', pods]];

  DevOS.register('games', {
    title: 'Games', icon: '🎮',
    onClose: function () { if (stop) { stop(); stop = null; } },
    build: function (body) {
      var tabs = document.createElement('div'), box = document.createElement('div');
      tabs.className = 'dv-tabs'; box.className = 'dv-game';
      body.append(tabs, box);
      function pick(idx) {
        if (stop) { stop(); stop = null; }
        box.innerHTML = '';
        Array.prototype.forEach.call(tabs.children, function (t, j) { t.classList.toggle('on', j === idx); });
        GAMES[idx][1](box);
      }
      GAMES.forEach(function (g, idx) {
        var b = document.createElement('button'); b.type = 'button'; b.textContent = g[0]; b.onclick = function () { pick(idx); };
        tabs.appendChild(b);
      });
      pick(0);
    }
  });
})();
