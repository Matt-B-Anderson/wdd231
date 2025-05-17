document.addEventListener('DOMContentLoaded', async () => {
    const yearEl = document.getElementById('year');
    const lastModEl = document.getElementById('lastMod');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
    if (lastModEl) lastModEl.textContent = new Date(document.lastModified).toLocaleString();

    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const saved = localStorage.getItem('theme') || 'light';
        if (saved === 'dark') document.body.classList.add('dark-mode');
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem(
                'theme',
                document.body.classList.contains('dark-mode') ? 'dark' : 'light'
            );
        });
    }

    let members = [];
    try {
        const res = await fetch('/assets/data/members.json');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        members = await res.json();
    } catch (err) {
        console.error('Failed to load members.json:', err);
        return;
    }

    const directory = document.getElementById('directory');
    const gridBtn = document.getElementById('gridView');
    const listBtn = document.getElementById('listView');
    const render = view => {
        if (!directory) return;
        directory.className = `directory ${view}`;
        directory.innerHTML = members.map(m => `
            <article class="card">
                <img src="/assets/images/${m.logo}" alt="${m.name} logo">
                <h3>${m.name}</h3>
                <p>${m.address}</p>
                <p><strong>Phone:</strong> ${m.phone}</p>
                <p><strong>Website:</strong>
                    <a href="${m.url}" target="_blank" rel="noopener">${m.url}</a>
                </p>
            </article>
    `).join('');
    };

    if (gridBtn) gridBtn.addEventListener('click', () => render('grid'));
    if (listBtn) listBtn.addEventListener('click', () => render('list'));

    render('grid');
});