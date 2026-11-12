const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!\"#$%&'()*+,-./:;<=>?@[]_~";

const tester = document.getElementById("tester-area");
const size = document.getElementById("size");
const sizeOut = document.getElementById("size-out");
const calt = document.getElementById("opt-calt");
const ss01 = document.getElementById("opt-ss01");

function applyFeatures() {
  const parts = [`"calt" ${calt.checked ? 1 : 0}`];
  if (ss01.checked) parts.push(`"ss01" 1`);
  tester.style.fontFeatureSettings = parts.join(", ");
}

size.addEventListener("input", () => {
  tester.style.setProperty("--size", `${size.value}px`);
  sizeOut.textContent = `${size.value}px`;
});
calt.addEventListener("change", applyFeatures);
ss01.addEventListener("change", applyFeatures);

document.querySelectorAll(".swatch").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".swatch").forEach((b) => b.classList.toggle("on", b === btn));
    tester.className = `tester surface-${btn.dataset.surface}`;
  });
});

tester.querySelectorAll(".line").forEach((line) => {
  line.addEventListener("keydown", (e) => {
    if (e.key === "Enter") e.preventDefault();
  });
  line.addEventListener("paste", (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData("text").replace(/\s+/g, " ");
    document.execCommand("insertText", false, text);
  });
});

const grid = document.getElementById("glyph-grid");
const big = document.getElementById("focus-big");
const variations = document.getElementById("focus-variations");
const name = document.getElementById("focus-name");
const code = document.getElementById("focus-code");

function focusChar(ch, cell) {
  big.textContent = ch;
  variations.textContent = ch.repeat(5);
  name.textContent = ch;
  code.textContent = "U+" + ch.codePointAt(0).toString(16).toUpperCase().padStart(4, "0");
  grid.querySelectorAll(".glyph-cell").forEach((c) => c.classList.toggle("on", c === cell));
}

[...chars].forEach((ch) => {
  const cell = document.createElement("button");
  cell.className = "glyph-cell";
  cell.textContent = ch;
  cell.setAttribute("aria-label", `Show ${ch}`);
  cell.addEventListener("click", () => focusChar(ch, cell));
  cell.addEventListener("mouseenter", () => focusChar(ch, cell));
  grid.appendChild(cell);
});

focusChar("a", grid.children[26]);

const bar = document.querySelector(".bar");
const hero = document.querySelector(".hero");
const heroTitle = document.querySelector(".hero h1");
function updateBar() {
  bar.classList.toggle("at-top", hero.getBoundingClientRect().top >= 0);
}
function fitTitle() {
  const cs = getComputedStyle(hero);
  const avail = hero.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
  hero.style.setProperty("--title-size", "100px");
  const range = document.createRange();
  range.selectNodeContents(heroTitle);
  const width = range.getBoundingClientRect().width;
  const size = Math.min((avail * (innerWidth <= 600 ? 0.8 : 0.68) / width) * 100, innerHeight * 0.3);
  hero.style.setProperty("--title-size", `${size}px`);
}

addEventListener("resize", fitTitle);
document.fonts.ready.then(() => { fitTitle(); updateBar(); });
fitTitle();

addEventListener("scroll", updateBar, { passive: true });
addEventListener("resize", updateBar);
updateBar();
