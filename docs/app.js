(function () {
  "use strict";

  const QS = window.QUESTIONS;
  // Real GRE Quant: 27 questions in 47 minutes, about 105 seconds each.
  const SECONDS_PER_QUESTION = 105;
  const QC_CHOICES = [
    "Quantity A is greater.",
    "Quantity B is greater.",
    "The two quantities are equal.",
    "The relationship cannot be determined from the information given."
  ];
  const TOPICS = ["Arithmetic", "Algebra", "Geometry", "Data Analysis"];
  const DIFF_LABEL = { 1: "Easy", 2: "Medium", 3: "Hard" };
  const LETTERS = "ABCDEFGH";
  const HISTORY_KEY = "gre-quant-diagnostic-history";

  const $ = (id) => document.getElementById(id);
  let state = null;
  let lastResult = null;

  // ---------- helpers ----------

  function fmtTime(sec) {
    sec = Math.max(0, Math.round(sec));
    const m = Math.floor(sec / 60), s = sec % 60;
    return m + ":" + String(s).padStart(2, "0");
  }

  function parseNum(v) {
    if (v === null || v === undefined) return NaN;
    const s = String(v).replace(/,/g, "").replace(/\s+/g, "").replace(/−/g, "-");
    if (s === "") return NaN;
    if (s.includes("/")) {
      const [a, b] = s.split("/");
      const n = Number(a), d = Number(b);
      return d === 0 ? NaN : n / d;
    }
    return Number(s);
  }

  function isAnswered(ans) {
    if (ans === null || ans === undefined) return false;
    if (Array.isArray(ans)) return ans.length > 0;
    return String(ans).trim() !== "";
  }

  function isCorrect(q, ans) {
    if (!isAnswered(ans)) return false;
    if (q.type === "mc" || q.type === "qc") return ans === q.answer;
    if (q.type === "ma") {
      const a = [...ans].sort().join(","), b = [...q.answer].sort().join(",");
      return a === b;
    }
    const u = parseNum(ans), c = parseNum(q.answer);
    return Number.isFinite(u) && Math.abs(u - c) < 1e-9;
  }

  function fmtAnswer(q, ans) {
    if (!isAnswered(ans)) return "<em>No answer</em>";
    if (q.type === "qc") return LETTERS[ans] + ". " + QC_CHOICES[ans];
    if (q.type === "mc") return LETTERS[ans] + ". " + q.choices[ans];
    if (q.type === "ma") return [...ans].sort().map((i) => LETTERS[i] + ". " + q.choices[i]).join("; ");
    return String(ans) + (q.unit || "");
  }

  function loadHistory() {
    try { return JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { return []; }
  }

  function saveHistory(entry) {
    try {
      const h = loadHistory();
      h.unshift(entry);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 20)));
    } catch (e) { /* storage unavailable; history is optional */ }
  }

  function show(screen) {
    ["intro", "test", "results"].forEach((s) => ($(s).hidden = s !== screen));
    window.scrollTo(0, 0);
  }

  // ---------- intro ----------

  function renderHistory() {
    const h = loadHistory();
    $("history").hidden = h.length === 0;
    if (!h.length) return;
    $("history-table").innerHTML =
      "<tr><th>Date</th><th>Estimate</th><th>Correct</th><th>Mode</th></tr>" +
      h.map((e) =>
        `<tr><td>${new Date(e.date).toLocaleDateString()}</td><td>${e.low}–${e.high}</td>` +
        `<td>${e.correct}/${e.total}</td><td>${e.timed ? "Timed" : "Untimed"}</td></tr>`
      ).join("");
  }

  // ---------- test ----------

  function start() {
    state = {
      timed: $("timed-toggle").checked,
      current: 0,
      answers: QS.map(() => null),
      flagged: QS.map(() => false),
      timeSpent: QS.map(() => 0),
      remaining: QS.length * SECONDS_PER_QUESTION,
      lastTick: Date.now(),
      timerId: null
    };
    show("test");
    renderQuestion();
    tick();
    state.timerId = setInterval(tick, 1000);
  }

  function tick() {
    const now = Date.now();
    const delta = (now - state.lastTick) / 1000;
    state.lastTick = now;
    state.timeSpent[state.current] += delta;
    const t = $("timer");
    if (state.timed) {
      state.remaining -= delta;
      t.textContent = fmtTime(state.remaining) + " left";
      t.classList.toggle("low", state.remaining <= 300);
      if (state.remaining <= 0) finish();
    } else {
      const used = state.timeSpent.reduce((a, b) => a + b, 0);
      t.textContent = fmtTime(used) + " elapsed";
    }
  }

  function goTo(i) {
    tick(); // credit time to the question being left
    state.current = Math.max(0, Math.min(QS.length - 1, i));
    renderQuestion();
  }

  function renderQuestion() {
    const i = state.current, q = QS[i];
    $("q-counter").textContent = `Question ${i + 1} of ${QS.length}`;
    $("flag-btn").setAttribute("aria-pressed", String(state.flagged[i]));
    $("flag-btn").textContent = state.flagged[i] ? "Flagged" : "Flag";

    let html = "";
    if (q.prompt) html += `<div class="prompt">${q.prompt}</div>`;

    if (q.type === "qc") {
      html += `<div class="qc"><div><strong>Quantity A</strong>${q.quantityA}</div>` +
              `<div><strong>Quantity B</strong>${q.quantityB}</div></div>`;
    }

    if (q.type === "num") {
      const v = state.answers[i] || "";
      html += `<div class="num-entry"><input id="num-input" type="text" inputmode="decimal" ` +
              `autocomplete="off" aria-label="Your answer" value="${String(v).replace(/"/g, "&quot;")}">` +
              (q.unit ? `<span>${q.unit}</span>` : "") + `</div>` +
              `<p class="hint">Enter an integer, a decimal, or a fraction such as 3/4.</p>`;
    } else {
      const choices = q.type === "qc" ? QC_CHOICES : q.choices;
      const multi = q.type === "ma";
      if (multi) html += `<p class="hint">Select <strong>all</strong> answer choices that apply.</p>`;
      html += `<div class="options">` + choices.map((c, k) => {
        const ans = state.answers[i];
        const checked = multi ? (ans || []).includes(k) : ans === k;
        return `<label class="option"><input type="${multi ? "checkbox" : "radio"}" name="opt" value="${k}"` +
               `${checked ? " checked" : ""}><span class="letter">${LETTERS[k]}</span><span>${c}</span></label>`;
      }).join("") + `</div>`;
    }

    const body = $("q-body");
    body.innerHTML = html;

    if (q.type === "num") {
      $("num-input").addEventListener("input", (e) => { state.answers[i] = e.target.value; renderGrid(); });
    } else {
      body.querySelectorAll('input[name="opt"]').forEach((el) => {
        el.addEventListener("change", () => {
          if (q.type === "ma") {
            const picked = [...body.querySelectorAll('input[name="opt"]:checked')].map((x) => Number(x.value));
            state.answers[i] = picked.length ? picked : null;
          } else {
            state.answers[i] = Number(el.value);
          }
          renderGrid();
        });
      });
    }

    $("prev-btn").disabled = i === 0;
    $("next-btn").disabled = i === QS.length - 1;
    renderGrid();
  }

  function renderGrid() {
    $("q-grid").innerHTML = QS.map((_, k) => {
      const cls = [
        isAnswered(state.answers[k]) ? "answered" : "",
        state.flagged[k] ? "flagged" : "",
        k === state.current ? "current" : ""
      ].join(" ");
      return `<button class="${cls}" data-q="${k}" aria-label="Question ${k + 1}">${k + 1}</button>`;
    }).join("");
  }

  function submit() {
    const open = state.answers.filter((a) => !isAnswered(a)).length;
    const msg = open
      ? `You have ${open} unanswered question${open > 1 ? "s" : ""}. There is no penalty for guessing on the GRE. Submit anyway?`
      : "Submit the test and see your results?";
    if (confirm(msg)) finish();
  }

  // ---------- scoring ----------

  function estimateScore(weighted) {
    // Maps weighted accuracy (0–1) onto the 130–170 scale. The curve is concave
    // because the first few correct answers move the scaled score the most.
    return Math.round(130 + 40 * Math.pow(weighted, 0.8));
  }

  function prepHours(from, to) {
    // Rule of thumb: every point costs more hours as you approach 170.
    // A fixed 15 h covers the test format, strategy, and full-length practice tests.
    let h = 15;
    for (let s = from; s < to; s++) h += s < 150 ? 5 : s < 155 ? 6 : s < 160 ? 8 : s < 165 ? 12 : 18;
    return h;
  }

  function finish() {
    if (state.finished) return;
    state.finished = true;
    clearInterval(state.timerId);
    tick();

    const rows = QS.map((q, i) => ({ q, i, given: state.answers[i], ok: isCorrect(q, state.answers[i]), time: state.timeSpent[i] }));
    const correct = rows.filter((r) => r.ok).length;
    const wTotal = QS.reduce((a, q) => a + q.difficulty, 0);
    const wEarned = rows.reduce((a, r) => a + (r.ok ? r.q.difficulty : 0), 0);
    const weighted = wEarned / wTotal;
    const est = estimateScore(weighted);
    const low = Math.max(130, est - 3), high = Math.min(170, est + 3);
    const used = state.timeSpent.reduce((a, b) => a + b, 0);

    const byTopic = TOPICS.map((t) => {
      const r = rows.filter((x) => x.q.topic === t);
      return { name: t, ok: r.filter((x) => x.ok).length, total: r.length };
    });
    const byDiff = [1, 2, 3].map((d) => {
      const r = rows.filter((x) => x.q.difficulty === d);
      return { name: DIFF_LABEL[d], ok: r.filter((x) => x.ok).length, total: r.length };
    });

    lastResult = { rows, correct, weighted, est, low, high, used, byTopic, byDiff, timed: state.timed };
    saveHistory({ date: Date.now(), est, low, high, correct, total: QS.length, timed: state.timed });
    renderResults();
    show("results");
  }

  // ---------- results ----------

  function band(est) {
    if (est >= 165) return "Strong. You're already near the top of the scale, and the remaining gains come from careful work on hard questions.";
    if (est >= 158) return "Solid. The fundamentals are in place. Focus on harder questions and speed.";
    if (est >= 150) return "Developing. Some core topics need review before you start timed practice.";
    return "Foundational. Start by rebuilding core math skills before moving to GRE-style practice.";
  }

  function meterRow(name, ok, total) {
    const pct = total ? ok / total : 0;
    const color = pct >= 0.8 ? "var(--good)" : pct >= 0.5 ? "var(--warn)" : "var(--bad)";
    return `<div class="meter-row"><span>${name}</span>` +
           `<div class="meter"><span style="width:${Math.round(pct * 100)}%;background:${color}"></span></div>` +
           `<span class="meter-val">${ok}/${total}</span></div>`;
  }

  function renderPlan() {
    const r = lastResult;
    let target = parseInt($("target").value, 10);
    let hpw = parseInt($("hpw").value, 10);
    if (!Number.isFinite(target)) target = r.est;
    if (!Number.isFinite(hpw) || hpw < 1) hpw = 1;
    target = Math.max(130, Math.min(170, target));

    const base = prepHours(r.est, target);
    const lo = Math.round((base * 0.75) / 5) * 5 || 5;
    const hi = Math.round((base * 1.35) / 5) * 5;
    const wLo = Math.max(1, Math.ceil(lo / hpw)), wHi = Math.max(1, Math.ceil(hi / hpw));
    const gap = target - r.est;

    const weak = r.byTopic.filter((t) => t.ok / t.total < 0.7).sort((a, b) => a.ok / a.total - b.ok / b.total);
    const focus = weak.length
      ? `Spend about half your study time on <strong>${weak.map((t) => t.name).join(", ")}</strong>.`
      : "No content area is clearly weak. Split your time between hard mixed sets and timed practice.";

    let headline;
    if (gap <= 0) headline = `You're already estimated at or above ${target}. About <strong>${lo}–${hi} hours</strong> of practice tests and review should be enough to lock it in.`;
    else headline = `To gain about <strong>${gap} point${gap > 1 ? "s" : ""}</strong> (${r.est} → ${target}), plan on <strong>${lo}–${hi} hours</strong> of quant prep.`;

    $("plan-out").innerHTML =
      `<p class="big">${wLo === wHi ? wLo : wLo + "–" + wHi} week${wHi > 1 ? "s" : ""} at ${hpw} h/week</p>` +
      `<p>${headline}</p><p>${focus}</p>` +
      (r.timed ? "" : `<p class="hint">You took the test untimed, so the real test may feel harder. Expect to be at the upper end of this range.</p>`);
  }

  function renderResults() {
    const r = lastResult;
    $("r-score").textContent = `${r.low}–${r.high}`;
    $("r-band").textContent = band(r.est);
    $("r-correct").textContent = `${r.correct}/${QS.length}`;
    $("r-weighted").textContent = Math.round(r.weighted * 100) + "%";
    $("r-time").textContent = fmtTime(r.used);
    const avg = r.used / QS.length;
    $("r-avg").textContent = fmtTime(avg);

    let pacing;
    if (avg > SECONDS_PER_QUESTION * 1.1) pacing = `You averaged ${fmtTime(avg)} per question, which is slower than the real test's pace of about ${fmtTime(SECONDS_PER_QUESTION)}. Build speed with timed sets.`;
    else if (avg < SECONDS_PER_QUESTION * 0.5 && r.correct < QS.length * 0.7) pacing = "You moved quickly but missed a fair number of questions. Slowing down and checking your work may raise your score.";
    else pacing = "Your pacing is in line with the real test.";
    $("r-pacing").textContent = pacing;

    $("r-topics").innerHTML = r.byTopic.map((t) => meterRow(t.name, t.ok, t.total)).join("");
    $("r-diff").innerHTML = r.byDiff.map((t) => meterRow(t.name, t.ok, t.total)).join("");

    $("r-review").innerHTML = r.rows.map((x) => {
      const q = x.q;
      const quantities = q.type === "qc" ? `<p>Quantity A: ${q.quantityA} &nbsp;|&nbsp; Quantity B: ${q.quantityB}</p>` : "";
      return `<details class="review-item"><summary>` +
        `<span class="mark ${x.ok ? "ok" : "no"}">${x.ok ? "✓" : "✗"}</span>` +
        `<span>Q${x.i + 1} · ${q.topic}</span>` +
        `<span class="review-meta">${DIFF_LABEL[q.difficulty]} · ${fmtTime(x.time)}</span></summary>` +
        `<div class="review-body">${q.prompt ? `<p>${q.prompt}</p>` : ""}${quantities}` +
        `<p><strong>Your answer:</strong> ${fmtAnswer(q, x.given)}</p>` +
        `<p><strong>Correct answer:</strong> ${fmtAnswer(q, q.answer)}</p>` +
        `<p>${q.explain}</p></div></details>`;
    }).join("");

    $("target").value = Math.min(170, Math.max(r.est + 5, 160));
    renderPlan();
  }

  function summaryText() {
    const r = lastResult;
    const lines = [
      `GRE Quant diagnostic, ${new Date().toISOString().slice(0, 10)} (${r.timed ? "timed" : "untimed"})`,
      `Estimated score: ${r.low}-${r.high}`,
      `Correct: ${r.correct}/${QS.length}, weighted accuracy ${Math.round(r.weighted * 100)}%`,
      `Time used: ${fmtTime(r.used)}`,
      "By area: " + r.byTopic.map((t) => `${t.name} ${t.ok}/${t.total}`).join(", "),
      "By difficulty: " + r.byDiff.map((t) => `${t.name} ${t.ok}/${t.total}`).join(", "),
      "Plan: " + $("plan-out").innerText.replace(/\s*\n+\s*/g, " ")
    ];
    return lines.join("\n");
  }

  function copySummary() {
    const text = summaryText();
    const done = () => { $("copy-btn").textContent = "Copied"; setTimeout(() => ($("copy-btn").textContent = "Copy summary"), 1500); };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done));
    } else fallbackCopy(text, done);
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); } catch (e) { alert(text); }
    ta.remove();
  }

  // ---------- wiring ----------

  $("start-btn").addEventListener("click", start);
  $("prev-btn").addEventListener("click", () => goTo(state.current - 1));
  $("next-btn").addEventListener("click", () => goTo(state.current + 1));
  $("flag-btn").addEventListener("click", () => {
    state.flagged[state.current] = !state.flagged[state.current];
    renderQuestion();
  });
  $("q-grid").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-q]");
    if (b) goTo(Number(b.dataset.q));
  });
  $("submit-btn").addEventListener("click", submit);
  $("target").addEventListener("input", renderPlan);
  $("hpw").addEventListener("input", renderPlan);
  $("copy-btn").addEventListener("click", copySummary);
  $("retake-btn").addEventListener("click", () => { renderHistory(); show("intro"); });
  window.addEventListener("beforeunload", (e) => {
    if (state && !$("test").hidden) { e.preventDefault(); e.returnValue = ""; }
  });

  renderHistory();
})();
