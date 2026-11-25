// '3urfti — small helpers both pages share: icons, avatars, pop-up windows (modals) and toasts.

const ICONS = {
  home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5"/></svg>',
  check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0"><path d="M20 6 9 17l-5-5"/></svg>',
  userPlus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M22 11h-6"/></svg>',
  chat: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0"><path d="M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12Z"/></svg>',
  lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" class="h-5 w-5"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
  cap: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-4 w-4 shrink-0"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>',
};

// Turn special characters into safe text so a name like "<b>" can't break the page
function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

// Make text easy to compare: lower case, and treat similar Arabic letters as the same (أ إ آ → ا, ة → ه, ى → ي)
function normalizeText(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[ً-ْـ]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .trim();
}

const UI = {
  // The colour a student picked, or one chosen from their id if they haven't picked yet
  avatarColor(profile) {
    const picked = AVATAR_COLORS.find((c) => c.key === profile.look?.color);
    const index = [...profile.id].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) % AVATAR_COLORS.length;
    return picked || AVATAR_COLORS[index];
  },

  // Round picture: the student's own photo, their chosen icon, or their initials
  avatar(profile, size = "md") {
    const sizes = { sm: "h-10 w-10", md: "h-14 w-14", lg: "h-24 w-24 ring-4 ring-white" };
    if (profile.look?.icon === "photo" && profile.photo) {
      return `<img src="${escapeHtml(profile.photo)}" alt="" class="${sizes[size]} shrink-0 rounded-full object-cover shadow-sm" aria-hidden="true">`;
    }
    const textSizes = { sm: "text-sm", md: "text-lg", lg: "text-3xl" };
    const iconSizes = { sm: "text-xl", md: "text-3xl", lg: "text-5xl" };
    const icon = profile.look?.icon;
    const words = loc(profile.name).split(/\s+/).filter(Boolean);
    const initials = Lang.current === "ar"
      ? (words[0] || "?").charAt(0)
      : words.slice(0, 2).map((w) => w.charAt(0).toUpperCase()).join("");
    return `<div class="${sizes[size]} ${icon ? iconSizes[size] : textSizes[size]} ${UI.avatarColor(profile).cls} shrink-0 rounded-full grid place-items-center font-bold text-white shadow-sm" aria-hidden="true">${escapeHtml(icon || initials)}</div>`;
  },

  openModal(id) {
    const modal = document.getElementById(id);
    if (!modal) return;
    UI.lastFocus = document.activeElement;
    modal.classList.remove("hidden");
    modal.classList.add("flex");
    document.body.classList.add("overflow-hidden");
    modal.querySelector("input:not([type=hidden]), select, button:not([data-close])")?.focus();
  },

  closeModal(id) {
    const modal = document.getElementById(id);
    if (!modal || modal.classList.contains("hidden")) return;
    modal.classList.add("hidden");
    modal.classList.remove("flex");
    if (!document.querySelector(".modal:not(.hidden)")) document.body.classList.remove("overflow-hidden");
    UI.lastFocus?.focus?.();
  },

  // Short message that pops up for a few seconds
  toast(message) {
    let box = document.getElementById("toast");
    if (!box) {
      box = document.createElement("div");
      box.id = "toast";
      box.setAttribute("role", "status");
      box.className = "fixed top-20 left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-2 opacity-0 pointer-events-none rounded-2xl bg-brand-900 px-5 py-3.5 text-center text-sm font-medium text-white shadow-2xl";
      document.body.append(box);
    }
    box.textContent = message;
    box.classList.add("show");
    clearTimeout(UI.toastTimer);
    UI.toastTimer = setTimeout(() => box.classList.remove("show"), 3200);
  },

  // Fill a currency <select> in the current language and choose `wanted` (or keep what was picked; KD if nothing)
  fillCurrencySelect(select, wanted = select.value) {
    const picked = wanted || "KWD";
    select.innerHTML = CURRENCIES.map((c) => `<option value="${c.code}">${escapeHtml(currencyOption(c.code))}</option>`).join("");
    select.value = picked;
  },

  /* Type-to-search box (for colleges and majors).
     As you type, a list of matches drops down under the text box.
     - input: the text box (its parent needs class="relative" so the list sits under it)
     - items(): the full list, each { label, sub, search, names } — "search" is all the words it can be found by,
       "names" are its full names in English and Arabic
     - onPick(item): runs when a match is clicked. If you typed something that isn't in the list,
       the last row says "Use '…'" and onPick gets { custom: true, label: what you typed }
     - allowCustom: show that "Use '…'" row
     - customText: the words on that row (sign-up says "Use …", the dashboard says "Search for …") */
  searchBox({ input, items, onPick, allowCustom = false, customText = "search.use", icon = "" }) {
    const list = document.createElement("ul");
    list.id = input.id + "-results";
    list.setAttribute("role", "listbox");
    list.className = "absolute inset-x-0 top-full z-30 mt-1 hidden max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1 shadow-xl";
    input.after(list);
    Object.assign(input, { autocomplete: "off" });
    input.setAttribute("role", "combobox");
    input.setAttribute("aria-autocomplete", "list");
    input.setAttribute("aria-controls", list.id);
    input.setAttribute("aria-expanded", "false");

    let shown = [];
    const show = (open) => { list.classList.toggle("hidden", !open); input.setAttribute("aria-expanded", open); };
    // English: a typed word must match the START of a word ("cs" finds "CS", not "economiCS").
    // Arabic: it can be anywhere, because words often start with "ال" ("كويت" finds "الكويت").
    const hasWord = (text, word) => /[؀-ۿ]/.test(word)
      ? text.includes(word)
      : text.split(/[^a-z0-9؀-ۿ]+/).some((part) => part.startsWith(word));
    const buttons = () => [...list.querySelectorAll("button")];

    function render() {
      const typed = input.value.trim();
      const words = normalizeText(typed).split(/\s+/).filter(Boolean);
      // Keep items that contain every word you typed, in any order ("uni kuwait" finds "Kuwait University")
      shown = items().filter((it) => words.every((w) => hasWord(normalizeText(it.search), w)));
      // Names that START with what you typed go to the top
      if (words.length) shown.sort((a, b) => normalizeText(b.label).startsWith(words[0]) - normalizeText(a.label).startsWith(words[0]));
      // Typed a full name exactly (in either language)? Then no need for the "Use …" row
      const exact = shown.some((it) => (it.names || [it.label]).some((name) => normalizeText(name) === normalizeText(typed)));
      const row = "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm hover:bg-brand-50 focus:bg-brand-50 focus:outline-none";
      list.innerHTML =
        shown.map((it, i) => `<li role="option"><button type="button" tabindex="-1" data-index="${i}" class="${row} text-slate-700">${icon}
          <span class="min-w-0 flex-1"><span class="block">${escapeHtml(it.label)}</span>${it.sub ? `<span class="block text-xs text-slate-400">${escapeHtml(it.sub)}</span>` : ""}</span></button></li>`).join("") +
        (allowCustom && typed && !exact ? `<li role="option"><button type="button" tabindex="-1" data-custom class="${row} font-semibold text-brand-700">＋ <span>${escapeHtml(t(customText, { name: typed }))}</span></button></li>` : "") +
        (!shown.length && !(allowCustom && typed) ? `<li class="px-3 py-2 text-sm text-slate-400">${escapeHtml(t("search.none"))}</li>` : "");
      show(true);
    }

    function pick(button) {
      const item = button.hasAttribute("data-custom") ? { custom: true, label: input.value.trim() } : shown[button.dataset.index];
      input.value = item.label;
      show(false);
      input.focus();
      onPick(item);
    }

    input.addEventListener("click", render);
    input.addEventListener("input", render);
    input.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); if (list.classList.contains("hidden")) render(); buttons()[0]?.focus(); }
      if (e.key === "Enter" && !list.classList.contains("hidden") && input.value.trim()) { e.preventDefault(); if (buttons()[0]) pick(buttons()[0]); }
      if (e.key === "Escape" && !list.classList.contains("hidden")) { e.stopPropagation(); show(false); } // close the list, not the whole window
    });
    list.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) pick(b); });
    list.addEventListener("keydown", (e) => {
      const all = buttons();
      const i = all.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); all[Math.min(i + 1, all.length - 1)]?.focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); i <= 0 ? input.focus() : all[i - 1].focus(); }
      if (e.key === "Escape") { e.stopPropagation(); show(false); input.focus(); }
    });
    // Clicking anywhere else closes the list
    document.addEventListener("click", (e) => { if (e.target !== input && !list.contains(e.target)) show(false); });
    return { close: () => show(false) };
  },
};

