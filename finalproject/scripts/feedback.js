document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const links = document.querySelectorAll('.nav-list a');
    const page = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === page);
    });
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const expanded = navList.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', expanded);
        });
    }

    const form = document.getElementById('feedbackForm');
    const modal = document.getElementById('subscribeModal');
    const yesBtn = document.getElementById('subYes');
    const noBtn = document.getElementById('subNo');

    let formData = {};

    form.addEventListener('submit', e => {
        e.preventDefault();
        const data = new FormData(form);
        formData = {
            name: data.get('name'),
            email: data.get('email'),
            phone: data.get('phone'),
            rating: data.get('rating'),
            suggestions: data.get('suggestions')
        };
        modal.classList.remove('hidden');
    });

    function finish(subscribe) {
        const params = new URLSearchParams({
            ...formData,
            subscribe
        });
        location.href = `thankyou.html?${params.toString()}`;
    }

    yesBtn.addEventListener('click', () => finish('yes'));
    noBtn.addEventListener('click', () => finish('no'));
});