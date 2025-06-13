export function initNavigation({
    linkSelector = '.nav-list a',
    toggleSelector = '#menuToggle',
    navSelector = '.nav-list'
} = {}) {
    const links = document.querySelectorAll(linkSelector);
    const page = location.pathname.split('/').pop() || 'index.html';
    const menuToggle = document.querySelector(toggleSelector);
    const navList = document.querySelector(navSelector);

    links.forEach(a =>
        a.classList.toggle('active', a.getAttribute('href') === page)
    );

    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const isOpen = navList.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
    }
}