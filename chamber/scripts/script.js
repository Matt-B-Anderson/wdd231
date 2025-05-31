document.addEventListener('DOMContentLoaded', async () => {
    const currentPage = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-list a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) link.classList.add('active');
        else link.classList.remove('active');
    });

    const yearEl = document.getElementById('year');
    const lastModEl = document.getElementById('lastMod');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModEl) lastModEl.textContent = new Date(document.lastModified).toLocaleString();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const saved = localStorage.getItem('theme') || 'light';
        if (saved === 'dark') document.body.classList.add('dark-mode');
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('dark-mode');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }

    const menuToggle = document.getElementById('menuToggle');
    const navList = document.getElementById('nav-list');
    if (menuToggle && navList) {
        menuToggle.addEventListener('click', () => {
            const open = navList.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', open);
        });
    }


    const eventsList = document.getElementById('eventsList');
    if (eventsList) {
        eventsList.innerHTML = '<ul>' +
            '<li>Annual Gala — June 15, 2025</li>' +
            '<li>Networking Breakfast — July 10, 2025</li>' +
            '<li>Business Summit Webinar — August 3, 2025</li>' +
            '</ul>';

        try {
            const resp = await fetch(
                `http://api.openweathermap.org/data/3.0/onecall?lat=39.9625&lon=83.0032&exclude=minutely,hourly,alerts&units=imperial&appid=5ad47e7815c0b9e60a8b31b074db98dc`
            );
            if (!resp.ok) throw new Error(resp.statusText);
            const data = await resp.json();
            const curEl = document.getElementById('weatherCurrent');
            if (curEl) {
                curEl.innerHTML = `<p><strong>${Math.round(data.current.temp)}° F</strong></p>` +
                    `<p>${data.current.weather[0].description}</p>`;
            }
            const fcEl = document.getElementById('weatherForecast');
            if (fcEl) {
                fcEl.innerHTML = data.daily.slice(1, 4).map(d => {
                    const day = new Date(d.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' });
                    return `<p>${day}: <strong>${Math.round(d.temp.day)}° F</strong></p>`;
                }).join('');
            }
        } catch { }

        try {
            const resp2 = await fetch('assets/data/members.json');
            if (!resp2.ok) throw new Error(resp2.statusText);
            const members = await resp2.json();
            const eligible = members.filter(m => m.level >= 2);
            for (let i = eligible.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [eligible[i], eligible[j]] = [eligible[j], eligible[i]];
            }
            const selected = eligible.slice(0, 3);
            const spotEl = document.getElementById('spotlights');
            if (spotEl) {
                spotEl.innerHTML = selected.map(m =>
                    `<article class="card">` +
                    `<img src="images/${m.logo}" alt="${m.name} logo">` +
                    `<h4>${m.name}</h4>` +
                    `<p>${m.address}</p>` +
                    `<p><strong>Phone:</strong> ${m.phone}</p>` +
                    `<p><strong>Website:</strong> <a href="${m.url}" target="_blank">${m.url}</a></p>` +
                    `</article>`
                ).join('');
            }
        } catch { }
    }
});
