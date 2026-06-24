(function(){
  "use strict";

  var PAGES = [
    {id:"p-welcome",   num:"·",  name:"Welcome & Setup",            file:"lessons/00-welcome.html"},
    {id:"p-overview",  num:"01", name:"Claude Code Overview",       file:"lessons/01-overview.html"},
    {id:"p-desktop",   num:"02", name:"The Desktop Interface",      file:"lessons/02-desktop.html"},
    {id:"p-models",    num:"03", name:"Models, Effort & Usage",     file:"lessons/03-models.html"},
    {id:"p-context",   num:"04", name:"Context & Sessions",         file:"lessons/04-context.html"},
    {id:"p-habits",    num:"05", name:"Best Practices",             file:"lessons/05-habits.html"},
    {id:"p-routines",  num:"06", name:"Routines & Automation",      file:"lessons/06-routines.html"},
    {id:"p-connect",   num:"07", name:"Connection Methods",         file:"lessons/07-connect.html"},
    {id:"p-run",       num:"08", name:"Running a Skill",            file:"lessons/08-run.html"},
    {id:"p-create",    num:"09", name:"Creating a Skill",           file:"lessons/09-create.html"},
    {id:"p-market",    num:"10", name:"The AI Marketplace",         file:"lessons/10-marketplace.html"},
    {id:"p-takeaways", num:"11", name:"Key Takeaways",              file:"lessons/11-takeaways.html"},
    {id:"p-close",     num:"12", name:"What's Next",                file:"lessons/12-close.html"}
  ];
  var N = PAGES.length;

  function renderLessonError(message){
    var pages = document.getElementById("pages");
    pages.innerHTML = '<div class="lesson-error"><b>Lessons could not load.</b><br>' + message + '</div>';
  }

  function loadLessons(){
    var pages = document.getElementById("pages");
    var cacheBust = "v=" + Date.now();
    return Promise.all(PAGES.map(function(page){
      return fetch(page.file + "?" + cacheBust, { cache: "no-store" }).then(function(response){
        if(!response.ok){ throw new Error(page.file + " returned " + response.status); }
        return response.text();
      });
    })).then(function(markup){
      pages.innerHTML = markup.join("\n");
    });
  }

  document.addEventListener("DOMContentLoaded", function(){
    loadLessons().then(init).catch(function(error){
      renderLessonError(error.message + " Run this page from a local server so the browser can fetch lesson files.");
    });
  });

  function init(){
  // keep our own scroll control on reload so resume lands at the lesson top
  if("scrollRestoration" in history){ history.scrollRestoration = "manual"; }
  // ---- build sidebar ----
  var navList = document.getElementById("navList");
  navList.innerHTML = "";
  PAGES.forEach(function(p){
    var li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML =
      '<a class="nav-link" href="#'+p.id+'" data-id="'+p.id+'">' +
        '<span class="nav-num">'+p.num+'</span>' +
        '<span class="nav-body"><span class="nav-name">'+p.name+'</span></span>' +
      '</a>';
    navList.appendChild(li);
  });
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var sections = PAGES.map(function(p){ return document.getElementById(p.id); });

  // ---- theme ----
  var root = document.documentElement;
  var themeIcon = document.getElementById("themeIcon");
  var sunIcon = '<circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.4 1.4M17.6 17.6L19 19M19 5l-1.4 1.4M6.4 17.6L5 19"/>';
  var moonIcon = '<path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8z"/>';
  function applyTheme(t){ root.setAttribute("data-theme", t); themeIcon.innerHTML = t === "dark" ? moonIcon : sunIcon; }
  applyTheme(localStorage.getItem("c201-theme") || "dark");
  document.getElementById("themeToggle").addEventListener("click", function(){
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("c201-theme", next); applyTheme(next);
  });

  // ---- mobile sidebar ----
  var sidebar = document.getElementById("sidebar");
  var overlay = document.getElementById("overlay");
  var mobileNavQuery = window.matchMedia("(max-width:980px)");
  function openNav(){
    sidebar.classList.add("open");
    overlay.classList.add("show");
    document.body.classList.add("nav-open");
  }
  function closeNav(){
    sidebar.classList.remove("open");
    overlay.classList.remove("show");
    document.body.classList.remove("nav-open");
  }
  document.getElementById("navToggle").addEventListener("click", openNav);
  overlay.addEventListener("click", closeNav);
  window.addEventListener("resize", function(){
    if(!mobileNavQuery.matches) closeNav();
  });
  closeNav();

  // ---- paged navigation ----
  var progressFill = document.getElementById("progressFill");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");
  var prevLabel = document.getElementById("prevLabel");
  var nextLabel = document.getElementById("nextLabel");
  var pcNow = document.getElementById("pcNow");
  var maxReached = 0;
  var idx = -1;

  function show(i){
    i = Math.max(0, Math.min(N - 1, i));
    if(i === idx) return;
    if(mobileNavQuery.matches) closeNav();
    idx = i;
    maxReached = Math.max(maxReached, i);

    sections.forEach(function(s, k){ s.classList.toggle("active", k === i); });
    navLinks.forEach(function(l, k){
      l.classList.toggle("active", k === i);
      l.classList.toggle("done", k < maxReached && k !== i);
    });
    window.dispatchEvent(new CustomEvent("c201:pagechange", { detail: { id: PAGES[i].id, index: i } }));

    progressFill.style.width = (N > 1 ? (i / (N - 1)) * 100 : 100) + "%";

    prevBtn.classList.toggle("disabled", i === 0);
    prevLabel.textContent = i > 0 ? PAGES[i - 1].name : "Start";
    nextBtn.classList.toggle("disabled", i === N - 1);
    nextLabel.textContent = i < N - 1 ? PAGES[i + 1].name : "Done";

    pcNow.textContent = (i + 1) + " / " + N;

    window.scrollTo(0, 0);
    try { localStorage.setItem("c201-page", String(i)); } catch (e) {}
  }

  prevBtn.addEventListener("click", function(){ show(idx - 1); });
  nextBtn.addEventListener("click", function(){ show(idx + 1); });

  navLinks.forEach(function(link, k){
    link.addEventListener("click", function(e){
      e.preventDefault();
      show(k);
      if(window.innerWidth <= 980) closeNav();
    });
  });

  // ---- keyboard: arrow keys move between lessons ----
  window.addEventListener("keydown", function(e){
    var t = e.target;
    if(t && /^(input|textarea|select)$/i.test(t.tagName)) return;
    if(e.key === "ArrowRight"){ show(idx + 1); }
    else if(e.key === "ArrowLeft"){ show(idx - 1); }
  });

  // ---- copy buttons ----
  document.querySelectorAll(".code-copy").forEach(function(btn){
    btn.addEventListener("click", function(){
      var pre = btn.closest(".code").querySelector("code");
      var text = pre ? pre.textContent : "";
      navigator.clipboard.writeText(text).then(function(){
        var orig = btn.innerHTML;
        btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copied';
        setTimeout(function(){ btn.innerHTML = orig; }, 1600);
      });
    });
  });

  // ---- interactive 3D tool carousels (multi-instance) ----
  (function initToolCarousels(){
    var carousels = Array.prototype.slice.call(document.querySelectorAll(".tool-carousel"));
    if(!carousels.length) return;
    carousels.forEach(setup);

    function setup(root){
      var stage = root.querySelector(".tool-3d-stage");
      if(!stage) return;
      var slides  = Array.prototype.slice.call(stage.querySelectorAll(".tool-slide"));
      var dots    = Array.prototype.slice.call(root.querySelectorAll(".tool-dot"));
      var counter = root.querySelector(".tool-counter");
      var labels  = slides.map(function(s){ var n = s.querySelector(".tc-name"); return n ? n.textContent.trim() : ""; });
      var cur = 0;

      function syncHeight(){
        var height = slides[cur].offsetHeight;
        if(height > 0) stage.style.height = height + "px";
      }

      function syncWhenVisible(){
        syncHeight();
        requestAnimationFrame(function(){
          syncHeight();
          requestAnimationFrame(syncHeight);
        });
        if(document.fonts && document.fonts.ready){
          document.fonts.ready.then(syncHeight).catch(function(){});
        }
      }

      function goTo(idx){
        cur = idx;
        slides.forEach(function(s, i){
          var off = i - cur;
          s.className = "tool-slide " + (off === 0 ? "is-active" : off === -1 ? "is-left" : off === 1 ? "is-right" : "is-far");
        });
        dots.forEach(function(d, i){ d.classList.toggle("active", i === cur); });
        if(counter) counter.textContent = (cur + 1) + " of " + slides.length + " · " + labels[cur];
        setTimeout(syncWhenVisible, 310);
      }

      slides.forEach(function(s, i){
        var t = null;
        s.addEventListener("click", function(){ if(i !== cur) goTo(i); });
        s.addEventListener("mouseenter", function(){ if(i !== cur) t = setTimeout(function(){ goTo(i); }, 700); });
        s.addEventListener("mouseleave", function(){ clearTimeout(t); });
      });

      dots.forEach(function(d, i){ d.addEventListener("click", function(){ goTo(i); }); });

      root.addEventListener("keydown", function(e){
        if(e.key === "ArrowLeft")  { e.preventDefault(); if(cur > 0) goTo(cur - 1); }
        if(e.key === "ArrowRight") { e.preventDefault(); if(cur < slides.length - 1) goTo(cur + 1); }
      });

      goTo(0);
      window.addEventListener("resize", syncWhenVisible);
      window.addEventListener("c201:pagechange", syncWhenVisible);
    }
  })();

  // ---- mode match practice (lesson 01) ----
  (function initModeMatch(){
    var root = document.getElementById("modeMatch");
    if(!root) return;
    var stage = document.getElementById("mmStage");
    var track = document.getElementById("mmTrack");
    var label = document.getElementById("mmProgressLabel");
    var confettiLayer = document.getElementById("mmConfetti");
    var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>';
    var ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
    var MODES = [
      {name:"Chat", cls:"mm-chat", tag:"Steer a conversation", desc:"Draft, summarize, reason, and refine in turns."},
      {name:"Plugins", cls:"mm-plugins", tag:"Work inside an app", desc:"Use Claude in approved tools like spreadsheets, decks, and messages."},
      {name:"Cowork", cls:"mm-cowork", tag:"Delegate a job", desc:"Hand off bounded work from sources and review the result."},
      {name:"Code", cls:"mm-code", tag:"Control files and tools", desc:"Use files, tools, permissions, diffs, and precise review."}
    ];
    var MODE_CLS = {Chat:"mm-chat", Plugins:"mm-plugins", Cowork:"mm-cowork", Code:"mm-code"};
    var TASKS = [
      {
        id:"notes",
        label:"Customer follow-up",
        text:"Turn messy meeting notes into a customer-ready follow-up with owners and next steps.",
        best:"Chat",
        also:"Cowork could help if this is one piece of a larger delegated customer-summary workflow.",
        avoid:"Code is usually too heavy unless the notes live in files that need controlled edits.",
        why:"Chat is the strongest starting point because you can paste the notes, shape tone, and refine the message in a couple of turns."
      },
      {
        id:"deck",
        label:"Slide polish",
        text:"Improve the wording on three selected slides while you are already working in PowerPoint.",
        best:"Plugins",
        also:"Chat can help if you paste the slide text and want to iterate conversationally. Cowork may fit if the deck is part of a larger delegated workflow.",
        avoid:"Cowork or Code is heavier than you need when the work is already contained in one approved app.",
        why:"Plugins fit because Claude for PowerPoint can work in the deck, edit selected content, and preserve the surrounding template context."
      },
      {
        id:"slack-thread",
        label:"Slack catch-up",
        text:"You join a long Slack thread and need the decision, open questions, and owners before you reply.",
        best:"Plugins",
        also:"Chat works if you copy the thread into Claude and remove anything sensitive first.",
        avoid:"Code is the wrong starting point unless this turns into a repo task. Cowork is more than you need for a focused thread catch-up.",
        why:"Plugins fit because @Claude can be brought into Slack where the thread already lives and use the accessible conversation context."
      },
      {
        id:"excel-model",
        label:"Model update",
        text:"Update a few assumptions in a multi-tab Excel model, explain the formulas, and check for obvious errors.",
        best:"Plugins",
        also:"Chat can explain a pasted formula or a small table. Code may fit if the workbook needs a controlled file workflow outside Excel.",
        avoid:"Chat becomes clumsy when you need workbook context across tabs and cells.",
        why:"Plugins fit because Claude for Excel can work in the workbook, read across tabs, modify assumptions, and help debug formulas."
      },
      {
        id:"report",
        label:"Source report",
        text:"Read several source files, assemble a first draft of a status report, and keep working while you do other work.",
        best:"Cowork",
        also:"Chat works if you paste a small amount of context and want to steer every step. Plugins may fit if all the work lives in one approved app.",
        avoid:"Code only fits if the workflow needs file-level changes, commands, or a controlled technical environment.",
        why:"Cowork fits because this is bounded delegated work across multiple sources."
      },
      {
        id:"repo",
        label:"Repo change",
        text:"Inspect a repo, make a small change across files, run checks, and review the diff before accepting anything.",
        best:"Code",
        also:"Chat is useful first if you only want to think through the approach before touching files.",
        avoid:"Cowork is less ideal when you want tight, real-time control over file edits and diffs.",
        why:"Code is the strongest starting point because the task needs files, tools, commands, permissions, and reviewable changes."
      },
      {
        id:"decision",
        label:"Architecture choice",
        text:"Compare two approaches and list risks before deciding what to build.",
        best:"Chat",
        also:"Code can come later if the decision turns into repo exploration or implementation.",
        avoid:"Cowork is too much for early thinking unless you have a larger research task to delegate.",
        why:"Chat fits because this is judgment-building conversation, not execution yet."
      },
      {
        id:"batch",
        label:"File workflow",
        text:"Run a repeatable file-based workflow that is not pure software: organize source files, transform content, and review each change.",
        best:"Code",
        also:"Cowork may fit if you mainly care about the finished output and do not need to inspect every file change as it happens.",
        avoid:"Chat is likely too manual once the task depends on many files and repeatable steps.",
        why:"Code can be useful beyond software when you need file access, tool use, permissions, and granular review."
      },
      {
        id:"summary",
        label:"Quick synthesis",
        text:"Summarize one policy document into plain language and ask follow-up questions about edge cases.",
        best:"Chat",
        also:"Cowork could fit if the task expands into a larger review across many documents.",
        avoid:"Code is not the first stop unless the policy lives inside a technical file workflow.",
        why:"Chat is the simplest place to attach or paste one document, ask questions, and refine the answer."
      }
    ];
    var idx = 0;
    var picks = {};
    var onResults = false;

    function task(){ return TASKS[idx]; }

    function renderProgress(){
      if(onResults){
        label.textContent = "Complete";
        track.innerHTML = TASKS.map(function(){ return '<span class="mm-seg done"></span>'; }).join("");
        return;
      }
      label.textContent = "Task " + (idx + 1) + " of " + TASKS.length;
      track.innerHTML = TASKS.map(function(t, i){
        var cls = picks[t.id] ? " done" : "";
        if(i === idx) cls += " active";
        return '<span class="mm-seg' + cls + '"></span>';
      }).join("");
    }

    function choiceHtml(m, t){
      var picked = picks[t.id];
      var cls = "mm-choice " + m.cls;
      var flag = "";
      if(picked){
        var isPick = picked === m.name;
        var isBest = t.best === m.name;
        if(isPick) cls += " picked";
        if(isBest) cls += " best";
        if(!isPick && !isBest) cls += " faded";
        if(isBest) flag = '<span class="mm-flag best">' + CHECK + ' Strongest fit</span>';
        else if(isPick) flag = '<span class="mm-flag pick">Your pick</span>';
      }
      return '<button type="button" class="' + cls + '" data-mode="' + m.name + '"' + (picked ? ' disabled' : '') + '>' +
        flag +
        '<span class="mm-choice-name"><span class="mm-choice-dot"></span>' + m.name + '</span>' +
        '<span class="mm-choice-tag">' + m.tag + '</span>' +
        '<span class="mm-choice-desc">' + m.desc + '</span>' +
      '</button>';
    }

    function verdictHtml(t){
      var picked = picks[t.id];
      if(!picked) return "";
      var hit = picked === t.best;
      var head = hit
        ? CHECK + '<span>Strongest fit. Nice call.</span>'
        : ARROW + '<span>Reasonable start. ' + t.best + ' is stronger here.</span>';
      return '<div class="mm-verdict ' + (hit ? 'hit' : 'near') + '">' +
        '<div class="mm-verdict-head">' + head + '</div>' +
        '<div class="mm-verdict-body">' +
          '<p class="mm-verdict-why">' + t.why + '</p>' +
          '<div class="mm-verdict-more">' +
            '<div><b>Also reasonable</b><p>' + t.also + '</p></div>' +
            '<div><b>Watch out</b><p>' + t.avoid + '</p></div>' +
          '</div>' +
        '</div>' +
      '</div>';
    }

    function renderTask(){
      onResults = false;
      var t = task();
      var answered = !!picks[t.id];
      var last = idx === TASKS.length - 1;
      var started = Object.keys(picks).length > 0;
      stage.innerHTML =
        '<div class="mm-card">' +
          '<div class="mm-scenario">' +
            '<span class="mm-scenario-label">Task ' + (idx + 1) + '</span>' +
            '<h4 class="mm-scenario-title">' + t.label + '</h4>' +
            '<p class="mm-scenario-text">' + t.text + '</p>' +
          '</div>' +
          '<div class="mm-prompt">' + (answered ? 'How the modes compare for this task:' : 'Where would you start?') + '</div>' +
          '<div class="mm-choices">' + MODES.map(function(m){ return choiceHtml(m, t); }).join("") + '</div>' +
          verdictHtml(t) +
          '<div class="mm-footer">' +
            (started ? '<button type="button" class="mm-ghost" id="mmRestart">Start over</button>' : '<span></span>') +
            '<span class="mm-nav">' +
              (idx > 0 ? '<button type="button" class="mm-btn secondary" id="mmBack">Back</button>' : '') +
              (answered ? '<button type="button" class="mm-btn primary" id="mmNext">' + (last ? 'See results' : 'Next task') + '</button>' : '') +
            '</span>' +
          '</div>' +
        '</div>';
      renderProgress();
      bindStage();
    }

    function recapRow(t, i){
      var pick = picks[t.id];
      var hit = pick === t.best;
      var modes = hit
        ? '<span class="mm-chip ' + MODE_CLS[pick] + '">' + pick + '</span>'
        : '<span class="mm-chip ' + MODE_CLS[pick] + '">' + pick + '</span><span class="mm-recap-arrow">&rarr;</span><span class="mm-chip ' + MODE_CLS[t.best] + '">' + t.best + '</span>';
      return '<button type="button" class="mm-recap-row" data-i="' + i + '">' +
        '<span class="mm-recap-mark ' + (hit ? 'hit' : 'near') + '">' + (hit ? CHECK : ARROW) + '</span>' +
        '<span class="mm-recap-label">' + t.label + '</span>' +
        '<span class="mm-recap-modes">' + modes + '</span>' +
      '</button>';
    }

    function renderResults(){
      onResults = true;
      var hits = TASKS.filter(function(t){ return picks[t.id] === t.best; }).length;
      stage.innerHTML =
        '<div class="mm-results">' +
          '<div class="mm-score"><span class="mm-score-num">' + hits + '/' + TASKS.length + '</span><span class="mm-score-sub">strongest fits</span></div>' +
          '<h4 class="mm-results-title">' + (hits === TASKS.length ? 'Perfect run.' : 'Nice work.') + '</h4>' +
          '<p class="mm-results-text">There is not always one perfect answer. What matters is pausing to notice which mode fits the work in front of you.</p>' +
          '<div class="mm-recap">' + TASKS.map(recapRow).join("") + '</div>' +
          '<p class="mm-recap-hint">Select a task to revisit its feedback.</p>' +
          '<div class="mm-results-actions"><button type="button" class="mm-btn primary" id="mmAgain">Practice again</button></div>' +
        '</div>';
      renderProgress();
      confetti(90);
      var again = document.getElementById("mmAgain");
      if(again) again.addEventListener("click", restart);
      Array.prototype.forEach.call(stage.querySelectorAll(".mm-recap-row"), function(row){
        row.addEventListener("click", function(){
          idx = parseInt(row.getAttribute("data-i"), 10);
          renderTask();
        });
      });
    }

    function bindStage(){
      var t = task();
      Array.prototype.forEach.call(stage.querySelectorAll(".mm-choice"), function(btn){
        btn.addEventListener("click", function(){
          if(picks[t.id]) return;
          picks[t.id] = btn.getAttribute("data-mode");
          renderTask();
          if(picks[t.id] === t.best) confetti(26);
        });
      });
      var back = document.getElementById("mmBack");
      if(back) back.addEventListener("click", function(){ idx -= 1; renderTask(); });
      var next = document.getElementById("mmNext");
      if(next) next.addEventListener("click", function(){
        if(idx === TASKS.length - 1){ renderResults(); }
        else { idx += 1; renderTask(); }
      });
      var restartBtn = document.getElementById("mmRestart");
      if(restartBtn) restartBtn.addEventListener("click", restart);
    }

    function restart(){
      idx = 0;
      picks = {};
      onResults = false;
      renderTask();
    }

    function confetti(count){
      if(reduceMotion || !confettiLayer) return;
      var colors = ["#fa4616", "#0ba2b3", "#8b288a", "#f59e0b", "#0079bf", "#34de69"];
      var h = root.offsetHeight || 420;
      for(var i = 0; i < count; i++){
        var p = document.createElement("span");
        p.className = "mm-confetti-piece" + (Math.random() < .34 ? " round" : "");
        var size = 6 + Math.random() * 6;
        p.style.left = (Math.random() * 100) + "%";
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        p.style.width = size + "px";
        p.style.height = (Math.random() < .5 ? size : size * 1.6) + "px";
        p.style.setProperty("--x", (Math.random() * 180 - 90) + "px");
        p.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
        p.style.setProperty("--fall", (h + 40) + "px");
        p.style.setProperty("--d", (1.7 + Math.random() * 1.5) + "s");
        p.style.animationDelay = (Math.random() * .45) + "s";
        confettiLayer.appendChild(p);
        p.addEventListener("animationend", function(e){
          if(e.target.parentNode) e.target.parentNode.removeChild(e.target);
        });
      }
    }

    renderTask();
  })();

  // ---- role explorer (lesson 01) ----
  (function initRoleExplorer(){
    var panel = document.getElementById("rxPanel");
    if(!panel) return;
    var cards = Array.prototype.slice.call(document.querySelectorAll(".rx-card"));
    var ROLES = [
      {team:"Draft", color:"var(--teal-50)", intro:"For turning rough inputs into a usable first pass:", uses:[
        ["Start from rough notes.", "Turn bullets, meeting notes, or a messy idea into a first draft you can edit."],
        ["Adjust for audience.", "Rework the same message for a customer, manager, executive, or teammate."],
        ["Find your voice.", "Ask Claude to make a draft clearer, warmer, shorter, or more direct while you stay in control."]
      ]},
      {team:"Summarize & Analyze", color:"var(--orange-50)", intro:"For making sense of source material:", uses:[
        ["Make sense of source material.", "Pull decisions, risks, owners, and open questions from notes, docs, transcripts, or case history."],
        ["Compare long inputs.", "Ask what changed between versions, what themes repeat, or where two documents disagree."],
        ["Surface useful insights.", "Use Claude to organize findings from research, feedback, or exported data, then verify the details that matter."]
      ]},
      {team:"Code", color:"var(--purple-50)", intro:"For software and technical work:", uses:[
        ["Understand technical work.", "Ask Claude to explain unfamiliar code, logs, errors, or technical notes in plain language."],
        ["Debug a focused issue.", "Share the error, relevant files, and what you already tried so Claude can suggest likely next steps."],
        ["Draft tests or docs.", "Use existing code or requirements as context, then review the output before it becomes part of a repo or customer-facing artifact."]
      ]},
      {team:"Reason", color:"var(--emerald-50)", intro:"For structured thinking before decisions:", uses:[
        ["Compare options.", "Have Claude organize pros, cons, tradeoffs, decision criteria, and unresolved questions."],
        ["Pressure-test a plan.", "Ask what assumptions, risks, dependencies, or missing inputs could affect the outcome."],
        ["Prepare for decisions.", "Use Claude to structure your thinking before a stakeholder conversation, planning session, or prioritization discussion."]
      ]},
      {team:"Explore", color:"var(--brightblue-50)", intro:"For getting oriented and practicing with verification:", uses:[
        ["Get oriented quickly.", "Ask Claude to explain an unfamiliar topic, process, or tool in terms that match your role, then check important details against trusted sources."],
        ["Practice with guidance.", "Use Claude for examples, drills, or checkpoints instead of asking it to simply give you the answer."],
        ["Clarify jargon.", "Ask Claude to turn technical, product, or process language into plain examples you can verify and use at work."]
      ]}
    ];
    var reveal = document.getElementById("rxReveal");
    var caret = document.getElementById("rxCaret");
    var cur = -1;

    function paintCards(){
      cards.forEach(function(c, k){
        var on = k === cur;
        var color = on ? ROLES[k].color : "";
        c.classList.toggle("active", on);
        c.setAttribute("aria-selected", on ? "true" : "false");
        c.style.borderTopColor = color;
        var ic = c.querySelector(".rx-card-ic");
        ic.style.background = color;
        ic.style.color = on ? "#fff" : "";
      });
    }

    function fill(i){
      var r = ROLES[i];
      var items = r.uses.map(function(u){ return '<li><b>' + u[0] + '</b> ' + u[1] + '</li>'; }).join("");
      panel.style.borderTopColor = r.color;
      panel.innerHTML =
        '<div class="rx-role">' + r.team + '</div>' +
        '<p class="rx-intro">' + r.intro + '</p>' +
        '<ul class="clean">' + items + '</ul>';
      panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
    }

    // point the caret up at the selected tile so the panel reads as popping out of it
    function positionCaret(i){
      // offsetTop/offsetLeft are layout positions (relative to the positioned .rx-explorer),
      // unaffected by the panel's swap transform, so the caret lands on the top border cleanly
      var card = cards[i];
      caret.style.left = (card.offsetLeft + card.offsetWidth / 2) + "px";
      caret.style.top = (panel.offsetTop - 8) + "px";
      caret.style.borderBottomColor = ROLES[i].color;
    }

    function select(i){
      if(cur === i){ // clicking the open team collapses it
        cur = -1;
        paintCards();
        caret.classList.remove("show");
        reveal.classList.remove("open");
        reveal.style.maxHeight = "0px";
        return;
      }
      cur = i;
      fill(i);
      paintCards();
      reveal.classList.add("open");
      reveal.style.maxHeight = reveal.scrollHeight + "px";
      positionCaret(i);
      caret.classList.add("show");
    }

    cards.forEach(function(c, k){ c.addEventListener("click", function(){ select(k); }); });
    window.addEventListener("resize", function(){ if(cur >= 0){ reveal.style.maxHeight = reveal.scrollHeight + "px"; positionCaret(cur); } });
  })();

  // ---- in-lesson beats: reveal on scroll + beat rail ----
  (function initBeats(){
    if(!("IntersectionObserver" in window)) return;
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.documentElement.classList.add("beats-on");

    var rail = document.createElement("div");
    rail.className = "beat-rail";
    rail.setAttribute("aria-hidden", "true");
    rail.hidden = true;
    document.body.appendChild(rail);

    var current = [];
    var dots = [];

    function markActive(section){
      var i = current.indexOf(section);
      if(i < 0) return;
      dots.forEach(function(d, k){
        d.classList.toggle("active", k === i);
        d.classList.toggle("past", k < i);
      });
    }

    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){ e.target.classList.add("in-view"); markActive(e.target); }
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.05 });

    function rebuild(segment){
      current.forEach(function(s){ observer.unobserve(s); s.classList.remove("in-view"); });
      current = [];
      dots = [];
      rail.innerHTML = "";
      if(!segment){ rail.hidden = true; return; }
      var sections = Array.prototype.slice.call(segment.querySelectorAll(".panel .lesson-section"));
      rail.hidden = sections.length < 2;
      current = sections;
      sections.forEach(function(s, i){
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "beat-dot";
        dot.setAttribute("aria-label", "Go to beat " + (i + 1) + " of " + sections.length);
        dot.addEventListener("click", function(){ s.scrollIntoView({ behavior: "smooth", block: "start" }); });
        rail.appendChild(dot);
        dots.push(dot);
        observer.observe(s);
      });
    }

    window.addEventListener("c201:pagechange", function(e){
      var seg = document.getElementById(e.detail.id);
      requestAnimationFrame(function(){ rebuild(seg); });
    });
  })();

  // ---- hero particle field (welcome + close screens) ----
  (function initHeroCanvas(){
    if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if(!document.querySelector(".hero-canvas")) return;

    var COLORS = ["#0ba2b3", "#8b288a", "#fa4616"];
    var active = null;

    function setup(canvas){
      var ctx = canvas.getContext("2d");
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      var rect = canvas.getBoundingClientRect();
      var w = Math.max(1, Math.round(rect.width));
      var h = Math.max(1, Math.round(rect.height));
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var n = Math.round(Math.min(64, (w * h) / 8500));
      var parts = [];
      for(var i = 0; i < n; i++){
        parts.push({
          x: Math.random() * w, y: Math.random() * h,
          r: 1 + Math.random() * 2.2,
          vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
          c: COLORS[i % COLORS.length], a: 0.22 + Math.random() * 0.4
        });
      }
      return { canvas: canvas, ctx: ctx, parts: parts, w: w, h: h, raf: 0, last: 0 };
    }

    function frame(now){
      if(!active) return;
      if(now - active.last < 33){ active.raf = requestAnimationFrame(frame); return; }
      active.last = now;
      var ctx = active.ctx, w = active.w, h = active.h;
      ctx.clearRect(0, 0, w, h);
      active.parts.forEach(function(p){
        p.x += p.vx; p.y += p.vy;
        if(p.x < -10) p.x = w + 10; else if(p.x > w + 10) p.x = -10;
        if(p.y < -10) p.y = h + 10; else if(p.y > h + 10) p.y = -10;
        ctx.globalAlpha = p.a; ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.r * 2, p.r * 2);
      });
      ctx.globalAlpha = 1;
      active.raf = requestAnimationFrame(frame);
    }

    function stop(){
      if(active && active.raf) cancelAnimationFrame(active.raf);
      active = null;
    }

    function startFor(segment){
      stop();
      if(!segment) return;
      var canvas = segment.querySelector(".hero-canvas");
      if(!canvas) return;
      active = setup(canvas);
      active.raf = requestAnimationFrame(frame);
    }

    window.addEventListener("c201:pagechange", function(e){
      var seg = document.getElementById(e.detail.id);
      requestAnimationFrame(function(){ startFor(seg); });
    });

    var resizeT = null;
    window.addEventListener("resize", function(){
      if(!active) return;
      var canvas = active.canvas;
      clearTimeout(resizeT);
      resizeT = setTimeout(function(){ stop(); active = setup(canvas); active.raf = requestAnimationFrame(frame); }, 200);
    });
  })();

  // ---- shared segmented toggle (interactive view <-> reference) ----
  function initSegToggle(root){
    var btns = Array.prototype.slice.call(root.querySelectorAll(".seg-btn"));
    var views = Array.prototype.slice.call(root.querySelectorAll(".rb-view, .ss-view"));
    btns.forEach(function(b){
      b.addEventListener("click", function(){
        var v = b.getAttribute("data-view");
        btns.forEach(function(x){
          var on = x === b;
          x.classList.toggle("active", on);
          x.setAttribute("aria-selected", on ? "true" : "false");
        });
        views.forEach(function(view){ view.hidden = view.getAttribute("data-view") !== v; });
      });
    });
  }

  // ---- RTCFC prompt builder (lesson 03) ----
  (function initPromptBuilder(){
    var root = document.getElementById("rtcfcBuilder");
    if(!root) return;
    var ELEMENTS = {
      role:        {name:"Role & audience", hint:"Tells Claude the perspective to use and who the output is for.", text:"Act as a project lead writing for your team."},
      task:        {name:"Task & goal", hint:"Says exactly what to produce and what success looks like.", text:"Summarize what changed this week and draft a short update."},
      context:     {name:"Context", hint:"Gives the details Claude needs so it does not guess.", text:"Use the notes in this folder and last week's update as a model."},
      format:      {name:"Format", hint:"Specifies the shape of the answer.", text:"Return a short summary, then bullets for next steps with owners."},
      constraints: {name:"Constraints", hint:"Sets guardrails for length, tone, and what to avoid.", text:"Keep it under 150 words, use a plainspoken tone, and flag any assumptions I should verify."}
    };
    var ORDER = ["role", "task", "context", "format", "constraints"];
    var chips = Array.prototype.slice.call(root.querySelectorAll(".rb-chip"));
    var activeBox = root.querySelector("#rbActive");
    var out = root.querySelector("#rbOut");
    var copyBtn = root.querySelector("#rbCopy");
    var emptyText = out.getAttribute("data-empty");
    var picked = {};

    function render(){
      var keys = ORDER.filter(function(k){ return picked[k]; });
      if(keys.length){
        activeBox.hidden = false;
        activeBox.innerHTML = keys.map(function(k){
          return '<p class="rb-active-item"><b>' + ELEMENTS[k].name + ':</b> ' + ELEMENTS[k].hint + '</p>';
        }).join("");
        out.textContent = keys.map(function(k){ return ELEMENTS[k].text; }).join(" ");
        out.classList.remove("is-empty");
        copyBtn.disabled = false;
      } else {
        activeBox.hidden = true;
        activeBox.innerHTML = "";
        out.textContent = emptyText;
        out.classList.add("is-empty");
        copyBtn.disabled = true;
      }
    }

    chips.forEach(function(chip){
      chip.addEventListener("click", function(){
        var k = chip.getAttribute("data-key");
        picked[k] = !picked[k];
        chip.setAttribute("aria-pressed", picked[k] ? "true" : "false");
        render();
      });
    });

    // #rbCopy keeps the .code-copy class, so the global copy handler does the
    // clipboard write and the "Copied" swap. We only manage its disabled state.
    initSegToggle(root);
    render();
  })();

  // ---- settings simulator (lesson 03) ----
  (function initSettingsSim(){
    var root = document.getElementById("settingsSim");
    if(!root) return;
    var MODEL = {
      "Haiku":"Faster and lighter, with less depth for nuance or complex reasoning.",
      "Sonnet":"A balance of quality, speed, and token use. The best starting point for most tasks.",
      "Opus":"More depth for reasoning and nuance, but more tokens, higher cost, and a greater chance of hitting usage limits."
    };
    var EFFORT = {
      "Low":"Fastest response and lowest token use, with less exploration of tradeoffs.",
      "Medium or High":"More thoughtful output, with more tokens and a longer response time.",
      "Max":"The most intensive setting. Use it sparingly because it can consume tokens quickly."
    };
    var THINK = {
      "off":"Thinking is off, which suits quick drafts, rewrites, and simple summaries.",
      "on":"Thinking is on, so Claude reasons before it answers. Good for comparing options or working from multiple inputs."
    };
    var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M20 6L9 17l-5-5"/></svg>';
    var sel = {model:"Sonnet", effort:"Low", thinking:"off"};
    var readout = root.querySelector("#ssReadout");

    function effortLabel(v){ return v === "Medium or High" ? "Medium / High" : v; }

    function render(){
      var rec = sel.model === "Sonnet" && (sel.effort === "Low" || sel.effort === "Medium or High") && sel.thinking === "off";
      var html = "";
      if(rec) html += '<span class="ss-rec">' + CHECK + ' Solid everyday default</span>';
      html += '<span class="ss-line"><b>Model · ' + sel.model + '</b>: ' + MODEL[sel.model] + '</span>';
      html += '<span class="ss-line"><b>Effort · ' + effortLabel(sel.effort) + '</b>: ' + EFFORT[sel.effort] + '</span>';
      html += '<span class="ss-line">' + THINK[sel.thinking] + '</span>';
      readout.innerHTML = html;
    }

    Array.prototype.slice.call(root.querySelectorAll(".ss-seg")).forEach(function(seg){
      var control = seg.getAttribute("data-control");
      var btns = Array.prototype.slice.call(seg.querySelectorAll("button"));
      btns.forEach(function(b){
        b.addEventListener("click", function(){
          sel[control] = b.getAttribute("data-val");
          btns.forEach(function(x){ x.classList.toggle("on", x === b); });
          render();
        });
      });
    });

    initSegToggle(root);
    render();
  })();

  // ---- follow-up prompts: tab selector (lesson 03) ----
  (function initPromptDeck(){
    var root = document.getElementById("promptDeck");
    if(!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll(".pd-tab"));
    var cards = Array.prototype.slice.call(root.querySelectorAll(".pd-card"));
    if(!tabs.length || !cards.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var cur = 0;

    function go(i){
      cur = i;
      tabs.forEach(function(t, k){
        var on = k === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
      });
      cards.forEach(function(c, k){
        c.hidden = k !== i;
        if(k === i && !reduce){ c.classList.remove("pd-swap"); void c.offsetWidth; c.classList.add("pd-swap"); }
      });
    }

    tabs.forEach(function(t, i){
      t.addEventListener("click", function(){ go(i); });
      t.addEventListener("keydown", function(e){
        if(e.key === "ArrowRight" || e.key === "ArrowLeft"){
          e.preventDefault();
          var n = e.key === "ArrowRight" ? (cur + 1) % tabs.length : (cur - 1 + tabs.length) % tabs.length;
          go(n); tabs[n].focus();
        }
      });
    });

    go(0);
  })();

  // ---- prompt flip: toggle vague <-> precise in place (lesson 03) ----
  (function initPromptFlip(){
    var blocks = Array.prototype.slice.call(document.querySelectorAll(".promptflip"));
    if(!blocks.length) return;
    var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    blocks.forEach(function(block){
      var opts = Array.prototype.slice.call(block.querySelectorAll(".pf-opt"));
      var swappable = Array.prototype.slice.call(block.querySelectorAll(".pf-text, .pf-note"));

      function set(v){
        block.setAttribute("data-state", v);
        opts.forEach(function(o){ o.setAttribute("aria-pressed", o.getAttribute("data-v") === v ? "true" : "false"); });
        swappable.forEach(function(el){
          var on = el.getAttribute("data-v") === v;
          el.hidden = !on;
          if(on && !reduce){ el.classList.remove("pf-swap"); void el.offsetWidth; el.classList.add("pf-swap"); }
        });
      }

      opts.forEach(function(o){ o.addEventListener("click", function(){ set(o.getAttribute("data-v")); }); });
    });
  })();

  // ---- start ----
  var start = 0;
  try { var saved = parseInt(localStorage.getItem("c201-page"), 10); if(!isNaN(saved)) start = saved; } catch (e) {}
  show(start);
  }
})();
