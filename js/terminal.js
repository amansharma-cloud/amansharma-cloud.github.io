(function () {
  var D = window.DEVOS_DATA;

  function years() {
    var ms = Date.now() - new Date(D.careerStart).getTime();
    return (ms / (365.25 * 864e5)).toFixed(1);
  }

  var commands = {
    help: function () {
      return 'Available commands:\n  about  whoami  skills  experience  projects  certs\n  contact  resume  github  neofetch  games  date\n  theme  echo <text>  history  clear\nTip: Up/Down arrows recall history, Tab completes.';
    },
    whoami: function () { return D.name + ' — ' + D.title; },
    about: function () { return D.about; },
    skills: function () {
      return D.skills.map(function (s) {
        var n = Math.round(s.pct / 5);
        return (s.name + '                                ').slice(0, 32) + '[' + '#'.repeat(n) + '.'.repeat(20 - n) + '] ' + s.pct + '%';
      }).join('\n');
    },
    experience: function () {
      return D.jobs.map(function (j) { return j.period.padEnd(16) + j.role + ' @ ' + j.company; }).join('\n') + '\n\n~' + years() + ' years in DevOps';
    },
    projects: function () { return D.projects.map(function (p) { return ' - ' + p; }).join('\n'); },
    certs: function () { return D.certs.map(function (c) { return ' - ' + c; }).join('\n'); },
    contact: function () { return { html: 'Email:    <a href="mailto:' + D.email + '">' + D.email + '</a>\nLinkedIn: <a href="' + D.linkedin + '" target="_blank" rel="noopener">linkedin.com/in/aman-sharma-b0997a88</a>\nGitHub:   <a href="' + D.github + '" target="_blank" rel="noopener">github.com/amansharma-cloud</a>' }; },
    resume: function () { window.open(D.resume, '_blank'); return 'Opening ' + D.resume + ' ...'; },
    github: function () { window.open(D.github, '_blank', 'noopener'); return 'Opening GitHub ...'; },
    games: function () { DevOS.launch('games'); return 'Launching games ...'; },
    date: function () { return new Date().toString(); },
    neofetch: function () {
      return '  ☸  ' + D.name + '@aman.cloud\n  -----------------------\n  OS:      aman.cloud OS v1.0\n  Role:    ' + D.title + '\n  Uptime:  ' + years() + ' years in DevOps\n  Shell:   zsh (sort of)\n  Cloud:   Azure, AWS\n  IaC:     Terraform\n  Orch:    Kubernetes\n  Location:' + ' ' + D.location;
    },
    theme: function () {
      var cur = document.documentElement.style.filter;
      document.documentElement.style.filter = cur ? '' : 'hue-rotate(140deg)';
      return cur ? 'Theme reset.' : 'Theme switched (run again to reset).';
    },
    history: null, clear: null,
    sudo: function () { return 'Nice try. This incident will be reported.'; },
    rm: function () { return 'rm: refusing to touch production.'; },
    kubectl: function () { return 'NAME           READY   STATUS    RESTARTS\nportfolio-0    1/1     Running   0'; },
    terraform: function () { return 'Apply complete! Resources: 0 added, 0 changed, 0 destroyed. (No drift!)'; }
  };

  DevOS.register('terminal', {
    title: 'Terminal', icon: '⌨️',
    build: function (body) {
      body.style.padding = '0';
      var t = document.createElement('div');
      t.className = 'dv-term';
      t.innerHTML = '<div class="dv-line">Welcome to aman.cloud OS. Type <b>help</b> to get started.</div><div class="dv-row"><span>aman@cloud ~ $</span><input type="text" spellcheck="false" autocomplete="off" autocapitalize="off" aria-label="Terminal input"></div>';
      body.appendChild(t);
      var input = t.querySelector('input'), row = t.querySelector('.dv-row');
      var hist = [], hi = 0;

      function print(out, cls) {
        var d = document.createElement('div');
        d.className = 'dv-line' + (cls ? ' ' + cls : '');
        if (out && out.html) d.innerHTML = out.html; else d.textContent = out;
        t.insertBefore(d, row);
      }
      function run(raw) {
        var parts = raw.trim().split(/\s+/), name = parts[0].toLowerCase();
        print('aman@cloud ~ $ ' + raw, 'dv-cmd');
        if (!name) return;
        hist.push(raw); hi = hist.length;
        if (name === 'clear') { Array.prototype.slice.call(t.querySelectorAll('.dv-line')).forEach(function (n) { n.remove(); }); return; }
        if (name === 'history') { print(hist.map(function (h, i) { return (i + 1) + '  ' + h; }).join('\n')); return; }
        if (name === 'echo') { print(parts.slice(1).join(' ')); return; }
        var fn = Object.prototype.hasOwnProperty.call(commands, name) && commands[name];
        if (fn) print(fn()); else print('zsh: command not found: ' + name + ' (try "help")', 'dv-err');
      }
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') { run(input.value); input.value = ''; t.scrollTop = t.scrollHeight; }
        else if (e.key === 'ArrowUp') { e.preventDefault(); if (hi > 0) input.value = hist[--hi]; }
        else if (e.key === 'ArrowDown') { e.preventDefault(); input.value = hi < hist.length - 1 ? hist[++hi] : (hi = hist.length, ''); }
        else if (e.key === 'Tab') {
          e.preventDefault();
          var m = Object.keys(commands).filter(function (c) { return c.indexOf(input.value) === 0; });
          if (m.length === 1) input.value = m[0];
        }
      });
      t.addEventListener('click', function () { input.focus(); });
      setTimeout(function () { input.focus(); }, 0);
    }
  });
})();
