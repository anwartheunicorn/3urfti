// '3urfti — Discovery Dashboard
// Search & filters, profile cards, the expanded profile window and "Ask to Connect".

const me = Store.current();
if (!me) {
  location.replace("index.html");
  throw new Error("Not logged in"); // stop running this file
}

const $ = (id) => document.getElementById(id);
const grid = $("results-grid");
const profileModal = $("profile-modal");
// uni / majorPicked = picked from the list (exact match); uniText / major = whatever was typed in those boxes
// budgetCurrency starts as your own budget's currency (or KD)
const state = { q: "", year: "", budgetMin: "", budgetMax: "", budgetCurrency: me.budget?.currency || "KWD", uni: "", uniText: "", major: "", majorPicked: "", looking: "", interests: new Set() };
let openId = null;

/* ---------- 🔒 Gender separation ----------
   Every list on this page comes from visibleProfiles(), so a student can never see,
   be matched with, or connect with someone of a different gender — whatever filters
   they choose. The real backend enforces the same rule on the server (ARCHITECTURE.md §5). */
function canSee(profile) {
  return Boolean(profile) && profile.gender === me.gender && profile.id !== me.id;
}
function visibleProfiles() {
  return Store.allProfiles().filter(canSee);
}

/* ---------- Matching ---------- */
function sharedInterests(p) {
  return p.interests.filter((i) => me.interests.includes(i));
}
// Someone who needs a place to stay and someone who wants a roommate can live together
const wantsHousing = (goal) => goal === "roommate" || goal === "place";
function goalsFit(p) {
  if (wantsHousing(me.lookingFor) && wantsHousing(p.lookingFor)) return true;
  return me.lookingFor === "both" || p.lookingFor === "both" || me.lookingFor === p.lookingFor;
}
function matchScore(p) {
  const union = new Set([...p.interests, ...me.interests]).size || 1;
  let score = 40 + Math.round((sharedInterests(p).length / union) * 45);
  if (normalizeText(studentUni(p)) === normalizeText(studentUni(me))) score += 10; // same campus
  if (goalsFit(p)) score += 4;
  return Math.min(score, 99);
}

/* ---------- Filtering ---------- */
function filteredProfiles() {
  const q = normalizeText(state.q);
  return visibleProfiles()
    .filter((p) => {
      if (q) {
        const uni = UNIVERSITIES.find((u) => u.key === p.university);
        const text = normalizeText([p.name.en, p.name.ar, p.major?.en, p.major?.ar, uni?.en, uni?.ar, p.customUni, p.from?.en, p.from?.ar].join(" "));
        if (!text.includes(q)) return false;
      }
      if (state.year && p.year !== state.year) return false;
      // Budget: keep students whose range overlaps the one you typed (students with no budget are hidden)
      // Both budgets are turned into US dollars first, so KD, £, $… can be compared
      const wanted = makeBudget(state.budgetMin, state.budgetMax, state.budgetCurrency);
      if (wanted) {
        if (!p.budget) return false;
        const mine = budgetInDollars(wanted);
        const theirs = budgetInDollars(p.budget);
        if (theirs.max < mine.min || theirs.min > mine.max) return false;
      }
      if (state.uni && p.university !== state.uni) return false;
      // Typed (not picked) college: match any part of the name, in English or Arabic
      if (state.uniText) {
        const uni = UNIVERSITIES.find((u) => u.key === p.university);
        const names = normalizeText([uni?.en, uni?.ar, p.customUni].join(" "));
        if (!names.includes(normalizeText(state.uniText))) return false;
      }
      if (state.majorPicked && p.major?.en !== state.majorPicked) return false;
      if (state.major && !normalizeText([p.major?.en, p.major?.ar].join(" ")).includes(normalizeText(state.major))) return false;
      if (state.looking) {
        // "Roommate + friends" students count for those two filters, but not for "Place to stay"
        const alsoBoth = state.looking !== "place" && p.lookingFor === "both";
        if (p.lookingFor !== state.looking && !alsoBoth) return false;
      }
      if (state.interests.size && !p.interests.some((i) => state.interests.has(i))) return false;
      return true;
    })
    .sort((a, b) => matchScore(b) - matchScore(a));
}

/* ---------- Small building blocks ---------- */
function interestTag(key, highlighted) {
  const look = highlighted ? "border-brand-200 bg-brand-50 text-brand-700" : "border-slate-200 bg-slate-50 text-slate-600";
  return `<span class="rounded-full border px-2.5 py-1 text-xs font-medium ${look}">${escapeHtml(interestLabel(key))}</span>`;
}

