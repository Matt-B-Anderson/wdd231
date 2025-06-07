document.addEventListener('DOMContentLoaded', async () => {

    const key = 'lastVisit';
    const now = Date.now();
    const last = parseInt(localStorage.getItem(key), 10);
    let msg = 'Welcome! Let us know if you have any questions.';
    if (last) {
        const days = Math.floor((now - last) / 86400000);
        if (days === 0) msg = 'Back so soon! Awesome!';
        else msg = `You last visited ${days} day${days > 1 ? 's' : ''} ago.`;
    }
    localStorage.setItem(key, now);
    document.getElementById('visitorMsg').textContent = msg;

    let items = [];
    try {
        const res = await fetch('./assets/data/discover.json');
        if (!res.ok) throw new Error(res.statusText);
        items = await res.json();
    } catch (e) {
        console.error('Discover load error', e);
        return;
    }

    const grid = document.getElementById('discoverGrid');
    items.forEach((it, i) => {
        const card = document.createElement('article');
        card.className = 'discover-card';
        card.style.gridArea = `card${i + 1}`;
        card.innerHTML = `
        <h2>${it.name}</h2>
        <figure><img src="./images/${it.image}" alt="${it.name}"></figure>
        <address>${it.address}</address>
        <p>${it.description}</p>
        <button>Learn More</button>
        `;
        grid.appendChild(card);
    });
});