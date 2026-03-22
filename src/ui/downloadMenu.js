const downloadMenu = document.getElementById("downloadMenu");

const onDownloadButtonCLick = () => {
  downloadMenu.classList.toggle("hidden");
};

const onDownloadSubmit = (client) => () => {
  const magnetInput = document.getElementById("magnetInput");
  const magnet = magnetInput.value;
  try {
    client.add(magnet);
  } catch (error) {
    console.log(error);
  }
};

const onTorrentStart = (torrent) => {
  const statusText = document.getElementById("statusText");
  statusText.textContent = "Torrenting...";
};

const downloadMenuInit = (client) => {
  const downloadButton = document.getElementById("downloadButton");
  const downloadSubmit = document.getElementById("downloadSubmit");
  downloadButton.addEventListener("click", onDownloadButtonCLick);
  downloadSubmit.addEventListener("click", onDownloadSubmit(client));
};

export default downloadMenuInit;
