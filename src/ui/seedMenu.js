import { transferState } from "../state";
import { openPanel, closePanel } from "./panelUtils";
import { resetChat, showChat } from "./chat";

const seedMenu = document.getElementById("seedMenu");
const statusText = document.getElementById("statusText");

const onSeedButtonClick = () => {
  seedMenu.classList.contains("hidden")
    ? openPanel(seedMenu)
    : closePanel(seedMenu);
};

const stopStatus = () => {
  clearInterval(transferState.statusInterval);
  transferState.statusInterval = null;
  statusText.classList.add("hidden");
};

const updateStatus = (torrent) => {
  const speed = (bytes) => (bytes / 1024).toFixed(1) + " KB/s";
  statusText.textContent =
    `Peers: ${torrent.numPeers} | ` +
    `Down: ${speed(torrent.downloadSpeed)} | ` +
    `Up: ${speed(torrent.uploadSpeed)}`;
};

const startStatus = (torrent) => {
  statusText.classList.remove("hidden");
  updateStatus(torrent);
  if (transferState.statusInterval) clearInterval(transferState.statusInterval);
  transferState.statusInterval = setInterval(() => updateStatus(torrent), 1000);
};

const removeTorrent = (client) => {
  client.remove(transferState.currentTorrent);
  transferState.currentTorrent = null;
  transferState.active = false;
  stopStatus();
  resetChat();
};

const onSeedSubmit = (client, onWire) => () => {
  const fileInput = document.getElementById("seedInput");
  const seedSubmit = document.getElementById("seedSubmit");

  if (!fileInput.files.length) return;

  seedSubmit.textContent = "Kindling...";
  seedSubmit.disabled = true;

  if (transferState.active) {
    try {
      removeTorrent(client);
    } catch (error) {
      console.log(error);
      seedSubmit.textContent = "Kindle the Fire";
      seedSubmit.disabled = false;
      return;
    }
  }

  try {
    client.seed(fileInput.files, (torrent) => {
      transferState.active = true;
      transferState.currentTorrent = torrent;
      seedSubmit.textContent = "Kindle the Fire";
      seedSubmit.disabled = false;
      document.getElementById("magnetUri").value = torrent.magnetURI;
      document.getElementById("magnetResult").classList.remove("hidden");
      startStatus(torrent);
      showChat();
      torrent.on("wire", (wire, addr) =>
        onWire(wire, addr.substring(0, addr.lastIndexOf(":"))),
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