// The button changes with where you stand with this student:
// nothing yet → "Ask to Connect", you asked → "Request sent", they asked → "Accept request", connected → "Message"
function connectButton(p, size = "sm") {
  const relation = Store.relation(me.id, p.id);
  const padding = size === "lg" ? "px-6 py-3.5 text-base" : "flex-1 whitespace-nowrap px-3 py-2.5 text-sm";
  const solid = "border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-600/25 hover:bg-brand-700";
  const soft = "border-brand-200 bg-brand-50 text-brand-700 hover:bg-brand-100";
  const states = {
    null: { look: solid, icon: ICONS.userPlus, label: "connect.ask" },
    sent: { look: soft, icon: ICONS.check, label: "connect.pending" },
    received: { look: solid, icon: ICONS.check, label: "connect.accept" },
    friends: { look: solid, icon: ICONS.chat, label: "connect.message" },
  };
  const s = states[relation];
  return `<button type="button" data-action="connect" data-id="${escapeHtml(p.id)}" aria-pressed="${relation === "sent"}"
      ${relation === "sent" ? `title="${escapeHtml(t("connect.cancelTip"))}"` : ""}
      class="inline-flex items-center justify-center gap-1.5 rounded-xl border font-semibold transition ${padding} ${s.look}">
      ${s.icon}<span>${escapeHtml(t(s.label))}</span>
    </button>`;
}

/* ---------- Profile cards ---------- */
function cardHtml(p) {
  const shared = new Set(sharedInterests(p));
  const major = loc(p.major);
  const extra = p.interests.length - 4;
  return `
    <article data-id="${escapeHtml(p.id)}" tabindex="0" aria-label="${escapeHtml(loc(p.name))}"
      class="profile-card flex cursor-pointer flex-col rounded-3xl border border-sand-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-xl">
      <div class="flex items-start gap-3">
        ${UI.avatar(p, "md")}
        <div class="min-w-0 flex-1">
          <h3 class="text-lg font-bold leading-snug text-brand-950">${escapeHtml(loc(p.name))}</h3>
          <p class="truncate text-sm text-slate-500">${escapeHtml([p.year && t("yearShort." + p.year), major].filter(Boolean).join(" · "))}</p>
        </div>
        <span class="shrink-0 rounded-full bg-sand-100 px-2.5 py-1 text-xs font-bold text-sand-800">${escapeHtml(t("card.match", { n: matchScore(p) }))}</span>
      </div>
      <p class="mt-3 flex items-center gap-1.5 text-sm text-slate-600">${ICONS.cap}<span class="truncate">${escapeHtml(studentUni(p))}</span></p>
      ${p.from ? `<p class="mt-1 flex items-center gap-1.5 text-sm text-slate-600">${ICONS.pin}<span class="truncate">${escapeHtml(t("card.from", { place: loc(p.from) }))}</span></p>` : ""}
      ${p.budget ? `<p class="mt-1 flex items-center gap-1.5 text-sm text-slate-600"><span aria-hidden="true">💰</span><span class="truncate">${escapeHtml(budgetText(p.budget))}</span></p>` : ""}
      <p class="mt-1 text-sm font-medium text-brand-700">${escapeHtml(t("lf.badge." + p.lookingFor))}</p>
      <div class="mt-3 flex flex-wrap gap-1.5">
        ${p.interests.slice(0, 4).map((i) => interestTag(i, shared.has(i))).join("")}
        ${extra > 0 ? `<span class="rounded-full border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-500">+${extra}</span>` : ""}
      </div>
      <div class="mt-auto flex gap-2 pt-5">
        <button type="button" data-action="view" aria-label="${escapeHtml(t("card.view"))}" title="${escapeHtml(t("card.view"))}" class="grid w-12 shrink-0 place-items-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50">${ICONS.eye}</button>
        ${connectButton(p, "card")}
      </div>
    </article>`;
}

function renderResults() {
  const list = filteredProfiles();
  grid.innerHTML = list.map(cardHtml).join("");
  $("results-count").textContent = t("results.count", { n: list.length });
  $("results-empty").classList.toggle("hidden", list.length > 0);
}

