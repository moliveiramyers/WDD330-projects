


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