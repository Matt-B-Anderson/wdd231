async function loadStats() {
    const KEY = 'searchStats';
    let stats = JSON.parse(localStorage.getItem(KEY));

    if (!stats) {
        try {
            const res = await fetch('assets/data/searches.json');
            if (!res.ok) throw new Error(res.statusText);
            stats = await res.json();
        } catch (err) {
            console.error('Failed to fetch searches.json:', err);
            stats = { movies: [], tv: [] };
        }
    }

    stats.movies.sort((a, b) => b.count - a.count);
    stats.tv.sort((a, b) => b.count - a.count);

    localStorage.setItem(KEY, JSON.stringify(stats));

    return stats;
}



document.addEventListener('DOMContentLoaded', async () => {
    const links = document.querySelectorAll('.nav-list a');
    const page = location.pathname.split('/').pop() || 'index.html';
    links.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === page);
    });

    const stats = await loadStats();

    const populate = (arr, id) => {
        const ol = document.getElementById(id);
        ol.innerHTML = '';
        arr.slice(0, 10).forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.title} (${item.count})`;
            ol.appendChild(li);
        });
    };

    populate(stats.movies, 'topMovies');
    populate(stats.tv, 'topShows');

    const form = document.querySelector('.search-form');
    form.addEventListener('submit', e => {
        e.preventDefault();
        const q = form.q.value.trim();
        if (!q) return;

        window.location.href = `search.html?q=${encodeURIComponent(q)}`;
    });
});