/* ---------- Expanded profile window ---------- */
function infoBox(labelKey, value) {
  return `<div class="rounded-2xl bg-sand-50 p-3.5">
      <p class="text-xs font-semibold uppercase tracking-wide text-slate-400">${escapeHtml(t(labelKey))}</p>
      <p class="mt-0.5 font-semibold text-brand-950">${escapeHtml(value || "—")}</p>
    </div>`;
}

function renderModal() {
  const p = Store.findById(openId);
  if (!canSee(p)) return; // 🔒 same rule again
  const shared = sharedInterests(p);
  const bio = loc(p.bio);

  $("profile-body").innerHTML = `
    <div class="relative h-28 bg-gradient-to-br from-brand-600 to-brand-900 sm:rounded-t-3xl">
      <button type="button" data-close class="absolute end-3 top-3 rounded-xl bg-white/15 p-2 text-white hover:bg-white/25" aria-label="${escapeHtml(t("modal.close"))}">${ICONS.close}</button>
    </div>
    <div class="px-6 pb-6 sm:px-8">
      <div class="relative z-10 -mt-12 flex flex-wrap items-end justify-between gap-3">
        ${UI.avatar(p, "lg")}
        <span class="mb-1 rounded-full bg-sand-100 px-3 py-1.5 text-sm font-bold text-sand-800">${escapeHtml(t("card.match", { n: matchScore(p) }))}</span>
      </div>
      <h2 id="profile-name" class="mt-3 text-2xl font-extrabold text-brand-950">${escapeHtml(loc(p.name))}</h2>
      <p class="mt-1 flex items-center gap-1.5 text-slate-600">${ICONS.cap}${escapeHtml(studentUni(p))}</p>
      ${p.from ? `<p class="mt-1 flex items-center gap-1.5 text-slate-600">${ICONS.pin}${escapeHtml(t("card.from", { place: loc(p.from) }))}</p>` : ""}
      ${p.budget ? `<p class="mt-1 flex items-center gap-1.5 text-slate-600"><span aria-hidden="true">💰</span>${escapeHtml(budgetText(p.budget))}</p>` : ""}

      <div class="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        ${infoBox("profile.year", yearLabel(p.year))}
        ${infoBox("profile.major", loc(p.major))}
        ${infoBox("profile.lookingFor", t("lf." + p.lookingFor))}
        ${infoBox("profile.uni", studentUni(p))}
      </div>

      <h3 class="mt-6 font-bold text-brand-950">${escapeHtml(t("profile.about"))}</h3>
      <p class="mt-1.5 leading-relaxed text-slate-600">${escapeHtml(bio || t("profile.noBio"))}</p>

      <h3 class="mt-6 font-bold text-brand-950">${escapeHtml(t("profile.interests"))}</h3>
      <div class="mt-2 flex flex-wrap gap-1.5">${p.interests.map((i) => interestTag(i, shared.includes(i))).join("")}</div>

      <div class="mt-4 rounded-2xl border border-brand-100 bg-brand-50 p-4 text-sm">
        ${shared.length
          ? `<p class="font-semibold text-brand-800">✨ ${escapeHtml(t("profile.shared"))}: ${shared.map((i) => escapeHtml(interestLabel(i))).join(" · ")}</p>`
          : `<p class="text-brand-800">${escapeHtml(t("profile.noShared"))}</p>`}
      </div>

      <div class="sticky bottom-0 -mx-6 mt-6 border-t border-slate-100 bg-white/95 px-6 pb-1 pt-4 backdrop-blur sm:-mx-8 sm:px-8">
        <div class="flex flex-col gap-2">${connectButton(p, "lg")}</div>
        <p class="mt-2 text-center text-xs text-slate-500">${escapeHtml(t("profile.safety"))}</p>
      </div>
    </div>`;
}

function openProfile(id) {
  if (!canSee(Store.findById(id))) return;
  openId = id;
  renderModal();
  UI.openModal("profile-modal");
}

/* ---------- Ask to Connect ---------- */
function toggleConnect(id) {
  const p = Store.findById(id);
  if (!canSee(p)) return; // 🔒 never allow a request across genders
  const name = loc(p.name).split(" ")[0];

  const relation = Store.relation(me.id, id);
  if (relation === "friends") return Inbox.openChat(id); // already connected: go to the chat
  if (relation === "received") {
    Store.accept(me.id, id);
    UI.toast(t("inbox.nowFriends", { name }));
  } else if (relation === "sent") {
    Store.setConnection(me.id, id, null);
    UI.toast(t("connect.canceled", { name }));
  } else {
    Store.setConnection(me.id, id, "pending");
    UI.toast(t("connect.toast", { name }));
    Inbox.simulateAccept(id);
  }

  renderResults();
  if (!profileModal.classList.contains("hidden")) renderModal();
  updateRequestCount();
  document.querySelectorAll(`[data-action="connect"][data-id="${CSS.escape(id)}"]`).forEach((b) => b.classList.add("pop"));
}

