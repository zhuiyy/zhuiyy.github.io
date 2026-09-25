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
    context.fillStyle = index % 11 === 0 ? "#c9ff43" : "rgba(255,255,255,.72)";
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
    gsap.to(".hero-orbit", { rotation: nextLanguage === "en" ? 3 : 0, duration: 0.8, ease: "power3.inOut" });
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

const recursionLines = [
  { zh: "这里", en: "here" },
  { zh: "这里的这里", en: "here's here" },
  { zh: "这里的这里的这里", en: "here inside here's here" },
  { zh: "再小就要碰到排版了", en: "Any smaller and typography complains" }
];
let recursionDepth = 0;
document.querySelector("#recursion-button").addEventListener("click", () => {
  const stage = document.querySelector("#recursion-stage");
  const item = document.createElement("span");
  const line = recursionLines[recursionDepth % recursionLines.length];
  item.className = "mini-here";
  item.dataset.zh = line.zh;
  item.dataset.en = line.en;
  item.textContent = line[state.language];
  item.style.setProperty("--size", `${Math.max(48, 98 - recursionDepth * 14)}px`);
  stage.append(item);
  recursionDepth += 1;
  if (stage.children.length > 4) stage.firstElementChild.remove();
  if (window.gsap) gsap.from(item, { autoAlpha: 0, scale: 0.2, rotation: -18, duration: 0.5, ease: "back.out(1.8)" });
});

const counterEndpoint = "https://counterapi.com/api/zhuiyy.github.io/press/global-human-button";
const counterHeaders = {
  "embed-js-key": "1f8g291a-0ab0-4382-9296-e9516c5ebc4e",
  token1: "b1cde786-1033-4830-90a1-73dd35d9596c"
};

function formatCount(value) {
  return new Intl.NumberFormat(state.language === "zh" ? "zh-CN" : "en-US").format(value);
}

function updateCounterStatus(zh, en) {
  const status = document.querySelector("#counter-status");
  status.dataset.zh = zh;
  status.dataset.en = en;
  status.textContent = state.language === "zh" ? zh : en;
}

async function readWorldCount() {
  try {
    const response = await fetch(`${counterEndpoint}?readOnly=true`, { headers: counterHeaders });
    if (!response.ok) throw new Error("counter unavailable");
    const data = await response.json();
    document.querySelector("#global-count").textContent = formatCount(data.value || 0);
    updateCounterStatus("全人类目前的共同成果", "Humanity's collective achievement so far");
  } catch {
    const localCount = Number(localStorage.getItem("zhuiy-world-button") || 0);
    document.querySelector("#global-count").textContent = formatCount(localCount);
    updateCounterStatus("宇宙暂时失联，先记在这台设备上", "The universe is offline; keeping count on this device");
  }
}

function launchCounterSparks(button) {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = button.getBoundingClientRect();
  const colors = ["#c9ff43", "#5de7ff", "#ff5b45", "#a7a0ff", "#ffffff"];
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
      duration: 0.65 + Math.random() * 0.35,
      ease: "power2.out",
      onComplete: () => spark.remove()
    });
  }
}

document.querySelector("#world-button").addEventListener("click", async (event) => {
  const button = event.currentTarget;
  button.disabled = true;
  button.classList.add("is-pressed");
  launchCounterSparks(button);
  try {
    const response = await fetch(counterEndpoint, { headers: counterHeaders });
    if (!response.ok) throw new Error("counter unavailable");
    const data = await response.json();
    document.querySelector("#global-count").textContent = formatCount(data.value || 0);
    updateCounterStatus("你刚刚改变了世界（约 0%）", "You changed the world (by approximately 0%)");
  } catch {
    const nextLocal = Number(localStorage.getItem("zhuiy-world-button") || 0) + 1;
    localStorage.setItem("zhuiy-world-button", nextLocal);
    document.querySelector("#global-count").textContent = formatCount(nextLocal);
    updateCounterStatus("先记在这台设备上，等宇宙恢复连接", "Saved on this device until the universe reconnects");
  } finally {
    window.setTimeout(() => {
      button.disabled = false;
      button.classList.remove("is-pressed");
    }, 380);
  }
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
      gsap.from(".hero-orbit", { autoAlpha: 0, scale: 0.88, rotation: -8, duration: 1.2, ease: "back.out(1.35)" });
      gsap.to(".avatar-wrap", { y: -10, duration: 2.8, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".orbit-one", { rotation: 360, duration: 28, repeat: -1, ease: "none" });
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
document.querySelector(".hero-orbit").addEventListener("pointermove", (event) => {
  if (!window.gsap || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  gsap.to(avatar, { rotationY: x * 12, rotationX: -y * 12, x: x * 10, duration: 0.5, overwrite: "auto", ease: "power2.out" });
});
document.querySelector(".hero-orbit").addEventListener("pointerleave", () => {
  if (window.gsap) gsap.to(avatar, { rotationY: 0, rotationX: 0, x: 0, duration: 0.7, overwrite: "auto", ease: "power2.out" });
});

readWorldCount();
