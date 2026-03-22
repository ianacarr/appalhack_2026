const seedMenu = document.getElementById("seedMenu");

const onSeedButtonClick = () => {
  seedMenu.classList.toggle("hidden");
};

const onSeedSubmit = (client) => () => {
  const fileInput = document.getElementById("seedInput");
  try {
    client.seed(fileInput.files, onSeedStart);
  } catch (error) {
    console.log(error);
  }
};

const onSeedStart = (torrent) => {
  const statusText = document.getElementById("statusText");
  statusText.textContent = "Seeding...";
};

const seedMenuInit = (client) => {
  const seedButton = document.getElementById("seedButton");
  const seedSubmit = document.getElementById("seedSubmit");
  seedButton.addEventListener("click", onSeedButtonClick);
  seedSubmit.addEventListener("click", onSeedSubmit(client));
};

export default seedMenuInit;