/* ---------- Dark / light mode ----------
   The 🌙 / ☀️ button adds or removes class="dark" on <html>. css/styles.css has the dark colours.
   Your choice is remembered; if you never chose, the page follows your device's setting. */
const Theme = {
  isDark: () => document.documentElement.classList.contains("dark"),
  set(dark) {
    document.documentElement.classList.toggle("dark", dark);
    try { localStorage.setItem("3urfti.theme", dark ? "dark" : "light"); } catch {}
    Theme.label();
  },
  // The button's name for screen readers and its hover tip, in the current language
  label() {
    const text = t(Theme.isDark() ? "theme.toLight" : "theme.toDark");
    document.querySelectorAll("[data-theme-toggle]").forEach((b) => { b.setAttribute("aria-label", text); b.title = text; });
  },
};
document.addEventListener("click", (e) => { if (e.target.closest("[data-theme-toggle]")) Theme.set(!Theme.isDark()); });
document.addEventListener("langchange", Theme.label);
Theme.label();

// Any button with data-open="some-modal" opens it; anything with data-close closes its modal
document.addEventListener("click", (e) => {
  const opener = e.target.closest("[data-open]");
  if (opener) {
    e.preventDefault();
    document.querySelectorAll(".modal:not(.hidden)").forEach((m) => UI.closeModal(m.id));
    UI.openModal(opener.dataset.open);
    return;
  }
  const closer = e.target.closest("[data-close]");
  if (closer) UI.closeModal(closer.closest(".modal").id);
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") document.querySelectorAll(".modal:not(.hidden)").forEach((m) => UI.closeModal(m.id));
});
