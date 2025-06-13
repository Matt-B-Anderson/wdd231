import { initNavigation } from './nav.js';
import { loadStats } from './stats.js';

const TMDB_KEY = 'f395f6fa4d3341c013cac38bed5813ec';

async function main() {
    initNavigation();

    const stats = await loadStats();

    const top15 = [
        ...stats.movies.map(m => ({ ...m, media: 'Movie' })),
        ...stats.tv.map(t => ({ ...t, media: 'TV Show' }))
    ]
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);

    const cards = await Promise.all(top15.map(async item => {
        const path = item.media === 'Movie' ? 'movie' : 'tv';
        const res = await fetch(
            `https://api.themoviedb.org/3/search/${path}` +
            `?api_key=${TMDB_KEY}&query=${encodeURIComponent(item.title)}`
        );
        const info = ((await res.json()).results || [])[0] || {};
        return {
            title: item.title,
            type: item.media,
            searches: item.count,
            releaseDate: info.release_date || info.first_air_date || 'Unknown',
            tmdbRating: info.vote_average != null ? info.vote_average : '—',
            poster: info.poster_path
                ? `https://image.tmdb.org/t/p/w300${info.poster_path}`
                : 'images/placeholder.webp'
        };
    }));

    const container = document.getElementById('dynamic-container');
    container.innerHTML = cards.map(d => `
    <article class="card">
      <img src="${d.poster}" alt="${d.title} poster" loading="lazy">
      <h3>${d.title}</h3>
      <p><strong>Type:</strong> ${d.type}</p>
      <p><strong>Searches:</strong> ${d.searches}</p>
      <p><strong>Release:</strong> ${d.releaseDate}</p>
      <p><strong>Rating:</strong> ${d.tmdbRating}</p>
    </article>
  `).join('');

    const form = document.querySelector('.search-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const q = form.q.value.trim();
            const t = form.type.value;
            if (!q) return;
            location.href = `search.html?q=${encodeURIComponent(q)}&type=${t}`;
        });
    }
}

document.addEventListener('DOMContentLoaded', main);