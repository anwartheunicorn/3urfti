// '3urfti — floating chat helper.
// For the prototype the helper is "rule-based": it looks for key words in the message
// and picks an answer. In the real app, getReply() is replaced by a call to the AI
// backend (POST /api/chat — see ARCHITECTURE.md §7). Everything else stays the same.

(() => {
  const { me, visibleProfiles, matchScore, sharedInterests, openProfile } = window.Dashboard;
  const fab = document.getElementById("bot-fab");
  const panel = document.getElementById("bot-panel");
  const log = document.getElementById("bot-log");
  const form = document.getElementById("bot-form");
  const input = document.getElementById("bot-input");
  let greeted = false;

  /* ---------- Open / close ---------- */
  function open() {
    panel.classList.remove("hidden");
    panel.classList.add("flex");
    fab.setAttribute("aria-expanded", "true");
    if (!greeted) {
      greeted = true;
      botSays(t("bot.hello", { name: loc(me.name).split(" ")[0] }));
    }
    input.focus();
  }
  function close() {
    panel.classList.add("hidden");
    panel.classList.remove("flex");
    fab.setAttribute("aria-expanded", "false");
    fab.focus();
  }
  fab.addEventListener("click", () => (panel.classList.contains("hidden") ? open() : close()));
  document.getElementById("bot-close").addEventListener("click", close);
  panel.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  /* ---------- Chat bubbles ---------- */
  const asText = (s) => escapeHtml(s).replace(/\n/g, "<br>");

  function addBubble(html, from) {
    const row = document.createElement("div");
    row.className = from === "user" ? "flex justify-end" : "flex justify-start gap-2";
    row.innerHTML = from === "user"
      ? `<div class="max-w-[85%] rounded-2xl rounded-ee-md bg-brand-600 px-4 py-2.5 text-sm text-white">${html}</div>`
      : `<div class="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-100 text-sm">🤖</div>
         <div class="max-w-[85%] rounded-2xl rounded-ss-md border border-sand-100 bg-white px-4 py-2.5 text-sm leading-relaxed text-slate-700 shadow-sm">${html}</div>`;
    log.append(row);
    log.scrollTop = log.scrollHeight;
    return row;
  }

  // Show "typing…" dots for a moment, then the answer
  function botSays(text, extraHtml = "") {
    const typing = addBubble('<span class="typing" aria-label="…"><span></span><span></span><span></span></span>', "bot");
    setTimeout(() => {
      typing.remove();
      addBubble(asText(text) + extraHtml, "bot");
    }, 550);
  }

  // Mini profile cards inside the chat
  function profileList(profiles) {
    return `<div class="mt-3 space-y-2">${profiles.map((p) => `
      <button type="button" data-bot-view="${escapeHtml(p.id)}" class="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-sand-50 p-2.5 text-start hover:border-brand-300">
        ${UI.avatar(p, "sm")}
        <span class="min-w-0 flex-1">
          <span class="block truncate font-semibold text-brand-950">${escapeHtml(loc(p.name))}</span>
          <span class="block truncate text-xs text-slate-500">${escapeHtml(studentUni(p))} · ${escapeHtml(t("card.match", { n: matchScore(p) }))}</span>
        </span>
        <span class="text-xs font-bold text-brand-600">${escapeHtml(t("bot.view"))}</span>
      </button>`).join("")}</div>`;
  }

  log.addEventListener("click", (e) => {
    const button = e.target.closest("[data-bot-view]");
    if (button) openProfile(button.dataset.botView);
  });

  /* ---------- Understanding the message ---------- */
  const INTENTS = [
    { name: "gender", words: ["gender", "male", "female", "boys", "girls", "guys", "الجنس", "بنات", "شباب", "اولاد", "ذكور", "اناث", "من يمكنني"] },
    { name: "safety", words: ["safe", "safety", "scam", "danger", "meet up", "امان", "امن", "سلامه", "احتيال", "نصب"] },
    { name: "housing", words: ["rent", "budget", "lease", "contract", "apartment", "flat", "dorm", "bills", "housing", "ايجار", "اجار", "ميزانيه", "عقد", "شقه", "فواتير", "السكن الجامعي", "نصائح السكن", "سكن جامعي"] },
    { name: "match", words: ["match", "roommate", "room mate", "suggest", "recommend", "find", "people", "friend", "شريك", "اقترح", "رشح", "ابحث", "تطابق", "توافق", "اصدقاء", "صديق", "ربع"] },
    { name: "connect", words: ["connect", "request", "add someone", "تواصل", "اتواصل", "طلب", "اضافه"] },
    { name: "filters", words: ["filter", "search", "year", "university", "major", "فلتر", "بحث", "تصفيه", "سنه", "جامعه", "تخصص"] },
    { name: "thanks", words: ["thank", "thx", "شكرا", "مشكور", "يعطيك العافيه"] },
    { name: "greet", words: ["hi", "hello", "hey", "salam", "marhaba", "مرحبا", "السلام", "هلا", "اهلا"] },
  ];

  const hasArabic = (s) => /[؀-ۿ]/.test(s);

  // English words must start a word ("hi" should not match "this"); Arabic words can appear anywhere
  function mentions(text, word) {
    const w = normalizeText(word);
    return hasArabic(w) ? text.includes(w) : ` ${text.replace(/[^a-z0-9؀-ۿ]+/g, " ")} `.includes(` ${w}`);
  }

  function findInterest(text) {
    return INTERESTS.find((i) => [i.key, i.en, i.ar, i.ar.replace(/^ال/, ""), ...i.words].some((w) => mentions(text, w)));
  }

  /* ---------- Choosing the answer ---------- */
  function topMatches(list) {
    return list.sort((a, b) => matchScore(b) - matchScore(a)).slice(0, 3);
  }

  function answer(intent, interest) {
    if (interest) {
      const people = topMatches(visibleProfiles().filter((p) => p.interests.includes(interest.key)));
      const name = loc(interest);
      return people.length
        ? botSays(t("bot.interestMatches", { interest: name }), profileList(people))
        : botSays(t("bot.noInterest", { interest: name }));
    }

    switch (intent) {
      case "match": {
        const people = topMatches(visibleProfiles().filter((p) => sharedInterests(p).length > 0));
        return people.length ? botSays(t("bot.matches"), profileList(people)) : botSays(t("bot.noMatches"));
      }
      case "gender":
        return botSays(t("bot.gender", { group: t(`g.${me.gender}.group`) }));
      case "connect": return botSays(t("bot.connect"));
      case "housing": return botSays(t("bot.housing"));
      case "safety": return botSays(t("bot.safety"));
      case "filters": return botSays(t("bot.filters"));
      case "thanks": return botSays(t("bot.thanks"));
      case "greet": return botSays(t("bot.greet"));
      default: return botSays(t("bot.fallback"));
    }
  }

  function getReply(message) {
    const text = normalizeText(message);
    const interest = findInterest(text);
    const intent = INTENTS.find((i) => i.words.some((w) => mentions(text, w)))?.name;
    // Questions about safety / housing / gender win over a hobby word in the same sentence
    const important = ["gender", "safety", "housing", "connect"].includes(intent);
    answer(intent, important ? null : interest);
  }

  /* ---------- Sending ---------- */
  function send(message, intent) {
    addBubble(escapeHtml(message), "user");
    intent ? answer(intent) : getReply(message);
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const message = input.value.trim();
    if (!message) return;
    input.value = "";
    send(message);
  });

  panel.addEventListener("click", (e) => {
    const chip = e.target.closest("[data-bot-chip]");
    if (chip) send(chip.textContent.trim(), chip.dataset.botChip);
  });
})();
