const state = { language: "zh" };

function drawStarfield() {
  const canvas = document.querySelector("#starfield");
  const context = canvas.getContext("2d");
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const width = window.innerWidth;
  const height = Math.min(window.innerHeight, 900);
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  context.scale(ratio, ratio);
  context.clearRect(0, 0, width, height);

  const random = (seed) => {
    const value = Math.sin(seed * 913.17) * 10000;
    return value - Math.floor(value);
  };

  for (let index = 0; index < 82; index += 1) {
    const x = random(index + 2) * width;
    const y = random(index + 20) * height;
    const radius = random(index + 200) * 1.55 + 0.3;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = index % 11 === 0 ? "#e9b85d" : "rgba(255,255,255,.72)";
    context.fill();
  }
}

function setLanguage(nextLanguage) {
  state.language = nextLanguage;
  document.body.classList.toggle("side-b", nextLanguage === "en");
  document.documentElement.lang = nextLanguage === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-zh][data-en]").forEach((element) => {
    element.textContent = element.dataset[nextLanguage];
  });
  const button = document.querySelector("#language-switch");
  button.setAttribute("aria-label", nextLanguage === "zh" ? "Switch to English" : "切换到中文");
  button.querySelector(".switch-side").textContent = nextLanguage === "zh" ? "A" : "B";
}

document.querySelector("#language-switch").addEventListener("click", () => {
  const nextLanguage = state.language === "zh" ? "en" : "zh";
  const targets = document.querySelectorAll("[data-zh][data-en]");
  if (window.gsap) {
    gsap.to(".switch-side", { rotation: "+=360", duration: 0.72, ease: "back.out(1.5)" });
    gsap.to(".hero-collage", { rotation: nextLanguage === "en" ? 1.5 : 0, duration: 0.55, ease: "power3.inOut" });
    gsap.to(targets, {
      autoAlpha: 0,
      y: -8,
      duration: 0.18,
      stagger: 0.008,
      ease: "power1.in",
      onComplete: () => {
        setLanguage(nextLanguage);
        gsap.fromTo(targets, { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.008, ease: "power2.out" });
      }
    });
  } else {
    setLanguage(nextLanguage);
  }
});

document.querySelector(".geb-card").addEventListener("click", () => {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  gsap.to(".geb-symbol i", {
    rotation: (index) => {
      const direction = index % 2 === 0 ? 1 : -1;
      const extraTurn = Math.floor(Math.random() * 3) * 180 + 24 + Math.floor(Math.random() * 96);
      return `+=${direction * (360 + extraTurn)}`;
    },
    scale: () => 0.92 + Math.random() * 0.18,
    duration: 0.78,
    stagger: { each: 0.055, from: "random" },
    overwrite: "auto",
    ease: "back.out(1.35)"
  });
});

// Persistent external identity: deployments can change, but this tuple must not.
const counterEndpoint = "https://counterapi.com/api/zhuiyy.github.io/press/global-human-button";
const counterCacheKey = "zhuiy-world-count-cache";
const counterHeaders = {
  "embed-js-key": "1f8g291a-0ab0-4382-9296-e9516c5ebc4e",
  token1: "b1cde786-1033-4830-90a1-73dd35d9596c"
};

function toCount(value) {
  try {
    return typeof value === "bigint" ? value : BigInt(value || 0);
  } catch {
    return 0n;
  }
}

function maxCount(left, right) {
  return left > right ? left : right;
}

function parseCounterValue(payload) {
  const match = payload.match(/"value"\s*:\s*"?(-?\d+)"?/);
  if (!match) throw new Error("counter value missing");
  return BigInt(match[1]);
}

function formatCount(value) {
  const count = toCount(value);
  if (count >= 10000000000000000n) {
    const digits = count.toString();
    const decimals = digits.slice(1, 4).padEnd(3, "0");
    return `${digits[0]}.${decimals}e+${digits.length - 1}`;
  }
  return new Intl.NumberFormat(state.language === "zh" ? "zh-CN" : "en-US").format(count);
}

function updateCounterStatus(zh, en) {
  const status = document.querySelector("#counter-status");
  status.dataset.zh = zh;
  status.dataset.en = en;
  status.textContent = state.language === "zh" ? zh : en;
}

async function readWorldCount() {
  const cachedCount = toCount(localStorage.getItem(counterCacheKey));
  if (cachedCount > 0n) renderWorldCount(cachedCount);
  try {
    const response = await fetch(`${counterEndpoint}?readOnly=true`, { headers: counterHeaders });
    if (!response.ok) throw new Error("counter unavailable");
    const remoteCount = parseCounterValue(await response.text());
    renderWorldCount(maxCount(displayedWorldCount, remoteCount + BigInt(pendingWorldClicks)));
    updateCounterStatus("全人类目前的共同成果", "Humanity's collective achievement so far");
  } catch {
    renderWorldCount(maxCount(displayedWorldCount, cachedCount + BigInt(pendingWorldClicks)));
    updateCounterStatus("宇宙暂时失联，先记在这台设备上", "The universe is offline; keeping count on this device");
  }
}