function updateRequestCount() {
  // The red number on the top bar = requests waiting for your answer (hidden when there are none)
  const waiting = Store.idsWith(me.id, "received").map(Store.findById).filter(canSee).length;
  $("req-count").textContent = waiting;
  $("req-count").classList.toggle("hidden", !waiting);
  $("req-count").classList.toggle("grid", waiting > 0);
}

/* ---------- Filter panel ---------- */
function renderFilters() {
  $("f-year").innerHTML = `<option value="">${escapeHtml(t("filter.anyYear"))}</option>` +
    COLLEGE_YEARS.map((y) => `<option value="${y}">${escapeHtml(yearLabel(y))}</option>`).join("");
  $("f-year").value = state.year;
  UI.fillCurrencySelect($("f-budget-currency"), state.budgetCurrency);
  // Show a picked college or major in the current language
  if (state.uni) $("f-uni").value = uniName(state.uni);
  if (state.majorPicked) $("f-major").value = loc(MAJORS.find((m) => m.en === state.majorPicked));
  $("f-gender-icon").innerHTML = ICONS.lock;
  $("f-gender-label").textContent = t(me.gender === "female" ? "filter.femaleOnly" : "filter.maleOnly");
  $("f-interests").innerHTML = INTERESTS.map((i) =>
    `<button type="button" class="chip !px-2.5 !py-1 !text-xs" data-interest="${i.key}" aria-pressed="${state.interests.has(i.key)}">${escapeHtml(interestLabel(i.key))}</button>`
  ).join("");
}

$("f-search").addEventListener("input", (e) => { state.q = e.target.value; renderResults(); });
$("f-year").addEventListener("change", (e) => { state.year = e.target.value; renderResults(); });
$("f-budget-min").addEventListener("input", (e) => { state.budgetMin = e.target.value; renderResults(); });
$("f-budget-max").addEventListener("input", (e) => { state.budgetMax = e.target.value; renderResults(); });
$("f-budget-currency").addEventListener("change", (e) => { state.budgetCurrency = e.target.value; renderResults(); });

// University & major: results update as you type; picking from the list narrows it exactly
UI.searchBox({
  input: $("f-uni"), items: universityItems, icon: ICONS.cap, allowCustom: true, customText: "search.for",
  onPick: (item) => {
    // A college from our list → exact match. Anything else (typed by you or other students) → match the words
    const listed = item.value && item.value !== "other";
    Object.assign(state, listed ? { uni: item.value, uniText: "" } : { uni: "", uniText: item.label });
    renderResults();
  },
});
$("f-uni").addEventListener("input", (e) => { Object.assign(state, { uni: "", uniText: e.target.value.trim() }); renderResults(); });
UI.searchBox({
  input: $("f-major"), items: majorItems, allowCustom: true, customText: "search.for",
  onPick: (item) => {
    Object.assign(state, item.custom ? { majorPicked: "", major: item.label } : { majorPicked: item.major.en, major: "" });
    renderResults();
  },
});
$("f-major").addEventListener("input", (e) => { Object.assign(state, { majorPicked: "", major: e.target.value.trim() }); renderResults(); });
document.querySelectorAll('input[name="looking"]').forEach((radio) =>
  radio.addEventListener("change", () => { state.looking = radio.value; renderResults(); })
);

$("f-interests").addEventListener("click", (e) => {
  const chip = e.target.closest("[data-interest]");
  if (!chip) return;
  const key = chip.dataset.interest;
  state.interests.has(key) ? state.interests.delete(key) : state.interests.add(key);
  chip.setAttribute("aria-pressed", state.interests.has(key));
  renderResults();
});

$("f-reset").addEventListener("click", () => {
  Object.assign(state, { q: "", year: "", budgetMin: "", budgetMax: "", budgetCurrency: me.budget?.currency || "KWD", uni: "", uniText: "", major: "", majorPicked: "", looking: "" });
  state.interests.clear();
  ["f-search", "f-year", "f-budget-min", "f-budget-max", "f-uni", "f-major"].forEach((id) => { $(id).value = ""; });
  document.querySelector('input[name="looking"][value=""]').checked = true;
  renderFilters();
  renderResults();
});

