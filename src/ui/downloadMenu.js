const downloadMenu = document.getElementById("downloadMenu");

const onDownloadButtonClick = () => {
  downloadMenu.classList.toggle("hidden");
};

const downloadMenuInit = () => {
  const downloadButton = document.getElementById("downloadButton");
  downloadButton.addEventListener("click", onDownloadButtonClick);
};

export default downloadMenuInit;
