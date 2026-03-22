export function openPanel(panel) {
  panel.classList.remove("hidden", "panel-leaving");
  void panel.offsetWidth; // force reflow so animation always retriggers
  panel.classList.add("panel-entering");
}

export function closePanel(panel) {
  if (panel.classList.contains("hidden")) return;
  panel.classList.remove("panel-entering");
  panel.classList.add("panel-leaving");
  panel.addEventListener(
    "animationend",
    () => {
      panel.classList.add("hidden");
      panel.classList.remove("panel-leaving");
    },
    { once: true },
  );
}