$("filters-toggle").addEventListener("click", (e) => {
  const body = $("filters-body");
  body.classList.toggle("hidden");
  e.currentTarget.setAttribute("aria-expanded", !body.classList.contains("hidden"));
});

/* ---------- Arrow that pushes the Search & filter panel to the side (big screens) ----------
   The choice is remembered, so the panel stays where the student left it. */
let panelCollapsed = (() => { try { return localStorage.getItem("3urfti.panel") === "side"; } catch { return false; } })();

function updatePanel() {
  $("discover-layout").classList.toggle("panel-collapsed", panelCollapsed);
  const label = t(panelCollapsed ? "filter.show" : "filter.hide");
  $("panel-toggle").setAttribute("aria-expanded", !panelCollapsed);
  $("panel-toggle").setAttribute("aria-label", label);
  $("panel-toggle").title = label;
}

$("filter-panel").addEventListener("click", (e) => {
  // The arrow always works; when pushed to the side, clicking anywhere on the slim bar brings it back
  if (!e.target.closest("#panel-toggle") && !panelCollapsed) return;
  panelCollapsed = !panelCollapsed;
  try { localStorage.setItem("3urfti.panel", panelCollapsed ? "side" : "open"); } catch {}
  updatePanel();
});

/* ---------- Clicks on cards and inside the profile window ---------- */
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".profile-card");
  if (!card) return;
  if (e.target.closest('[data-action="connect"]')) toggleConnect(card.dataset.id);
  else openProfile(card.dataset.id);
});
grid.addEventListener("keydown", (e) => {
  const card = e.target.closest(".profile-card");
  if (card && e.target === card && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); openProfile(card.dataset.id); }
});
$("profile-body").addEventListener("click", (e) => {
  const button = e.target.closest('[data-action="connect"]');
  if (button) toggleConnect(button.dataset.id);
});

$("logout").addEventListener("click", () => { Store.logout(); location.href = "index.html"; });

/* ---------- Customize my look: icon, icon colour and page background ---------- */
const ALL_BACKGROUNDS = [...PAGE_BACKGROUNDS, ...PREMIUM_BACKGROUNDS];
// "custom" = the student's own uploaded photo (also a premium option)
const isPremiumBg = (key) => key === "custom" || PREMIUM_BACKGROUNDS.some((b) => b.key === key);

// The uploaded photo as a background, with a see-through white layer on top so text stays easy to read
function photoBackground() {
  const photo = Store.bgImage(me.id);
  return photo && { key: "custom", css: `linear-gradient(rgba(255,255,255,.45), rgba(255,255,255,.45)), url('${photo}') center / cover no-repeat` };
}

function myBackground() {
  const picked = me.look?.background === "custom" ? photoBackground() : ALL_BACKGROUNDS.find((b) => b.key === me.look?.background);
  // A premium background only shows if this student has paid for it
  if (!picked || (isPremiumBg(picked.key) && !Store.hasPremium(me.id))) return PAGE_BACKGROUNDS[0];
  return picked;
}

// Put a background on an element (the page, the preview box or a tile)
function paintBackground(el, bg) {
  el.style.background = bg.css;
  el.classList.toggle("bg-animated", !!bg.animated);
}

