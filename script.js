const name = "Pagalet";

const answers_no = [
  "No 🙈",
  "Umm… are you sure? 🥺",
  "Really really sure? 🥹",
  "Maybe think once more? 💭",
  "Think again?👉👈",
  "Don't believe in second chances?🥹",
  "Why are you being so cold?😢",
  "Maybe we can talk about it?🥺",
  "I am not going to ask again!🥹",
  "Ok now this is hurting my feelings!😡",
  "You are now just being mean!😔",
  "Why are you doing this to me?😤",
  "Please give me a chance!❤️",
  "I am begging you to stop!🥺👉👈",
];

const reactions = [
  "That hurt a little 😢",
  "Still waiting patiently 💖",
  "Hmm… really? 🤔",
  "My heart is getting tired 💔",
  "I won’t give up ❤️",
];

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const typingText = document.getElementById("typingText");
const mainImage = document.getElementById("mainImage");
const result = document.getElementById("result");
const lockScreen = document.getElementById("lockScreen");

const sadSound = document.getElementById("sadSound");
const celebrateSound = document.getElementById("celebrateSound");

const shareArea = document.getElementById("shareArea");
const whatsappBtn = document.getElementById("whatsappBtn");

let noCount = 0;
let sadnessLevel = 0;
let cursorPullEnabled = false;

/* Scaling state */
let yesScale = 1;
let noScale = 1;

/* Reaction text element */
const reactionEl = document.createElement("div");
reactionEl.className = "reaction-text";
document.querySelector(".buttons-area").after(reactionEl);

/* Typing animation */
const text = `Hey ${name} 💝 Will you be my Valentine?`;
let i = 0;
(function type() {
  if (i < text.length) {
    typingText.textContent += text[i++];
    setTimeout(type, 55);
  }
})();

/* Cursor magnet (light) */
document.addEventListener("mousemove", (e) => {
  if (!cursorPullEnabled) return;

  const rect = yesBtn.getBoundingClientRect();
  const dx = rect.left + rect.width / 2 - e.clientX;
  const dy = rect.top + rect.height / 2 - e.clientY;

  const dist = Math.sqrt(dx * dx + dy * dy);
  document.body.style.cursor = dist < 200 ? "pointer" : "default";
});

/* NO click */
noBtn.addEventListener("click", () => {
  sadSound.currentTime = 0;
  sadSound.play();

  mainImage.src = "no.gif";

  noBtn.textContent = answers_no[noCount % answers_no.length];
  noCount++;

  /* YES grows aggressively */
  yesScale += 0.4;

  if (yesScale > 0.4) {
    yesBtn.style.position = "fixed";
    yesBtn.style.left = "45%";
    yesBtn.style.top = "45%";
    yesBtn.style.transformOrigin = "center";
    yesBtn.style.zIndex = "9999";
  }

  yesBtn.style.setProperty("--yes-scale", yesScale);

  /* NO shrinks */
  if (noScale > 0.6) {
    noScale -= 0.05;
    noBtn.style.transform = `scale(${noScale})`;
  }

  yesBtn.style.boxShadow = "0 0 40px rgba(255, 77, 109, 0.8)";

  /* Heartbeat + cursor pull */
  if (noCount === 3) yesBtn.classList.add("heartbeat");
  if (noCount === 4) cursorPullEnabled = true;

  /* Background reaction */
  sadnessLevel = Math.min(sadnessLevel + 1, 4);
  document.body.className = `sad-${sadnessLevel}`;

  /* Reaction text */
  reactionEl.style.opacity = "0";
  if (noCount % 2 === 0) {
    setTimeout(() => {
      reactionEl.textContent = reactions[noCount % reactions.length];
      reactionEl.style.opacity = "1";
    }, 200);
  }

  if (noCount >= answers_no.length) {
    alert("Ok, there is bug in code. Let's just start over..");
    location.reload();
  }
});

/* YES click */
yesBtn.addEventListener("click", () => {
  celebrateSound.currentTime = 0;
  celebrateSound.play();

  lockScreen.style.display = "none";
  mainImage.src = "yes.gif";

  yesBtn.style.display = "none";
  noBtn.style.display = "none";

  confetti({ particleCount: 250, spread: 90 });

  result.innerHTML = `
    You said YES!!!!! ❤️<br>
    Yepppie, see you sooonnn :)💖💖💖
  `;

  shareArea.classList.remove("hidden");

  const shareText = "I just said YES to being your Valentine ❤️";
  whatsappBtn.onclick = () =>
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`);
});

/* 🥚 Easter egg: double-click YES */
yesBtn.addEventListener("dblclick", () => {
  alert("👀 Secret unlocked… I knew you’d find it 💖");
});

/* 🥚 Easter egg: type LOVE */
let keyBuffer = "";
document.addEventListener("keydown", (e) => {
  keyBuffer += e.key.toLowerCase();
  if (keyBuffer.includes("love")) {
    confetti({ particleCount: 200, spread: 120 });
    keyBuffer = "";
  }
  if (keyBuffer.length > 10) keyBuffer = "";
});
