const seedMenu = document.getElementById("seedMenu");

const onSeedButtonClick = () => {
  seedMenu.classList.toggle("hidden");
};

const seedMenuInit = (client) => {
  const seedButton = document.getElementById("seedButton");
  const seedSubmit = document.getElementById("seedSubmit");
  seedButton.addEventListener("click", onSeedButtonClick);
  seedSubmit.addEventListener("click", onSeedSubmit(client));
};

const onSeedSubmit = (client) => () => {
  const fileInput = document.getElementById("seedInput");
  try {
    client.seed(fileInput.files);
  } catch (error) {
    console.log(error);
  }
};

export default seedMenuInit;
