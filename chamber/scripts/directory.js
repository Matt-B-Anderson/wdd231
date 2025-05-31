document.addEventListener('DOMContentLoaded', async () => {

    const directory = document.getElementById('directory');
    if (directory) {
        let members2 = [];
        try {
            const res = await fetch('assets/data/members.json');
            if (res.ok) members2 = await res.json();
        } catch { }
        const grid = document.getElementById('gridView');
        const list = document.getElementById('listView');
        const render = v => {
            directory.className = `directory ${v}`;
            directory.innerHTML = members2.map(m =>
                `<article class="card">` +
                `<img src="images/${m.logo}" alt="${m.name} logo">` +
                `<h3>${m.name}</h3>` +
                `<p>${m.address}</p>` +
                `<p><strong>Phone:</strong> ${m.phone}</p>` +
                `<p><strong>Website:</strong> <a href="${m.url}" target="_blank">${m.url}</a></p>` +
                `</article>`
            ).join('');
        };
        if (grid) grid.addEventListener('click', () => render('grid'));
        if (list) list.addEventListener('click', () => render('list'));
        render('grid');
    }
});
