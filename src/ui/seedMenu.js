import { transferState } from "../state";
import { openPanel, closePanel } from "./panelUtils";

const seedMenu = document.getElementById("seedMenu");

const onSeedButtonClick = () => {
  seedMenu.classList.contains("hidden")
    ? openPanel(seedMenu)
    : closePanel(seedMenu);
};

const onSeedSubmit = (client, onWire) => () => {
  const fileInput = document.getElementById("seedInput");
  const seedSubmit = document.getElementById("seedSubmit");

  if (!fileInput.files.length) return;

  seedSubmit.textContent = "Kindling...";
  seedSubmit.disabled = true;

  if (transferState.active) return;

  try {
    client.seed(fileInput.files, (torrent) => {
      transferState.active = true;
      document.getElementById("statusText").textContent = "Seeding...";
      document.getElementById("magnetUri").value = torrent.magnetURI;
      document.getElementById("magnetResult").classList.remove("hidden");
      torrent.on("wire", (wire, addr) =>
        onWire(addr.substring(0, addr.lastIndexOf(":"))),
      );
    });
  } catch (error) {
    console.log(error);
    seedSubmit.textContent = "Kindle the Fire";
    seedSubmit.disabled = false;
  }
};

const seedMenuInit = (client, onWire) => {
  const seedButton = document.getElementById("seedButton");
  const seedSubmit = document.getElementById("seedSubmit");
  const magnetCopy = document.getElementById("magnetCopy");
  seedButton.addEventListener("click", onSeedButtonClick);
  seedSubmit.addEventListener("click", onSeedSubmit(client, onWire));
  magnetCopy.addEventListener("click", () => {
    const magnetUri = document.getElementById("magnetUri");
    navigator.clipboard.writeText(magnetUri.value);
    magnetCopy.classList.add("copied");
    setTimeout(() => magnetCopy.classList.remove("copied"), 1500);
  });
  document.addEventListener("click", (e) => {
    if (!seedMenu.contains(e.target) && !seedButton.contains(e.target)) {
      closePanel(seedMenu);
    }
  });
};

export default seedMenuInit;