function renderLook() {
  const look = me.look || {};
  const myColor = UI.avatarColor(me).key;
  const myBg = myBackground();

  paintBackground($("look-preview"), myBg);
  $("look-preview").innerHTML = `${UI.avatar(me, "md")}
    <div><p class="font-bold text-brand-950">${escapeHtml(loc(me.name))}</p>
    <p class="text-sm text-slate-600">${escapeHtml(t("look.preview"))}</p></div>`;

  // Photo tile: a little preview of your photo, or an "Upload" button if you haven't added one
  const usingPhoto = look.icon === "photo" && !!me.photo;
  $("look-photo").innerHTML = `
    <div class="flex items-center gap-3">
      <button type="button" data-look="icon" data-value="photo" aria-pressed="${usingPhoto}"
        class="flex flex-1 items-center gap-3 rounded-xl border-2 border-dashed border-brand-200 bg-brand-50/50 p-2.5 text-start text-sm font-bold text-brand-800 transition hover:border-brand-400 aria-pressed:border-solid aria-pressed:border-brand-500 aria-pressed:bg-brand-50">
        ${me.photo
          ? `<img src="${escapeHtml(me.photo)}" alt="" class="h-12 w-12 shrink-0 rounded-full object-cover">`
          : '<span class="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white text-2xl shadow-sm" aria-hidden="true">📷</span>'}
        <span>${escapeHtml(t(me.photo ? "look.photoUse" : "look.photoUpload"))}</span>
      </button>
      ${me.photo ? `
        <div class="flex shrink-0 flex-col gap-1 text-xs font-semibold">
          <button type="button" id="photo-change" class="rounded-lg px-2 py-1 text-brand-700 hover:bg-brand-50">${escapeHtml(t("look.photoChange"))}</button>
          <button type="button" id="photo-remove" class="rounded-lg px-2 py-1 text-rose-600 hover:bg-rose-50">${escapeHtml(t("look.photoRemove"))}</button>
        </div>` : ""}
    </div>`;

  if (document.activeElement !== $("look-from")) $("look-from").value = me.from ? loc(me.from) : "";
  if (![$("look-budget-min"), $("look-budget-max")].includes(document.activeElement)) {
    $("look-budget-min").value = me.budget?.min ?? "";
    $("look-budget-max").value = me.budget?.max ?? "";
  }
  UI.fillCurrencySelect($("look-budget-currency"), me.budget?.currency);

  $("look-icons").innerHTML = AVATAR_ICONS.map((icon) => `
    <button type="button" data-look="icon" data-value="${icon}" aria-pressed="${(look.icon || "") === icon}" aria-label="${escapeHtml(icon || t("look.initials"))}"
      class="grid aspect-square place-items-center rounded-xl border-2 border-slate-100 bg-slate-50 text-2xl transition hover:border-brand-200 aria-pressed:border-brand-500 aria-pressed:bg-brand-50">
      ${icon || '<span class="text-sm font-bold text-slate-600">Aa</span>'}
    </button>`).join("");

  $("look-colors").innerHTML = AVATAR_COLORS.map((c) => `
    <button type="button" data-look="color" data-value="${c.key}" aria-pressed="${c.key === myColor}" aria-label="${escapeHtml(t("color." + c.key))}" title="${escapeHtml(t("color." + c.key))}"
      class="h-10 w-10 rounded-full ${c.cls} ring-offset-2 transition hover:scale-110 aria-pressed:ring-4 aria-pressed:ring-brand-300"></button>`).join("");

  $("look-backgrounds").innerHTML = PAGE_BACKGROUNDS.map((b) => `
    <button type="button" data-look="background" data-value="${b.key}" aria-pressed="${b.key === myBg.key}" style="background: ${b.css}"
      class="h-14 rounded-xl border-2 border-slate-200 text-xs font-semibold text-slate-600 transition hover:border-brand-300 aria-pressed:border-brand-500 aria-pressed:ring-2 aria-pressed:ring-brand-200">
      ${escapeHtml(t("bg." + b.key))}
    </button>`).join("");

  // Premium tiles: a 🔒 on each one until the student has paid
  const unlocked = Store.hasPremium(me.id);
  const badge = $("look-premium-badge");
  badge.disabled = unlocked;
  badge.textContent = unlocked ? t("look.owned") : t("look.unlock", { price: loc(PREMIUM_PRICE) });
  $("look-premium").innerHTML = PREMIUM_BACKGROUNDS.map((b) => `
    <button type="button" data-look="background" data-value="${b.key}" aria-pressed="${b.key === myBg.key}" style="background: ${b.css}"
      class="${b.animated ? "bg-animated " : ""}relative h-16 rounded-xl border-2 border-amber-200 text-xs font-bold text-slate-700 transition hover:border-amber-400 aria-pressed:border-brand-500 aria-pressed:ring-2 aria-pressed:ring-brand-200">
      ${unlocked ? "" : `<span class="absolute end-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-amber-600 shadow-sm">${ICONS.lock}</span>`}
      <span class="rounded-md bg-white/80 px-1.5 py-0.5">${escapeHtml(t("bg." + b.key))}</span>
    </button>`).join("") + photoTile(unlocked);
  $("look-upload-new").classList.toggle("hidden", !(unlocked && Store.bgImage(me.id)));
}

