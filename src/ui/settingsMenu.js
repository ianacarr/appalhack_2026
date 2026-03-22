const settingMenu = document.getElementById("settingsMenu");

const onSettingButtonClick = () => {
  settingMenu.classList.toggle("hidden");
};

const settingsMenuInit = () => {
  const settingsButton = document.getElementById("settingsButton");
  settingsButton.addEventListener("click", onSettingButtonClick);
  document.addEventListener("click", (e) => {
    if (!settingMenu.contains(e.target) && !settingsButton.contains(e.target)) {
      settingMenu.classList.add("hidden");
    }
  });
};

export default settingsMenuInit;
