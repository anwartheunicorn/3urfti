// '3urfti — landing page: 2-step sign up (onboarding), log in, and demo accounts.

const signupForm = document.getElementById("signup-form");
const loginForm = document.getElementById("login-form");
const picker = document.getElementById("interest-picker");
const yearSelect = document.getElementById("su-year");
const uniInput = document.getElementById("su-uni");
const majorInput = document.getElementById("su-major");
const fromInput = document.getElementById("su-from");
const chosenInterests = new Set();
let step = 1;

/* ---------- Show the right buttons for visitors vs. logged-in students ---------- */
const loggedIn = Boolean(Store.current());
document.querySelectorAll('[data-auth="guest"]').forEach((el) => { if (loggedIn) el.style.display = "none"; });
document.querySelectorAll('[data-auth="user"]').forEach((el) => { if (loggedIn) el.classList.remove("hidden"); });

/* ---------- Interest chips ---------- */
function renderInterestPicker() {
  picker.innerHTML = INTERESTS.map((i) =>
    `<button type="button" class="chip" data-interest="${i.key}" aria-pressed="${chosenInterests.has(i.key)}">${escapeHtml(interestLabel(i.key))}</button>`
  ).join("");
  document.getElementById("interest-count").textContent = t("f.selected", { n: chosenInterests.size });
}

picker.addEventListener("click", (e) => {
  const chip = e.target.closest("[data-interest]");
  if (!chip) return;
  const key = chip.dataset.interest;
  chosenInterests.has(key) ? chosenInterests.delete(key) : chosenInterests.add(key);
  renderInterestPicker();
  picker.querySelector(`[data-interest="${key}"]`).focus();
});

/* ---------- Error messages under each field ---------- */
function showError(field, key) {
  const box = signupForm.querySelector(`[data-error-for="${field}"]`);
  box.dataset.key = key;
  box.textContent = t(key);
  box.classList.remove("hidden");
  return false;
}
function clearErrors() {
  signupForm.querySelectorAll(".field-error").forEach((box) => { box.classList.add("hidden"); delete box.dataset.key; });
}

function validateStep1() {
  const f = signupForm.elements;
  let ok = true;
  if (!f.fullName.value.trim()) ok = showError("fullName", "err.required");
  if (!/^\S+@\S+\.\S+$/.test(f.email.value.trim())) ok = showError("email", "err.email");
  if (f.password.value.length < 6) ok = showError("password", "err.password");
  if (!f.gender.value) ok = showError("gender", "err.gender");
  if (!yearSelect.value) ok = showError("year", "err.year");
  return ok;
}

// Fill the college-year drop-down (Freshman, Sophomore, …) in the current language, keeping what was picked
function fillYearSelect() {
  const picked = yearSelect.value;
  yearSelect.innerHTML = `<option value="">${escapeHtml(t("f.chooseYear"))}</option>` +
    COLLEGE_YEARS.map((y) => `<option value="${y}">${escapeHtml(yearLabel(y))}</option>`).join("");
  yearSelect.value = picked;
}

/* ---------- University & major: type to search ----------
   Typing shows matching names from our long lists. If yours isn't there,
   pick "Use '…'" (or just leave what you typed) and we use your own words. */
let pickedUni = null;   // the university key from our list, e.g. "kuniv"
let pickedMajor = null; // the major from our list, e.g. { en: "Medicine", ar: "الطب" }
let pickedFrom = null;  // the country from our list, e.g. { en: "Kuwait", ar: "الكويت" }

UI.searchBox({
  input: uniInput, items: universityItems, allowCustom: true, icon: ICONS.cap,
  onPick: (item) => { pickedUni = item.value && item.value !== "other" ? item.value : null; },
});
UI.searchBox({
  input: majorInput, items: majorItems, allowCustom: true,
  onPick: (item) => { pickedMajor = item.custom ? null : item.major; }, // typed by you → null; typed by others → their name
});
// Typing again after picking means they changed their mind
uniInput.addEventListener("input", () => { pickedUni = null; });
majorInput.addEventListener("input", () => { pickedMajor = null; });
UI.searchBox({
  input: fromInput, items: placeItems, allowCustom: true, icon: ICONS.pin,
  onPick: (item) => { pickedFrom = item.custom ? null : item.place; },
});
fromInput.addEventListener("input", () => { pickedFrom = null; });

