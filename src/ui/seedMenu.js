const seedMenu = document.getElementById("seedMenu");

const onSeedButtonClick = () => {
  seedMenu.classList.toggle("hidden");
};

const seedMenuInit = () => {
  const seedButton = document.getElementById("seedButton");
  seedButton.addEventListener("click", onSeedButtonClick);
};

export default seedMenuInit;
