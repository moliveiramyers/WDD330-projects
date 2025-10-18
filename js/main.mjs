import { login, logout, observeUser, restoreUser } from "./auth.mjs";
import { attachPostHandlers } from "./posts.mjs";
import { loadUpcomingEvents } from "./events.mjs";


document.addEventListener("DOMContentLoaded", () => {
  restoreUser();
  observeUser();
  loadUpcomingEvents();



  document.getElementById("login-btn").addEventListener("click", login);
  document.getElementById("logout-btn").addEventListener("click", logout);
})


// current year
const currentYear = document.getElementById("current-year");
const year = new Date().getFullYear();
currentYear.textContent = year;


// menuHamburger
const menuBtn = document.querySelector('.menu-btn');
const nav = document.querySelector('.main-nav');
const overlay = document.querySelector('.overlay');




menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  nav.classList.toggle('show');
  overlay.classList.toggle('show');


});


// close when clicking outside
document.addEventListener('click', (e) => {
  if (nav.classList.contains('show') && !nav.contains(e.target) && e.target !== menuBtn) {
    nav.classList.remove('show');
    overlay.classList.remove('show');


  }
});




// SIGN IN WITH GOOGLE & ACCOUNTS


document.addEventListener("DOMContentLoaded", () => {
  restoreUser(); // restores from localStorage if available
  observeUser(); // keeps firebase in sync
  document.getElementById("login-btn").addEventListener("click", login);
  document.getElementById("logout-btn").addEventListener("click", logout);
});






// load the Main Content from index.html


const mainContent = document.getElementById("main-content");


document.querySelectorAll(".nav a").forEach(link => {
  link.addEventListener("click", async e => {
    e.preventDefault();
    const page = link.dataset.page;
    sessionStorage.setItem("lastPage", page);
    await loadPage(page);
  });
});


// LoadPage
async function loadPage(page) {


  mainContent.innerHTML = "<p>Loading...</p>";




  try {
    const module = await import(`./${page}.mjs`);
    const content = await module.renderPage();
    mainContent.innerHTML = content;






    if (page === "polls") {
      if (module.pollCreator) module.pollCreator(); document.querySelectorAll(".poll-card").forEach(card => {
        module.updatePollUI(card);
      });
    }
  } catch (err) {
    mainContent.innerHTML = "<p>Could not load this page.</p>";
    console.error(err);
  }
}


// Destaque + Notifications


const pollNotificationsContainer = document.getElementById("poll-notifications");


export async function loadPollNotifications() {
  const polls = [
    { title: "Poll 1", status: "pending" },
    { title: "Poll 2", status: "pending" }
  ];


  pollNotificationsContainer.innerHTML = polls
    .map(p => `<div class="poll-notification">${p.title}</div>`)
    .join("");
}




window.addEventListener("DOMContentLoaded", () => {
  attachPostHandlers();
  loadPollNotifications();
});








window.addEventListener("DOMContentLoaded", () => {
  const savedPage = sessionStorage.getItem("lastPage");
  const page = location.hash.replace("#", "") || savedPage || "home";
  loadPage(page);
});


window.addEventListener("hashchange", () => {
  const page = location.hash.replace("#", "") || "home";
  loadPage(page);
});
