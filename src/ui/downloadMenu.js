const downloadMenu = document.getElementById("downloadMenu");

const onDownloadButtonCLick = () => {
  downloadMenu.classList.toggle("hidden");
};

const downloadMenuInit = (client) => {
  const downloadButton = document.getElementById("downloadButton");
  const downloadSubmit = document.getElementById("downloadSubmit");
  downloadButton.addEventListener("click", onDownloadButtonCLick);
  downloadSubmit.addEventListener("click", onDownloadSubmit(client));
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

export default downloadMenuInit;
