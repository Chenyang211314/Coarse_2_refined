// Visual interactions only. No tracking, no external dependencies.

const progressBar = document.querySelector(".page-progress span");
const glow = document.querySelector(".cursor-glow");
const rails = [...document.querySelectorAll(".rail-dot")];
const sections = ["top", "spotlight", "semantic-showcase", "process", "ablation", "gallery"]
  .map(id => document.getElementById(id))
  .filter(Boolean);

function updateProgress() {
  const doc = document.documentElement;
  const scrolled = doc.scrollTop || document.body.scrollTop;
  const max = doc.scrollHeight - doc.clientHeight;
  const pct = max > 0 ? (scrolled / max) * 100 : 0;
  progressBar.style.width = `${pct}%`;
}

window.addEventListener("scroll", updateProgress, { passive: true });
updateProgress();

window.addEventListener("pointermove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    rails.forEach(dot => {
      dot.classList.toggle("active", dot.dataset.section === entry.target.id);
    });
  });
}, { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 });

sections.forEach(section => sectionObserver.observe(section));

document.querySelectorAll("[data-tilt]").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 7).toFixed(2)}deg) translateY(-2px)`;
  });

  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

document.querySelectorAll(".tabbar .tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    const target = tab.dataset.tab;
    document.querySelectorAll(".tabbar .tab").forEach(t => t.classList.toggle("active", t === tab));
    document.querySelectorAll(".semantic-panel").forEach(panel => {
      panel.classList.toggle("active", panel.dataset.panel === target);
    });
  });
});

document.querySelectorAll(".gallery-filter .filter").forEach((filter) => {
  filter.addEventListener("click", () => {
    const target = filter.dataset.filter;
    document.querySelectorAll(".gallery-filter .filter").forEach(f => f.classList.toggle("active", f === filter));
    document.querySelectorAll(".cinema-grid article").forEach(item => {
      const visible = target === "all" || item.dataset.category === target;
      item.classList.toggle("hidden", !visible);
    });
  });
});

const modal = document.querySelector(".video-modal");
const modalVideo = modal?.querySelector("video");
const modalClose = modal?.querySelector(".modal-close");

document.querySelectorAll("video").forEach((video) => {
  video.addEventListener("dblclick", () => {
    if (!modal || !modalVideo) return;
    const src = video.currentSrc || video.querySelector("source")?.src;
    if (!src) return;
    modalVideo.src = src;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    modalVideo.play().catch(() => {});
  });
});

function closeModal() {
  if (!modal || !modalVideo) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
  modalVideo.pause();
  modalVideo.removeAttribute("src");
}

modalClose?.addEventListener("click", closeModal);
modal?.addEventListener("click", (event) => {
  if (event.target === modal) closeModal();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeModal();
});