// The wide "Upload your own photo" tile under the premium backgrounds.
// Once a photo is uploaded, the tile shows it as a little preview.
function photoTile(unlocked) {
  const photo = Store.bgImage(me.id);
  return `
    <button type="button" data-look="background" data-value="custom" aria-pressed="${me.look?.background === "custom" && unlocked && !!photo}"
      ${photo ? `style="background: url('${photo}') center / cover"` : ""}
      class="relative col-span-3 flex h-16 items-center justify-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 text-sm font-bold text-slate-700 transition hover:border-amber-400 aria-pressed:border-solid aria-pressed:border-brand-500 aria-pressed:ring-2 aria-pressed:ring-brand-200">
      ${unlocked ? "" : `<span class="absolute end-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-white/90 text-amber-600 shadow-sm">${ICONS.lock}</span>`}
      <span class="rounded-md bg-white/85 px-2 py-0.5">📷 ${escapeHtml(t(photo ? "bg.custom" : "bg.customUpload"))}</span>
    </button>`;
}

/* ---------- Upload your own background photo (premium) ---------- */
// Big phone photos are shrunk first (max 1600px wide or tall) so they fit in the browser's storage.
// square: true cuts a square out of the middle of the photo (for round profile photos).
function shrinkImage(file, maxSize = 1600, square = false) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const width = square ? side : img.width;
      const height = square ? side : img.height;
      const scale = Math.min(1, maxSize / Math.max(width, height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(width * scale);
      canvas.height = Math.round(height * scale);
      canvas.getContext("2d").drawImage(img, (img.width - width) / 2, (img.height - height) / 2, width, height, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.8));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("image")); };
    img.src = url;
  });
}

$("bg-upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = ""; // so picking the same file again still works
  if (!file) return;
  if (!file.type.startsWith("image/")) { UI.toast(t("photo.bad")); return; }
  try {
    const dataUrl = await shrinkImage(file);
    if (!Store.setBgImage(me.id, dataUrl)) { UI.toast(t("photo.big")); return; }
    me.look = Store.setLook(me.id, { background: "custom" });
    renderAll();
    UI.toast(t("photo.saved"));
  } catch {
    UI.toast(t("photo.bad"));
  }
});

$("look-upload-new").addEventListener("click", () => $("bg-upload").click());

/* ---------- Where you're from (optional) ---------- */
function saveFrom(place) {
  me.from = place;
  Store.setDetails(me.id, { from: place });
  renderAll();
  UI.toast(t(place ? "from.saved" : "from.removed"));
}
UI.searchBox({
  input: $("look-from"), items: placeItems, allowCustom: true, icon: ICONS.pin,
  onPick: (item) => saveFrom(item.custom ? { en: item.label, ar: item.label } : item.place),
});
// Typed something and left the box without picking? Save it anyway. Emptied the box? Remove it.
$("look-from").addEventListener("change", (e) => {
  const typed = e.target.value.trim();
  if (!typed) { if (me.from) saveFrom(null); return; }
  if (me.from && loc(me.from) === typed) return; // already saved
  const known = COUNTRIES.find((c) => normalizeText(c.en) === normalizeText(typed) || normalizeText(c.ar) === normalizeText(typed));
  saveFrom(known ? { en: known.en, ar: known.ar } : { en: typed, ar: typed });
});

/* ---------- Monthly rent budget (optional) ---------- */
// Saves when you leave either box (or press Enter)
["look-budget-min", "look-budget-max", "look-budget-currency"].forEach((id) => $(id).addEventListener("change", () => {
  const budget = makeBudget($("look-budget-min").value, $("look-budget-max").value, $("look-budget-currency").value);
  if (JSON.stringify(budget) === JSON.stringify(me.budget ?? null)) return; // nothing changed
  me.budget = budget;
  Store.setDetails(me.id, { budget });
  renderAll();
  UI.toast(t(budget ? "budget.saved" : "budget.removed"));
}));

/* ---------- Upload your own profile photo (free) ---------- */
$("photo-upload").addEventListener("change", async (e) => {
  const file = e.target.files[0];
  e.target.value = ""; // so picking the same file again still works
  if (!file) return;
  if (!file.type.startsWith("image/")) { UI.toast(t("photo.bad")); return; }
  try {
    const dataUrl = await shrinkImage(file, 320, true); // small and square: perfect for a round icon
    if (!Store.setPhoto(me.id, dataUrl)) { UI.toast(t("photo.big")); return; }
    me.photo = dataUrl;
    me.look = Store.setLook(me.id, { icon: "photo" });
    renderAll();
    UI.toast(t("photo.profileSaved"));
  } catch {
    UI.toast(t("photo.bad"));
  }
});

