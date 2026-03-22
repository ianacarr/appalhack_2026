import { transferState } from "../state";
import { openPanel, closePanel } from "./panelUtils";

const downloadMenu = document.getElementById("downloadMenu");

const onDownloadButtonCLick = () => {
  downloadMenu.classList.contains("hidden")
    ? openPanel(downloadMenu)
    : closePanel(downloadMenu);
};

const onTorrentReady = (torrent, onWire) => {
  transferState.active = true;
  document.getElementById("statusText").textContent = "Torrenting...";
  torrent.on("wire", (wire, addr) =>
    onWire(addr.substring(0, addr.lastIndexOf(":"))),
  );
  torrent.on("done", () => {
    transferState.active = false;
    document.getElementById("statusText").textContent = "Done.";
  });
};

const onDownloadSubmit = (client, onWire) => async () => {
  if (transferState.active) return;

  const torrentFileInput = document.getElementById("torrentFileInput");
  const magnetInput = document.getElementById("magnetInput");
  const downloadSubmit = document.getElementById("downloadSubmit");

  if (!torrentFileInput.files.length && !magnetInput.value) return;

  downloadSubmit.textContent = "Fetching...";
  downloadSubmit.disabled = true;

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
  downloadButton.addEventListener("click", onDownloadButtonCLick);
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
