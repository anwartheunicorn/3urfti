// '3urfti — a tiny "pretend database" that lives in the browser (localStorage).
// It remembers accounts, who is logged in, and connection requests.
// In the real app every function here becomes a call to the backend API (ARCHITECTURE.md §4).

const Store = (() => {
  const KEYS = { users: "3urfti.users", session: "3urfti.session", connections: "3urfti.connections", looks: "3urfti.looks",
    messages: "3urfti.messages", seeded: "3urfti.seeded", premium: "3urfti.premium",
    bgImages: "3urfti.bgImages", photos: "3urfti.photos", details: "3urfti.details" };

  function read(key, fallback) {
    try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
  }
  function write(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
  }

  // Scramble the password so it is never saved as plain text.
  // (Demo only — the real server uses Argon2id.)
  async function hash(text) {
    if (window.crypto?.subtle) {
      const buffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
      return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
    }
    let h = 0;
    for (const ch of text) h = (h * 31 + ch.charCodeAt(0)) | 0;
    return String(h);
  }

  const users = () => read(KEYS.users, []);

  // Other students never see your email or password hash
  function publicProfile({ email, passwordHash, ...rest }) { return rest; }

  // Each student's chosen look: { id: { icon, color, background } }, plus their profile photo if they uploaded one
  function withLook(profile, looks = read(KEYS.looks, {}), photos = read(KEYS.photos, {})) {
    const look = looks[profile.id];
    const photo = photos[profile.id];
    return look || photo ? { ...profile, look, photo } : profile;
  }
  function setLook(id, changes) {
    const all = read(KEYS.looks, {});
    all[id] = { ...all[id], ...changes };
    write(KEYS.looks, all);
    return all[id];
  }

  // Who has paid for Premium backgrounds: a list of student ids.
  // (Demo only — a real app would ask the payment company, never trust the browser.)
  function hasPremium(id) { return read(KEYS.premium, []).includes(id); }
  function buyPremium(id) {
    const list = read(KEYS.premium, []);
    if (!list.includes(id)) write(KEYS.premium, [...list, id]);
  }

  // A premium student's own background photo, saved as text (a "data URL"): { id: "data:image/jpeg;base64,..." }
  function bgImage(id) { return read(KEYS.bgImages, {})[id] || null; }
  function setBgImage(id, dataUrl) {
    const all = read(KEYS.bgImages, {});
    all[id] = dataUrl;
    // Returns false if the browser's storage is full (the photo is too big)
    try { localStorage.setItem(KEYS.bgImages, JSON.stringify(all)); return true; } catch { return false; }
  }

  // A student's own profile photo (a small square picture), saved as a data URL: { id: "data:image/jpeg;base64,..." }
  // Pass null to remove it. Returns false if the browser's storage is full.
  function setPhoto(id, dataUrl) {
    const all = read(KEYS.photos, {});
    if (dataUrl) all[id] = dataUrl;
    else delete all[id];
    try { localStorage.setItem(KEYS.photos, JSON.stringify(all)); return true; } catch { return false; }
  }

  // Extra profile details a student added later, like where they're from: { id: { from: { en, ar } } }
  function setDetails(id, changes) {
    const all = read(KEYS.details, {});
    all[id] = { ...all[id], ...changes };
    write(KEYS.details, all);
  }

  function allProfiles() {
    const looks = read(KEYS.looks, {});
    const photos = read(KEYS.photos, {});
    const details = read(KEYS.details, {});
    return [...SAMPLE_PROFILES, ...users().map(publicProfile)].map((p) => withLook({ ...p, ...details[p.id] }, looks, photos));
  }
  function findById(id) { return allProfiles().find((p) => p.id === id) || null; }

  // College and major names students typed themselves because they weren't in our lists (no repeats)
  const unique = (names) => [...new Map(names.filter(Boolean).map((n) => [normalizeText(n), n.trim()])).values()];
  function typedColleges() {
    return unique(allProfiles().filter((p) => p.university === "other").map((p) => p.customUni));
  }
  function typedMajors() {
    const listed = new Set(MAJORS.map((m) => m.en));
    return unique(allProfiles().map((p) => p.major?.en).filter((name) => name && !listed.has(name)));
  }

  async function register(data) {
    const list = users();
    const email = data.email.trim().toLowerCase();
    if (list.some((u) => u.email === email)) throw new Error("exists");

    const user = {
      id: "u-" + Date.now().toString(36),
      email,
      passwordHash: await hash(data.password),
      name: { en: data.fullName.trim(), ar: data.fullName.trim() },
      gender: data.gender,
      year: data.year, // college year: "y1" (freshman) … "grad"
      university: data.university,
      customUni: data.customUni || "", // the college name they typed, when it isn't in our list
      lookingFor: data.lookingFor,
      interests: data.interests,
      major: data.major || { en: "", ar: "" },
      from: data.from || null, // where they're from (optional): { en, ar }
      budget: data.budget || null, // monthly rent budget in KD (optional): { min, max }
      bio: { en: "", ar: "" },
    };
    list.push(user);
    write(KEYS.users, list);
    write(KEYS.session, user.id);
    return user;
  }

  async function login(email, password) {
    const user = users().find((u) => u.email === email.trim().toLowerCase());
    if (!user || user.passwordHash !== (await hash(password))) throw new Error("login");
    write(KEYS.session, user.id);
    return user;
  }

  function loginAs(id) { write(KEYS.session, id); }
  function current() { const id = read(KEYS.session, null); return id ? findById(id) : null; }
  function logout() { try { localStorage.removeItem(KEYS.session); } catch {} }

  // Connection requests: { fromId: { toId: "pending" | "accepted" } }
  // A request I sent lives under my id; a request sent TO me lives under the sender's id.
  function connections(meId) { return read(KEYS.connections, {})[meId] || {}; }
  function setConnection(meId, targetId, status) {
    const all = read(KEYS.connections, {});
    all[meId] = all[meId] || {};
    if (status) all[meId][targetId] = status;
    else delete all[meId][targetId];
    write(KEYS.connections, all);
  }

  // Where two students stand: "friends" (accepted), "sent" (I asked them), "received" (they asked me) or null
  function relation(meId, otherId) {
    const all = read(KEYS.connections, {});
    const mine = all[meId]?.[otherId];
    const theirs = all[otherId]?.[meId];
    if (mine === "accepted" || theirs === "accepted") return "friends";
    if (mine === "pending") return "sent";
    if (theirs === "pending") return "received";
    return null;
  }

  // Everyone with a given relation to me, e.g. idsWith(me.id, "received")
  function idsWith(meId, kind) {
    const all = read(KEYS.connections, {});
    const ids = new Set([...Object.keys(all[meId] || {}), ...Object.keys(all).filter((from) => all[from]?.[meId])]);
    return [...ids].filter((id) => relation(meId, id) === kind);
  }

  function accept(meId, otherId) { setConnection(meId, otherId, "accepted"); setConnection(otherId, meId, "accepted"); }
  function decline(meId, otherId) { setConnection(otherId, meId, null); }

  // Chat messages: { "idA|idB": [{ from, text, at }] } — the two ids are sorted so both students share one chat
  const chatKey = (a, b) => [a, b].sort().join("|");
  function messages(meId, otherId) { return read(KEYS.messages, {})[chatKey(meId, otherId)] || []; }
  function sendMessage(fromId, toId, text) {
    const all = read(KEYS.messages, {});
    const key = chatKey(fromId, toId);
    all[key] = [...(all[key] || []), { from: fromId, text, at: Date.now() }];
    write(KEYS.messages, all);
  }

  // Demo only: give a new student a couple of requests to answer, just once
  function seedRequests(meId, fromIds) {
    const done = read(KEYS.seeded, []);
    if (done.includes(meId)) return;
    fromIds.forEach((id) => { if (!relation(meId, id)) setConnection(id, meId, "pending"); });
    write(KEYS.seeded, [...done, meId]);
  }

  return { allProfiles, findById, setDetails, typedColleges, typedMajors, register, login, loginAs, current, logout, connections, setConnection, setLook, setPhoto, hasPremium, buyPremium, bgImage, setBgImage,
    relation, idsWith, accept, decline, messages, sendMessage, seedRequests };
})();
