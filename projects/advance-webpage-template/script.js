//--------------- color menu pop-up logic ---------------
const colorIcons = document.querySelector(".color-theme"),
      icons = document.querySelector(".color-theme .color-icon");

icons.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent conflict with document click
  colorIcons.classList.toggle("open");
});

//------ Close color box when clicking outside -----
document.addEventListener("click", (e) => {
  if (!colorIcons.contains(e.target)) {
    colorIcons.classList.remove("open");
  }
});

//--------------- color switch/night mode logic ---------------
let lastThemeButton = document.querySelector(".btn.active");
const buttons = document.querySelectorAll(".btn");
const root = document.querySelector(":root");
const darkToggle = document.querySelector(".dark-mode-btn i");
const colorText = document.querySelectorAll(".color-text");
const boxElements = document.querySelectorAll(".box");


function applyThemeColors(colors) {
  root.style.setProperty("--white", colors[0]);
  root.style.setProperty("--text-color", colors[1]);
  root.style.setProperty("--primary-color", colors[2]);
  root.style.setProperty("--secondary-color", colors[3]);
  root.style.setProperty("--ui-bg", colors[4]);
}

function toggleDarkMode(darkModeStyle) {
  const method = darkModeStyle ? "add" : "remove";
  colorText.forEach(el => el.classList[method]("darkMode"));
  boxElements.forEach(el => el.classList[method]("darkMode"));
}

buttons.forEach(button => {
  button.addEventListener("click", (e) => {
    const target = e.currentTarget;

    const open = document.querySelector(".open");
    if (open) open.classList.remove("open");

    document.querySelector(".btn.active")?.classList.remove("active");
    target.classList.add("active");

    const darkModeOn = target.classList.contains("fa-moon");
    const lightModeOn = target.classList.contains("fa-sun");

    // Handle color theme buttons
    if (!darkModeOn && !lightModeOn) {
      lastThemeButton = target;
      const color = target.getAttribute("data-color").split(" ");
      applyThemeColors(color);

      if (darkToggle.classList.contains("fa-sun")) {
        darkToggle.classList.replace("fa-sun", "fa-moon");
        toggleDarkMode(false);
        darkToggle.parentElement.title = "Dark Mode";
      }
    }

    // Handle dark mode toggle
    if (darkModeOn) {
      target.classList.replace("fa-moon", "fa-sun");
      toggleDarkMode(true);
      const darkColors = target.getAttribute("data-color").split(" ");
      applyThemeColors(darkColors);
      target.parentElement.title = "Light Mode";
    } else if (lightModeOn) {
      target.classList.replace("fa-sun", "fa-moon");
      toggleDarkMode(false);
      if (lastThemeButton) lastThemeButton.click();
      target.parentElement.title = "Dark Mode";
    }
  });
});

//--------------- tab navigation logic ---------------
const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll(".page-content");

navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    navLinks.forEach(nav => nav.classList.remove("active-nav"));
    link.classList.add("active-nav");

    sections.forEach(sec => sec.classList.remove("active-section"));
    const targetID = link.getAttribute("href").substring(1);
    document.getElementById(targetID).classList.add("active-section");
  });
});

//--------------- Explore button logic ---------------
const exploreBtn = document.getElementById("exploreBtn");

exploreBtn.addEventListener("click", (e) => {
  e.preventDefault();

  navLinks.forEach(nav => nav.classList.remove("active-nav"));
  sections.forEach(sec => sec.classList.remove("active-section"));

  document.querySelector(".nav-links a[href='#explore']").classList.add("active-nav");
  document.getElementById("explore").classList.add("active-section");
});

//--------------- Nav Menu logic for phones ---------------
const toggle = document.querySelector('.nav-links-menu-toggle');
const navLinksContainer = document.querySelector('.nav-links');

toggle.onclick = (e) => {
  e.stopPropagation(); // prevent toggle click from closing it immediately
  navLinksContainer.classList.toggle('show');
};

// Close nav when clicking outside
document.addEventListener('click', (e) => {
  if (!navLinksContainer.contains(e.target) && !toggle.contains(e.target)) {
    navLinksContainer.classList.remove('show');
  }
});

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    navLinksContainer.classList.remove('show');
  });
});