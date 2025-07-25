import { initNavigation } from './nav.js';

document.addEventListener('DOMContentLoaded', () => {

    initNavigation();
    const TMDB_KEY = 'f395f6fa4d3341c013cac38bed5813ec';
    const resultsSection = document.getElementById('results');
    const form = document.querySelector('.search-form');
    const inputQ = document.getElementById('q');
    const selectT = document.getElementById('type');

    const params = new URLSearchParams(location.search);
    const queryParam = params.get('q')?.trim() || '';
    const typeParam = params.get('type') === 'tv' ? 'tv' : 'movie';

    inputQ.value = queryParam;
    selectT.value = typeParam;

    async function performSearch(query, type) {
        const searchUrl = `https://api.themoviedb.org/3/search/${type}` +
            `?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}`;
        let res = await fetch(searchUrl);
        if (!res.ok) throw new Error('Search failed');
        const results = (await res.json()).results || [];
        const item = results[0];
        if (!item) {
            document.getElementById('results').textContent = 'No results found.';
            return;
        }


        const title = type === 'movie' ? item.title : item.name;
        const posterUrl = item.poster_path
            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
            : null;

        let rating;
        if (type === 'movie') {
            res = await fetch(
                `https://api.themoviedb.org/3/movie/${item.id}/release_dates` +
                `?api_key=${TMDB_KEY}`
            );
            const rd = await res.json();
            const us = (rd.results || []).find(c => c.iso_3166_1 === 'US');
            rating = us?.release_dates.find(d => d.certification)?.certification || 'Unrated';
        } else {
            res = await fetch(
                `https://api.themoviedb.org/3/tv/${item.id}/content_ratings` +
                `?api_key=${TMDB_KEY}`
            );
            const cr = await res.json();
            const us = (cr.results || []).find(c => c.iso_3166_1 === 'US');
            rating = us?.rating || 'Unrated';
        }

        res = await fetch(
            `https://api.themoviedb.org/3/${type}/${item.id}/external_ids` +
            `?api_key=${TMDB_KEY}`
        );
        const imdbId = (await res.json()).imdb_id;

        res = await fetch('assets/data/parental_guide.json');
        const pgData = await res.json();
        const entries = pgData.filter(e => e.tconst === imdbId);

        const KEY = 'searchStats';
        let stats = JSON.parse(localStorage.getItem(KEY));
        if (!stats) {
            stats = { movies: [], tv: [] };
        }
        const arr = stats[type === 'movie' ? 'movies' : 'tv'];
        const idx = arr.findIndex(x => x.title === title);
        if (idx >= 0) {
            arr[idx].count++;
        } else {
            arr.push({ title, count: 1 });
        }
        arr.sort((a, b) => b.count - a.count);
        localStorage.setItem(KEY, JSON.stringify(stats));

        document.getElementById('resultTitle').textContent = title;
        const posterEl = document.getElementById('poster');
        posterEl.innerHTML = '';
        if (posterUrl) {
            const img = document.createElement('img');
            img.src = posterUrl;
            img.alt = title;
            posterEl.appendChild(img);
        }

        const pgContainer = document.getElementById('parentalGuide');
        pgContainer.innerHTML = '';
        if (entries.length) {
            const pg = entries[0];
            const ratingH3 = document.createElement('h3');
            ratingH3.textContent = `Rating: ${rating}`
            pgContainer.appendChild(ratingH3)
            const mpaaH = document.createElement('h4');
            mpaaH.textContent = 'MPAA / Certificate';
            pgContainer.appendChild(mpaaH);
            const mpaaP = document.createElement('p');
            mpaaP.textContent = pg.mpaa;
            pgContainer.appendChild(mpaaP);

            ['sex', 'violence', 'profanity', 'drugs', 'intense'].forEach(cat => {
                const label = cat.charAt(0).toUpperCase() + cat.slice(1);
                const h4 = document.createElement('h4');
                h4.textContent = label;
                pgContainer.appendChild(h4);
                const p = document.createElement('p');
                p.textContent = pg[cat] || 'None';
                pgContainer.appendChild(p);
            });
        } else {
            pgContainer.textContent = 'No parental‐guide info available.';
        }
        resultsSection.classList.remove('hidden');
    }

    if (queryParam) {
        performSearch(queryParam, typeParam).catch(console.error);
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const q = inputQ.value.trim();
        const t = selectT.value;
        if (!q) return;
        location.href = `search.html?q=${encodeURIComponent(q)}&type=${t}`;
    });
});
