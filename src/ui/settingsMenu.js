const settingMenu = document.getElementById("settingsMenu");

const onSettingButtonClick = () => {
  settingMenu.classList.toggle("hidden");
};

const settingsMenuInit = () => {
  const settingsButton = document.getElementById("settingsButton");
  settingsButton.addEventListener("click", onSettingButtonClick);
};

export default settingsMenuInit;
