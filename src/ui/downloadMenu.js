import { transferState } from "../state.js";
import { openPanel, closePanel } from "./panelUtils.js";
import { resetChat, showChat } from "./chat.js";

const downloadMenu = document.getElementById("downloadMenu");
const statusText = document.getElementById("statusText");

const onDownloadButtonClick = () => {
  downloadMenu.classList.contains("hidden")
    ? openPanel(downloadMenu)
    : closePanel(downloadMenu);
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
    `Up: ${speed(torrent.uploadSpeed)} | ` +
    `Progress: ${(torrent.progress * 100).toFixed(1)}%`;
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

const onTorrentReady = (torrent, onWire) => {
  transferState.active = true;
  transferState.currentTorrent = torrent;
  const downloadSubmit = document.getElementById("downloadSubmit");
  downloadSubmit.textContent = "Fetch";
  downloadSubmit.disabled = false;
  startStatus(torrent);
  showChat();
  torrent.on("wire", (wire, addr) =>
    onWire(wire, addr.substring(0, addr.lastIndexOf(":"))),
  );
  torrent.on("done", () => {
    transferState.active = false;
    stopStatus();
  });
};

const onDownloadSubmit = (client, onWire) => async () => {
  const torrentFileInput = document.getElementById("torrentFileInput");
  const magnetInput = document.getElementById("magnetInput");
  const downloadSubmit = document.getElementById("downloadSubmit");

  if (!torrentFileInput.files.length && !magnetInput.value) return;

  downloadSubmit.textContent = "Fetching...";
  downloadSubmit.disabled = true;

  if (transferState.active) {
    try {
      removeTorrent(client);
    } catch (error) {
      console.log(error);
      downloadSubmit.textContent = "Fetch";
      downloadSubmit.disabled = false;
      return;
    }
  }

  try {
    if (torrentFileInput.files.length) {
      const buffer = await torrentFileInput.files[0].arrayBuffer();
      client.add(new Uint8Array(buffer), (torrent) =>
        onTorrentReady(torrent, onWire),
      );
    } else {
      client.add(magnetInput.value, (torrent) =>
        onTorrentReady(torrent, onWire),
      );
    }
  } catch (error) {
    console.log(error);
    downloadSubmit.textContent = "Fetch";
    downloadSubmit.disabled = false;
  }
};

const downloadMenuInit = (client, onWire) => {
  const downloadButton = document.getElementById("downloadButton");
  const downloadSubmit = document.getElementById("downloadSubmit");
  downloadButton.addEventListener("click", onDownloadButtonClick);
  downloadSubmit.addEventListener("click", onDownloadSubmit(client, onWire));
  document.addEventListener("click", (e) => {
    if (
      !downloadMenu.contains(e.target) &&
      !downloadButton.contains(e.target)
    ) {
      closePanel(downloadMenu);
    }
  });
};

export default downloadMenuInit;
