// '3urfti — Requests & chats
// Three tabs: requests you RECEIVED (accept or decline), requests you SENT (cancel), and CHATS
// with students who accepted. Opened from the "Requests & chats" button in the top bar.
//
// Demo only: the sample students aren't real people, so they act like real ones —
// they accept your request a few seconds after you send it, and reply to your messages.
// Two real accounts made in the same browser can also request and chat with each other
// (log out and log in as the other one to answer).

const Inbox = (() => {
  let tab = "received";
  let chatWith = null; // the id of the student whose chat is open

  const isSample = (id) => SAMPLE_PROFILES.some((p) => p.id === id);
  const firstName = (p) => loc(p.name).split(" ")[0];
  const isOpen = () => !$("inbox-modal").classList.contains("hidden");

  // 🔒 Same gender rule as the rest of the dashboard: canSee() hides everyone else
  function people(kind) {
    return Store.idsWith(me.id, kind).map(Store.findById).filter(canSee);
  }

  /* ---------- The list view ---------- */
  function tabsHtml() {
    return ["received", "sent", "chats"].map((key) => {
      const n = people(key === "chats" ? "friends" : key).length;
      const badge = key === "received" && n ? "bg-rose-500 text-white" : "bg-slate-200 text-slate-600";
      return `<button type="button" role="tab" data-inbox-tab="${key}" aria-selected="${tab === key}"
        class="flex items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-slate-600 aria-selected:bg-white aria-selected:text-brand-800 aria-selected:shadow-sm">
        ${escapeHtml(t("inbox.tab." + key))}<span class="rounded-full px-1.5 text-xs ${badge}">${n}</span>
      </button>`;
    }).join("");
  }

  const PRIMARY = "bg-brand-600 text-white hover:bg-brand-700";
  const QUIET = "border border-slate-200 text-slate-600 hover:bg-slate-50";
  const actionButton = (action, id, labelKey, style) =>
    `<button type="button" data-inbox-action="${action}" data-id="${escapeHtml(id)}" class="rounded-xl px-3 py-2 text-xs font-bold ${style}">${escapeHtml(t(labelKey))}</button>`;

  function row(p, subtitle, buttons) {
    return `<div class="flex items-center gap-3 rounded-2xl border border-slate-100 p-3">
        <button type="button" data-inbox-view="${escapeHtml(p.id)}" class="shrink-0 rounded-full" aria-label="${escapeHtml(t("card.view"))}">${UI.avatar(p, "sm")}</button>
        <div class="min-w-0 flex-1">
          <p class="truncate font-bold text-brand-950">${escapeHtml(loc(p.name))}</p>
          <p class="truncate text-xs text-slate-500">${escapeHtml(subtitle)}</p>
        </div>
        <div class="flex shrink-0 gap-1.5">${buttons}</div>
      </div>`;
  }

  function lastMessage(p) {
    const list = Store.messages(me.id, p.id);
    const last = list[list.length - 1];
    if (!last) return t("inbox.sayHi");
    return (last.from === me.id ? t("inbox.you") + ": " : "") + last.text;
  }

  function renderList() {
    $("inbox-tabs").innerHTML = tabsHtml();
    let html = "";
    if (tab === "received") {
      html = people("received").map((p) => row(p, t("inbox.wantsTo"),
        actionButton("accept", p.id, "inbox.accept", PRIMARY) + actionButton("decline", p.id, "inbox.decline", QUIET))).join("");
    } else if (tab === "sent") {
      html = people("sent").map((p) => row(p, t("inbox.waiting"), actionButton("cancel", p.id, "inbox.cancel", QUIET))).join("");
    } else {
      html = people("friends").map((p) => row(p, lastMessage(p), actionButton("chat", p.id, "inbox.open", PRIMARY))).join("");
    }
    const icon = { received: "📭", sent: "📤", chats: "💬" }[tab];
    $("inbox-list").innerHTML = html ||
      `<div class="px-4 py-14 text-center"><p class="text-4xl" aria-hidden="true">${icon}</p>
       <p class="mt-3 text-slate-500">${escapeHtml(t("inbox.empty." + tab))}</p></div>`;
  }

  /* ---------- The chat view ---------- */
  function bubble(m) {
    const mine = m.from === me.id;
    const time = new Date(m.at).toLocaleTimeString(Lang.current, { hour: "numeric", minute: "2-digit" });
    return `<div class="flex ${mine ? "justify-end" : "justify-start"}">
        <div class="max-w-[80%] rounded-2xl px-3.5 py-2 text-sm ${mine ? "rounded-ee-md bg-brand-600 text-white" : "rounded-es-md bg-white text-slate-700 shadow-sm"}">
          <p class="whitespace-pre-line break-words">${escapeHtml(m.text)}</p>
          <p class="mt-0.5 text-[10px] ${mine ? "text-brand-100" : "text-slate-400"}">${time}</p>
        </div>
      </div>`;
  }

  function renderChat() {
    const p = Store.findById(chatWith);
    if (!canSee(p) || Store.relation(me.id, p.id) !== "friends") return showList(); // only connected students can chat
    $("chat-who").innerHTML = `${UI.avatar(p, "sm")}
      <div class="min-w-0"><p class="truncate font-bold text-brand-950">${escapeHtml(loc(p.name))}</p>
      <p class="truncate text-xs text-slate-500">${escapeHtml(studentUni(p))}</p></div>`;
    const list = Store.messages(me.id, p.id);
    $("chat-log").innerHTML = list.length
      ? list.map(bubble).join("")
      : `<p class="py-10 text-center text-sm text-slate-500">${escapeHtml(t("inbox.startChat", { name: firstName(p) }))}</p>`;
    $("chat-log").scrollTop = $("chat-log").scrollHeight;
  }

  function showChat(id) {
    chatWith = id;
    $("inbox-list-view").classList.add("hidden");
    $("inbox-chat-view").classList.replace("hidden", "flex");
    renderChat();
    $("chat-input").focus();
  }

  function showList() {
    chatWith = null;
    $("inbox-chat-view").classList.replace("flex", "hidden");
    $("inbox-list-view").classList.remove("hidden");
    renderList();
  }

  /* ---------- Keep the whole page up to date ---------- */
  function refresh() {
    renderResults();
    updateRequestCount();
    if (!profileModal.classList.contains("hidden")) renderModal();
    if (isOpen()) chatWith ? renderChat() : renderList();
  }

  /* ---------- Demo: sample students act like real ones ---------- */
  function simulateAccept(id) {
    if (!isSample(id)) return;
    setTimeout(() => {
      if (Store.relation(me.id, id) !== "sent") return; // you canceled it in the meantime
      Store.accept(me.id, id);
      UI.toast(t("inbox.accepted", { name: firstName(Store.findById(id)) }));
      refresh();
    }, 5000);
  }

  function simulateReply(id) {
    if (!isSample(id)) return;
    setTimeout(() => {
      const replies = t("inbox.replies").split("|");
      const alreadySent = Store.messages(me.id, id).filter((m) => m.from === id).length;
      Store.sendMessage(id, me.id, replies[alreadySent % replies.length]);
      refresh();
    }, 1500);
  }

  // The first time a student opens the dashboard, two good matches send them a request
  const suggestions = visibleProfiles()
    .filter((p) => isSample(p.id) && !Store.relation(me.id, p.id))
    .sort((a, b) => matchScore(b) - matchScore(a))
    .slice(0, 2)
    .map((p) => p.id);
  Store.seedRequests(me.id, suggestions);

  /* ---------- Clicks ---------- */
  // Opening the window: start on "Received" if there are new requests waiting
  $("inbox-open").addEventListener("click", () => {
    if (people("received").length) tab = "received";
    showList();
  });

  $("inbox-modal").addEventListener("click", (e) => {
    const tabButton = e.target.closest("[data-inbox-tab]");
    if (tabButton) { tab = tabButton.dataset.inboxTab; renderList(); return; }

    const view = e.target.closest("[data-inbox-view]");
    if (view) { UI.closeModal("inbox-modal"); openProfile(view.dataset.inboxView); return; }

    const button = e.target.closest("[data-inbox-action]");
    if (!button) return;
    const id = button.dataset.id;
    const p = Store.findById(id);
    if (!canSee(p)) return; // 🔒
    const action = button.dataset.inboxAction;

    if (action === "chat") return showChat(id);
    if (action === "accept") { Store.accept(me.id, id); UI.toast(t("inbox.nowFriends", { name: firstName(p) })); }
    if (action === "decline") Store.decline(me.id, id);
    if (action === "cancel") { Store.setConnection(me.id, id, null); UI.toast(t("connect.canceled", { name: firstName(p) })); }
    refresh();
  });

  $("chat-back").addEventListener("click", showList);

  $("chat-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const text = $("chat-input").value.trim();
    if (!text || !chatWith) return;
    Store.sendMessage(me.id, chatWith, text);
    $("chat-input").value = "";
    renderChat();
    simulateReply(chatWith);
  });

  document.addEventListener("langchange", () => { if (isOpen()) chatWith ? renderChat() : renderList(); });

  // Used by the "Message" button on cards and profiles
  function openChat(id) {
    UI.closeModal("profile-modal");
    UI.openModal("inbox-modal");
    showChat(id);
  }

  return { openChat, simulateAccept };
})();

updateRequestCount();