// "Change" and "Remove" are drawn inside the window, so listen on the whole photo area
$("look-photo").addEventListener("click", (e) => {
  if (e.target.closest("#photo-change")) $("photo-upload").click();
  if (e.target.closest("#photo-remove")) {
    Store.setPhoto(me.id, null);
    me.photo = undefined;
    if (me.look?.icon === "photo") me.look = Store.setLook(me.id, { icon: "" });
    renderAll();
    UI.toast(t("photo.removed"));
  }
});

/* ---------- Premium: a pretend checkout (no card details, no real money) ---------- */
let wantedBackground = null; // the locked background the student clicked, so we can switch to it after paying

function renderPremium() {
  $("premium-tiles").innerHTML = PREMIUM_BACKGROUNDS.map((b) => `
    <div style="background: ${b.css}" class="${b.animated ? "bg-animated " : ""}grid h-16 place-items-end rounded-xl border border-slate-200 p-1">
      <span class="rounded-md bg-white/80 px-1.5 py-0.5 text-xs font-bold text-slate-700">${escapeHtml(t("bg." + b.key))}</span>
    </div>`).join("") + `
    <div class="col-span-3 grid h-12 place-items-center rounded-xl border-2 border-dashed border-amber-300 bg-amber-50 text-sm font-bold text-slate-700">📷 ${escapeHtml(t("bg.customUpload"))}</div>`;
  $("premium-buy").textContent = t("prem.buy", { price: loc(PREMIUM_PRICE) });
}

function openPremium(backgroundKey) {
  wantedBackground = backgroundKey || null;
  renderPremium();
  UI.openModal("premium-modal");
}

$("look-premium-badge").addEventListener("click", () => openPremium());

$("premium-buy").addEventListener("click", () => {
  const button = $("premium-buy");
  button.disabled = true;
  button.textContent = t("prem.paying");
  // Wait a moment so it feels like a real payment
  setTimeout(() => {
    Store.buyPremium(me.id);
    const wantsPhoto = wantedBackground === "custom" && !Store.bgImage(me.id);
    if (wantedBackground && !wantsPhoto) me.look = Store.setLook(me.id, { background: wantedBackground });
    button.disabled = false;
    UI.closeModal("premium-modal");
    renderAll();
    UI.toast(t("prem.thanks"));
    if (wantsPhoto) $("bg-upload").click(); // they clicked "Upload your own photo", so open the file picker now
  }, 1200);
});

// Clicking any choice saves it straight away and redraws the page
$("look-modal").addEventListener("click", (e) => {
  const choice = e.target.closest("[data-look]");
  if (!choice) return;
  // Locked premium background? Show the unlock window instead of saving it
  if (choice.dataset.look === "background" && isPremiumBg(choice.dataset.value) && !Store.hasPremium(me.id)) {
    openPremium(choice.dataset.value);
    return;
  }
  // "Upload your own photo" with no photo yet? Open the file picker
  if (choice.dataset.value === "custom" && !Store.bgImage(me.id)) {
    $("bg-upload").click();
    return;
  }
  // Same for the profile photo tile
  if (choice.dataset.value === "photo" && !me.photo) {
    $("photo-upload").click();
    return;
  }
  me.look = Store.setLook(me.id, { [choice.dataset.look]: choice.dataset.value });
  renderAll();
  $("look-modal").querySelector(`[data-look="${choice.dataset.look}"][data-value="${choice.dataset.value}"]`)?.focus();
});

/* ---------- Draw everything (and again when the language changes) ---------- */
function renderAll() {
  paintBackground(document.body, myBackground());
  document.body.style.backgroundAttachment = "fixed"; // the background stays still while the page scrolls
  if (!$("premium-modal").classList.contains("hidden")) renderPremium();
  $("me-avatar").innerHTML = UI.avatar(me, "sm") +
    '<span class="absolute -bottom-1 -end-1 grid h-5 w-5 place-items-center rounded-full bg-white text-[11px] shadow" aria-hidden="true">🎨</span>';
  renderLook();
  $("me-name").textContent = loc(me.name);
  $("hello").textContent = t("dash.hello", { name: loc(me.name).split(" ")[0] });
  renderFilters();
  renderResults();
  updateRequestCount();
  updatePanel();
  if (!profileModal.classList.contains("hidden")) renderModal();
}

document.addEventListener("langchange", renderAll);
renderAll();

// Shared with the chatbot (chatbot.js)
window.Dashboard = { me, visibleProfiles, matchScore, sharedInterests, openProfile };