function launchCounterSparks(button) {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = button.getBoundingClientRect();
  const colors = ["#f3c969", "#5de7ff", "#ff5b45", "#a7a0ff", "#ffffff"];
  for (let index = 0; index < 18; index += 1) {
    const spark = document.createElement("i");
    spark.className = "counter-spark";
    spark.style.left = `${rect.left + rect.width / 2}px`;
    spark.style.top = `${rect.top + rect.height / 2}px`;
    spark.style.background = colors[index % colors.length];
    document.body.append(spark);
    const angle = (Math.PI * 2 * index) / 18;
    const distance = 70 + Math.random() * 110;
    gsap.to(spark, {
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      scale: 0,
      autoAlpha: 0,
      duration: 0.36 + Math.random() * 0.18,
      ease: "power2.out",
      onComplete: () => spark.remove()
    });
  }
}

let displayedWorldCount = 0n;
let pendingWorldClicks = 0;
let counterQueue = Promise.resolve();

function renderWorldCount(value) {
  displayedWorldCount = toCount(value);
  const count = document.querySelector("#global-count");
  count.textContent = formatCount(displayedWorldCount);
  count.dataset.value = displayedWorldCount.toString();
  localStorage.setItem(counterCacheKey, displayedWorldCount.toString());
}

async function syncWorldClick() {
  const response = await fetch(counterEndpoint, { headers: counterHeaders });
  if (!response.ok) throw new Error("counter unavailable");
  const remoteCount = parseCounterValue(await response.text());
  pendingWorldClicks -= 1;
  renderWorldCount(maxCount(displayedWorldCount, remoteCount + BigInt(pendingWorldClicks)));
  updateCounterStatus("你刚刚改变了世界（约 0%）", "You changed the world (by approximately 0%)");
}

document.querySelector("#world-button").addEventListener("click", (event) => {
  const button = event.currentTarget;
  button.classList.add("is-pressed");
  window.setTimeout(() => button.classList.remove("is-pressed"), 90);
  launchCounterSparks(button);
  pendingWorldClicks += 1;
  renderWorldCount(displayedWorldCount + 1n);
  updateCounterStatus("已收到，正在同步这一次点击", "Received—syncing this click");
  if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    gsap.fromTo("#global-count", { scale: 1.12, color: "#e9b85d" }, { scale: 1, color: "#ffffff", duration: 0.2, overwrite: "auto", ease: "power2.out" });
  }
  counterQueue = counterQueue.then(syncWorldClick).catch(() => {
    pendingWorldClicks = Math.max(0, pendingWorldClicks - 1);
    updateCounterStatus("这次点击暂存本机，连接恢复后再说", "This click is saved locally for now");
  });
});

drawStarfield();
window.addEventListener("resize", drawStarfield);

if (window.gsap) {
  const media = gsap.matchMedia();
  media.add(
    {
      reduceMotion: "(prefers-reduced-motion: reduce)",
      fullMotion: "(prefers-reduced-motion: no-preference)"
    },
    (context) => {
      if (context.conditions.reduceMotion) return;
      gsap.from(".hero-copy > *", { autoAlpha: 0, y: 24, duration: 0.8, stagger: 0.09, ease: "power3.out" });
      gsap.from(".hero-collage", { autoAlpha: 0, scale: 0.9, rotation: -5, duration: 1, ease: "back.out(1.25)" });
      gsap.to(".avatar-wrap", { y: -10, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".equalizer i", { scaleY: () => 0.45 + Math.random() * 1.2, duration: 0.5, stagger: { each: 0.06, from: "random" }, repeat: -1, yoyo: true, ease: "sine.inOut" });

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting || entry.target.dataset.revealed) return;
          entry.target.dataset.revealed = "true";
          gsap.fromTo(entry.target, { autoAlpha: 0, y: 34 }, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power3.out" });
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    }
  );
}

const avatar = document.querySelector(".avatar-wrap");
document.querySelector(".hero-collage").addEventListener("pointermove", (event) => {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  gsap.to(avatar, { rotationY: x * 12, rotationX: -y * 12, x: x * 10, duration: 0.5, overwrite: "auto", ease: "power2.out" });
});
document.querySelector(".hero-collage").addEventListener("pointerleave", () => {
  if (window.gsap) gsap.to(avatar, { rotationY: 0, rotationX: 0, x: 0, duration: 0.7, overwrite: "auto", ease: "power2.out" });
});

readWorldCount();