// If they typed a name exactly as it is in our list without clicking it, still count it as picked
const sameText = (a, b) => normalizeText(a) === normalizeText(b);
function chosenUni() {
  const typed = uniInput.value.trim();
  const known = pickedUni ? UNIVERSITIES.find((u) => u.key === pickedUni)
    : UNIVERSITIES.find((u) => u.key !== "other" && (sameText(u.en, typed) || sameText(u.ar, typed)));
  if (known) return { university: known.key, customUni: "" };
  return typed ? { university: "other", customUni: typed } : null;
}
function chosenMajor() {
  const typed = majorInput.value.trim();
  const known = pickedMajor || MAJORS.find((m) => sameText(m.en, typed) || sameText(m.ar, typed));
  if (known) return { en: known.en, ar: known.ar };
  return { en: typed, ar: typed };
}

// Where they're from (optional): a country from our list, or whatever they typed, or nothing
function chosenFrom() {
  const typed = fromInput.value.trim();
  const known = pickedFrom || COUNTRIES.find((c) => sameText(c.en, typed) || sameText(c.ar, typed));
  if (known) return { en: known.en, ar: known.ar };
  return typed ? { en: typed, ar: typed } : null;
}

function validateStep2() {
  let ok = true;
  if (!chosenUni()) ok = showError("university", "err.uni");
  if (chosenInterests.size < 3) ok = showError("interests", "err.interests");
  return ok;
}

/* ---------- Moving between step 1 and step 2 ---------- */
function goToStep(n) {
  step = n;
  signupForm.querySelector('[data-step="1"]').classList.toggle("hidden", n !== 1);
  signupForm.querySelector('[data-step="2"]').classList.toggle("hidden", n !== 2);
  document.getElementById("signup-back").classList.toggle("hidden", n !== 2);
  document.getElementById("bar-2").className = `h-1.5 rounded-full ${n === 2 ? "bg-brand-600" : "bg-slate-200"}`;
  document.getElementById("bar-2-label").className = `mt-1.5 text-xs font-semibold ${n === 2 ? "text-brand-700" : "text-slate-400"}`;
  updateStepText();
  // Step 2 starts on the selected "I'm looking for" choice; step 1 starts on its first box
  const first = n === 2 ? '[data-step="2"] input[name="lookingFor"]:checked' : '[data-step="1"] input';
  signupForm.querySelector(first)?.focus();
}

function updateStepText() {
  document.getElementById("signup-step-label").textContent = t("signup.stepOf", { n: step });
  const submit = document.getElementById("signup-submit");
  submit.dataset.i18n = step === 1 ? "btn.next" : "btn.create";
  submit.textContent = t(submit.dataset.i18n);
}

document.getElementById("signup-back").addEventListener("click", () => { clearErrors(); goToStep(1); });

signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearErrors();

  if (step === 1) {
    if (validateStep1()) goToStep(2);
    return;
  }
  if (!validateStep2()) return;

  const f = signupForm.elements;
  try {
    await Store.register({
      fullName: f.fullName.value,
      email: f.email.value,
      password: f.password.value,
      gender: f.gender.value,
      year: yearSelect.value,
      ...chosenUni(),
      major: chosenMajor(),
      from: chosenFrom(),
      budget: makeBudget(document.getElementById("su-budget-min").value, document.getElementById("su-budget-max").value,
        document.getElementById("su-budget-currency").value),
      lookingFor: f.lookingFor.value,
      interests: [...chosenInterests],
    });
    location.href = "dashboard.html";
  } catch (err) {
    if (err.message === "exists") { goToStep(1); showError("email", "err.exists"); }
  }
});

/* ---------- Log in ---------- */
const loginError = document.getElementById("login-error");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginError.classList.add("hidden");
  try {
    await Store.login(loginForm.elements.email.value, loginForm.elements.password.value);
    location.href = "dashboard.html";
  } catch {
    loginError.textContent = t("err.login");
    loginError.classList.remove("hidden");
  }
});

document.querySelectorAll("[data-demo]").forEach((button) => {
  button.addEventListener("click", () => {
    Store.loginAs(button.dataset.demo);
    location.href = "dashboard.html";
  });
});

/* ---------- Redraw text when the language changes ---------- */
function renderLanguageParts() {
  renderInterestPicker();
  fillYearSelect();
  UI.fillCurrencySelect(document.getElementById("su-budget-currency"));
  // Show a name picked from our list in the new language
  if (pickedUni) uniInput.value = uniName(pickedUni);
  if (pickedMajor) majorInput.value = loc(pickedMajor);
  if (pickedFrom) fromInput.value = loc(pickedFrom);
  updateStepText();
  signupForm.querySelectorAll(".field-error[data-key]").forEach((box) => { box.textContent = t(box.dataset.key); });
  if (!loginError.classList.contains("hidden")) loginError.textContent = t("err.login");
}

document.addEventListener("langchange", renderLanguageParts);
renderLanguageParts();
